import emailjs from '@emailjs/browser';
import { Order } from '../types';

/**
 * Order notifications through EmailJS.
 *
 * These three values are EmailJS's *public* browser identifiers — they are
 * designed to be visible in client-side code and are safe to ship. The EmailJS
 * Private Key is the secret one; it must never appear in this project. Lock the
 * public key down in the EmailJS dashboard under Account -> Security by
 * listing your site's domains under "Allowed origins".
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_4y3191s';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_0jzhrf9';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'B-IQlCgvLUYHOuh6n';

/**
 * Exact variable names sent to the template. Every one of these must exist in
 * the EmailJS template as {{variable}} — see docs/emailjs-template.md.
 */
export interface OrderEmailParams {
  order_id: string;
  order_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  quantity: string;
  price: string;
  subtotal: string;
  addons_total: string;
  delivery_cost: string;
  taxes: string;
  total_amount: string;
  delivery_address: string;
  payment_method: string;
  order_items: string;
  reply_to: string;
  email: string;
  cost: { shipping: string; tax: string; total: string };
  orders: Array<{ name: string; units: string; price: string; image_url: string }>;
}

const money = (value: number): string => `$${Math.round(value).toLocaleString('en-US')}`;
const amount = (value: number): string => Math.round(value).toLocaleString('en-US');

/**
 * Turns a placed order into the flat set of strings the email template expects.
 * Everything comes from the real order — nothing is invented or defaulted to
 * sample data.
 */
export const buildOrderEmailParams = (order: Order, customerEmail: string): OrderEmailParams => {
  const items = order.items && order.items.length > 0
    ? order.items
    : [{ productName: order.pet.breed, quantity: 1, price: order.pet.priceUSD, total: order.totalAmount }];

  const lines = items.map(
    item => `${item.quantity} x ${item.productName} — ${money(item.price)} each, line total ${money(item.total)}`
  );

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    order_id: order.id,
    order_date: order.orderDate,
    customer_name: order.customerName,
    customer_email: customerEmail,
    customer_phone: order.phone,
    product_name: items.map(item => item.productName).join(', '),
    quantity: String(totalQuantity),
    price: money(order.subtotal),
    subtotal: money(order.subtotal),
    addons_total: money(order.addonsTotal),
    delivery_cost: money(order.deliveryCost),
    taxes: money(order.taxes),
    total_amount: money(order.totalAmount),
    delivery_address: [order.deliveryAddress, order.cityStateZip].filter(Boolean).join(', '),
    payment_method: order.paymentMethod,
    order_items: lines.join('\n'),
    reply_to: customerEmail,
    email: customerEmail,
    cost: {
      shipping: amount(order.deliveryCost),
      tax: amount(order.taxes),
      total: amount(order.totalAmount)
    },
    orders: items.map(item => ({
      name: item.productName,
      units: String(item.quantity),
      price: amount(item.total),
      image_url: order.pet.imageUrl ?? ''
    }))
  };};

/** Orders already emailed in this browser session — a second click sends nothing. */
const sentOrderIds = new Set<string>();

export type SendResult =
  | { status: 'sent' }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; message: string };

/**
 * Sends one order notification. Safe to call twice for the same order: the
 * second call is ignored.
 */
export const sendOrderEmail = async (order: Order, customerEmail: string): Promise<SendResult> => {
  if (sentOrderIds.has(order.id)) {
    return { status: 'skipped', reason: 'This order has already been emailed.' };
  }

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return { status: 'skipped', reason: 'EmailJS is not configured.' };
  }

  // Claim the id before awaiting, so two quick clicks cannot both get through.
  sentOrderIds.add(order.id);

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, { ...buildOrderEmailParams(order, customerEmail) }, {
      publicKey: PUBLIC_KEY
    });
    return { status: 'sent' };
  } catch (err) {
    // Let the customer retry a genuine failure.
    sentOrderIds.delete(order.id);
    const message =
      (err as { text?: string })?.text || (err as { message?: string })?.message || 'Unknown error';
    console.error('EmailJS order notification failed:', err);
    return { status: 'failed', message };
  }
};

/** Test hook so the send-once behaviour can be exercised repeatedly. */
export const resetSentOrders = (): void => sentOrderIds.clear();
