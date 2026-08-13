import React, { useRef, useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Plane, MessageCircle, Smartphone, Building2, Loader2, AlertCircle } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact';
import { SignInRequired } from '../components/SignInRequired';
import { sendOrderEmail } from '../lib/orderEmail';
import { ADDON_PRICES_USD, DELIVERY_COST_USD, addOnsTotalUSD, taxesUSD } from '../lib/pricing';

type PaymentMethod = 'whatsapp' | 'chime' | 'applepay' | 'wire';

const PAYMENT_OPTIONS: Array<{ id: PaymentMethod; label: string; hint: string; icon: React.ReactNode }> = [
  { id: 'whatsapp', label: 'Decide on WhatsApp', hint: 'We walk you through the options', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'chime', label: 'Chime', hint: 'Send to our Chime tag', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'applepay', label: 'Apple Pay', hint: 'Pay from your Apple wallet', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'wire', label: 'Bank transfer', hint: 'We send the details', icon: <Building2 className="w-4 h-4" /> }
];

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  whatsapp: 'To be agreed on WhatsApp',
  chime: 'Chime',
  applepay: 'Apple Pay',
  wire: 'Bank transfer'
};

export const CheckoutView: React.FC = () => {
  const { cart, formatPrice, placeOrder, setActiveTab, currentUser, showNotification } = usePetStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

  // A ref, not state: state updates are async, so two fast clicks could both
  // pass an isSubmitting check before React re-rendered.
  const submissionInFlight = useRef(false);

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cityStateZip, setCityStateZip] = useState('');
  const [destinationType, setDestinationType] = useState<'domestic' | 'international'>('domestic');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');

  if (!currentUser?.isLoggedIn) {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        <div className="p-8 rounded-3xl bg-[#002045] text-white">
          <h1 className="font-serif-display font-bold text-3xl">Checkout</h1>
        </div>

        <SignInRequired
          title="Sign in to reserve"
          message="You need an account to reserve a pet, so we can keep your order and delivery details together."
        />
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.pet.priceUSD, 0);
  const addonsTotal = cart.reduce((acc, item) => acc + addOnsTotalUSD(item.selectedAddOns), 0);

  const deliveryCost = DELIVERY_COST_USD[destinationType];
  const taxes = taxesUSD(subtotal + addonsTotal);
  const totalAmount = subtotal + addonsTotal + deliveryCost + taxes;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against double submission (double click, Enter key, slow network).
    if (submissionInFlight.current) return;

    const trimmedName = customerName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (
      !trimmedName ||
      !/^\S+@\S+\.\S+$/.test(trimmedEmail) ||
      phone.trim().length < 7 ||
      deliveryAddress.trim().length < 5 ||
      cityStateZip.trim().length < 3 ||
      cart.length === 0
    ) {
      showNotification('Please fill in every field above so we can arrange delivery.');
      return;
    }

    submissionInFlight.current = true;
    setIsSubmitting(true);
    setEmailError(null);

    const methodLabel = PAYMENT_LABELS[paymentMethod];

    const petsDetails = cart.map(item => {
      // The order email is always denominated in USD, whatever currency the
      // shopper was browsing in.
      const addOnsList: string[] = [];
      if (item.selectedAddOns.insurance) addOnsList.push(`Vet health insurance ($${ADDON_PRICES_USD.insurance} USD)`);
      if (item.selectedAddOns.starterKit) addOnsList.push(`Starter kit ($${ADDON_PRICES_USD.starterKit} USD)`);
      if (item.selectedAddOns.vipTransport) addOnsList.push(`Flight nanny escort ($${ADDON_PRICES_USD.vipTransport} USD)`);

      return {
        id: item.pet.id,
        name: item.pet.name,
        breed: item.pet.breed,
        species: item.pet.species,
        gender: item.pet.gender,
        ageMonths: item.pet.ageMonths,
        priceUSD: item.pet.priceUSD,
        addOnsSummary: addOnsList.length > 0 ? addOnsList.join(', ') : 'Standard care package'
      };
    });

    // 1. Record the order first. Nothing is emailed until this has succeeded.
    let order;
    try {
      order = placeOrder({
        customerName: trimmedName,
        deliveryAddress: deliveryAddress.trim(),
        cityStateZip: cityStateZip.trim(),
        phone: phone.trim(),
        deliveryCost,
        paymentMethod: methodLabel
      });
    } catch (err) {
      console.error('Could not record the order:', err);
      submissionInFlight.current = false;
      setIsSubmitting(false);
      showNotification('We could not save your reservation. Please try again.');
      return;
    }

    // 2. Notify the store owner with the details of the order just placed.
    setEmailState('sending');
    const result = await sendOrderEmail(order, trimmedEmail);
    setEmailState(result.status === 'failed' ? 'failed' : 'sent');
    if (result.status === 'failed') setEmailError(result.message);

    // 3. Buyer confirmation, when the mail server is configured. The
    //    reservation stands regardless of whether this succeeds.
    fetch('/api/orders/email-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        petsDetails,
        breed: cart[0]?.pet.breed,
        customerName: trimmedName,
        email: trimmedEmail,
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        cityStateZip: cityStateZip.trim(),
        destinationType,
        deliveryCost,
        subtotal,
        addonsTotal,
        taxes,
        discount: 0,
        totalAmount,
        paymentMethod: methodLabel
      })
    }).catch(err => console.error('Buyer confirmation email could not be sent:', err));

    // 4. Hand over to WhatsApp, where the order is confirmed and paid.
    const whatsappMessage = [
      `Hello YourPets, I have just placed order #${order.id}.`,
      `Pets: ${cart.map(item => `${item.pet.breed} (listing ${item.pet.id})`).join(', ')}`,
      `Total: $${totalAmount}`,
      `Delivery: ${destinationType === 'international' ? 'International' : 'USA'} — ${cityStateZip.trim()}`,
      `Preferred payment: ${methodLabel}`,
      `Please confirm availability and the next steps.`
    ].join('\n');
    window.open(whatsappLink(whatsappMessage), '_blank', 'noopener,noreferrer');

    setIsSubmitting(false);
    showNotification(`Reservation #${order.id} received — finish on WhatsApp to confirm.`);
    setActiveTab('order-tracking');
    // submissionInFlight is deliberately left set: this order is done, and the
    // view has moved on to tracking.
  };

  const fieldClass =
    'w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface transition-colors focus:outline-none focus:border-[#002045] dark:focus:border-emerald-400';

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-[#002045] text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Reservation</span>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl mt-1">Almost there</h1>
          <p className="text-xs text-white/80 mt-1">
            Tell us where your companion is going. Payment is arranged with a real person, never taken on this page.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/70 block uppercase font-bold">Total</span>
          <span className="text-3xl font-bold font-serif-display text-emerald-300">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      {/* How this works — three steps, stated once, up front */}
      <div className="p-6 md:p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50">
        <h2 className="font-serif-display font-bold text-xl text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-600" /> How your reservation is completed
        </h2>
        <ol className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            { n: '1', t: 'You reserve here', d: 'Fill in your details below and place the reservation. Nothing is charged.' },
            { n: '2', t: 'We confirm on WhatsApp', d: `We reply on ${WHATSAPP_DISPLAY} to confirm your pet and agree how you pay.` },
            { n: '3', t: 'We arrange shipment', d: 'Flight nanny and arrival date are scheduled with you on WhatsApp.' }
          ].map(step => (
            <li key={step.n} className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                {step.n}
              </span>
              <div>
                <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">{step.t}</h3>
                <p className="text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed mt-0.5">{step.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Your details */}
          <section className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-4">
            <h3 className="font-serif-display font-bold text-xl text-on-surface">Your details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Full name</label>
                <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={fieldClass} />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">WhatsApp phone number</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Email address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Street address</label>
                <input type="text" required value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className={fieldClass} />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-on-surface mb-1">City, state / region and postal code</label>
                <input type="text" required value={cityStateZip} onChange={(e) => setCityStateZip(e.target.value)} className={fieldClass} />
              </div>
            </div>
          </section>

          {/* Destination */}
          <section className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-4">
            <h3 className="font-serif-display font-bold text-xl text-on-surface flex items-center gap-2">
              <Plane className="w-5 h-5 text-emerald-600" /> Where are we flying to?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'domestic' as const, title: 'Inside the USA', price: `+${formatPrice(DELIVERY_COST_USD.domestic)}`, desc: 'Express climate transport with a flight nanny.' },
                { id: 'international' as const, title: 'Another country', price: `+${formatPrice(DELIVERY_COST_USD.international)}`, desc: 'Overseas customs handling and flight nanny escort.' }
              ].map(option => (
                <label
                  key={option.id}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    destinationType === option.id
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/40'
                      : 'border-outline-variant/40 bg-surface-low dark:bg-surface-high hover:border-emerald-400/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="destination"
                    checked={destinationType === option.id}
                    onChange={() => setDestinationType(option.id)}
                    className="mt-1 accent-emerald-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface">{option.title}</span>
                      <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{option.price}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Payment preference */}
          <section className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-4">
            <div>
              <h3 className="font-serif-display font-bold text-xl text-on-surface">How would you like to pay?</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Pick a preference — nothing is charged now. We confirm the exact steps with you on WhatsApp, so your card
                details are never typed into this website.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PAYMENT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPaymentMethod(option.id)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === option.id
                      ? 'border-[#002045] bg-[#002045] text-white shadow-md scale-[1.02]'
                      : 'border-outline-variant text-on-surface hover:border-[#002045] hover:-translate-y-0.5'
                  }`}
                >
                  <span className={paymentMethod === option.id ? 'text-emerald-300' : 'text-emerald-600'}>{option.icon}</span>
                  <span>{option.label}</span>
                  <span className={`text-[10px] font-medium leading-tight ${paymentMethod === option.id ? 'text-white/70' : 'text-on-surface-variant'}`}>
                    {option.hint}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl liquid-glass liquid-glass-strong space-y-4 lg:sticky lg:top-28">
            <h3 className="font-serif-display font-bold text-xl text-on-surface">Order summary</h3>

            <div className="space-y-2.5 text-xs text-on-surface-variant pb-3 border-b border-outline-variant/30">
              <div className="flex justify-between">
                <span>Pets subtotal</span>
                <span className="font-bold text-on-surface">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Care kits &amp; insurance</span>
                <span className="font-bold text-on-surface">{formatPrice(addonsTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Flight transport</span>
                <span className="font-bold text-emerald-600">{formatPrice(deliveryCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes &amp; fees</span>
                <span className="font-bold text-on-surface">{formatPrice(taxes)}</span>
              </div>

              <div className="flex justify-between items-baseline text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/20">
                <span>Total</span>
                <span className="font-serif-display text-2xl text-[#002045] dark:text-emerald-400">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              id="complete-order-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {emailState === 'sending' ? 'Sending your order...' : 'Reserving...'}
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  Reserve &amp; continue on WhatsApp
                </>
              )}
            </button>

            {emailState === 'sent' && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-[11px] font-semibold flex items-start gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-px" />
                <span>Your order reached our team. We will confirm it with you on WhatsApp.</span>
              </div>
            )}

            {emailState === 'failed' && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-200 text-[11px] font-semibold flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-px" />
                <span>
                  Your reservation is saved, but the notification email did not go through
                  {emailError ? ` (${emailError})` : ''}. Please send us the order number on WhatsApp so we do not
                  miss it.
                </span>
              </div>
            )}

            <p className="text-[11px] text-on-surface-variant leading-relaxed flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-px" />
              This opens WhatsApp with your order details ready to send. Your reservation is only final once we confirm it
              there — and shipment is scheduled the same way.
            </p>

            <a
              href={whatsappLink('Hello YourPets, I have a question before I reserve.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline pt-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Questions first? Chat to us on {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
