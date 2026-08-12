# EmailJS order notification

The website sends one email per placed order, using the EmailJS browser SDK.

- Service ID: `service_4y3191s`
- Template ID: `template_0jzhrf9`
- Public key: `B-IQlCgvLUYHOuh6n`

All three can be overridden with `VITE_EMAILJS_SERVICE_ID`,
`VITE_EMAILJS_TEMPLATE_ID` and `VITE_EMAILJS_PUBLIC_KEY` in `.env`.

## Variables the site sends

Your template must use these exact names. Anything the template asks for that is
not on this list arrives empty.

| Variable             | Example                                          |
| -------------------- | ------------------------------------------------ |
| `order_id`           | `YP-483920`                                       |
| `order_date`         | `August 11, 2026`                                 |
| `customer_name`      | `Jane Doe`                                        |
| `customer_email`     | `jane@example.com`                                |
| `customer_phone`     | `+1 555 010 2233`                                 |
| `product_name`       | `Golden Retriever (pet-1)`                        |
| `quantity`           | `1`                                               |
| `price`              | `$220` — the pets subtotal before extras          |
| `subtotal`           | `$220`                                            |
| `addons_total`       | `$110`                                            |
| `delivery_cost`      | `$100`                                            |
| `taxes`              | `$26`                                             |
| `total_amount`       | `$456`                                            |
| `delivery_address`   | `12 Oak Lane, Austin, TX 78701`                   |
| `payment_method`     | `Chime`                                           |
| `order_items`        | `1 x Golden Retriever (pet-1) — $220 each, line total $415` (one line per item) |
| `reply_to`           | `jane@example.com` — set this as the template's Reply-To |

## Suggested template body

```
New order {{order_id}} — {{total_amount}}

Placed: {{order_date}}

CUSTOMER
  Name:    {{customer_name}}
  Email:   {{customer_email}}
  Phone:   {{customer_phone}}
  Deliver: {{delivery_address}}

ORDER
{{order_items}}

  Items:        {{quantity}}
  Pets:         {{price}}
  Care add-ons: {{addons_total}}
  Delivery:     {{delivery_cost}}
  Taxes:        {{taxes}}
  TOTAL:        {{total_amount}}

  Payment method: {{payment_method}}

Confirmation and shipment are arranged with the customer on WhatsApp.
```

In the EmailJS template settings, set **To email** to your own address and
**Reply-To** to `{{reply_to}}`, so replying goes straight to the customer.

## When the email is sent

1. The customer completes the checkout form and presses *Reserve*.
2. The order is recorded first. **If that fails, no email is sent.**
3. The order is emailed to you through EmailJS.
4. WhatsApp opens with the order details for the customer to confirm.

The `$50` deposit hold in the reserve dialog follows the same sequence.

## Duplicate protection

Each order id is emailed at most once per browser session. A double click is
also blocked before it starts, by a ref rather than React state, because state
updates are asynchronous and two fast clicks can otherwise both get through.
A genuine send failure releases the id so the customer can retry.

## Security

The service id, template id and public key are **public** browser identifiers.
They are visible in the built JavaScript by design — that is how EmailJS's
browser SDK works, and no change to this project can hide them.

The EmailJS **Private Key** is the secret one. It is not used here and must
never be added to this project.

Because the public key is visible, restrict it in the EmailJS dashboard:
**Account → Security → Allowed origins**, listing only your own domains. Without
that, anyone who reads the page source can send emails through your template.
