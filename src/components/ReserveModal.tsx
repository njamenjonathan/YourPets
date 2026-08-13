import React, { useRef, useState } from 'react';
import { X, CreditCard, Lock, Clock, Loader2, AlertCircle } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';
import { mainPhotoOf } from '../lib/petImages';
import { PetPhoto } from './PetPhoto';
import { WHATSAPP_DISPLAY, whatsappLink } from '../lib/contact';
import { sendOrderEmail } from '../lib/orderEmail';
import { RESERVATION_DEPOSIT_USD } from '../lib/pricing';

export const ReserveModal: React.FC = () => {
  const {
    isReserveModalOpen,
    reservePetTarget: pet,
    closeReserveModal,
    formatPrice,
    placeOrder,
    setActiveTab
  } = usePetStore();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const submissionInFlight = useRef(false);

  if (!isReserveModalOpen || !pet) return null;

  const depositAmount = RESERVATION_DEPOSIT_USD;

  const handleSubmitReserve = async (e: React.FormEvent) => {
    e.preventDefault();

    // One hold per click, however many times the button is pressed.
    if (submissionInFlight.current) return;
    submissionInFlight.current = true;
    setIsSubmitting(true);
    setEmailError(null);

    // Record the hold first — nothing is emailed until this has succeeded.
    let order;
    try {
      order = placeOrder({
        customerName: customerName || 'Valued Client',
        deliveryAddress: deliveryAddress || '',
        phone: phone || '',
        // Orders settle in USD whatever currency the site is displaying in.
        paymentMethod: `Reservation hold ($${depositAmount} USD refundable)`,
        depositPaid: false,
        depositAmount
      });
    } catch (err) {
      console.error('Could not record the hold:', err);
      submissionInFlight.current = false;
      setIsSubmitting(false);
      return;
    }

    const result = await sendOrderEmail(order, email);
    if (result.status === 'failed') {
      setEmailError(result.message);
      setIsSubmitting(false);
      submissionInFlight.current = false;
      return;
    }

    window.open(
      whatsappLink(
        `Hello YourPets, I would like to hold the ${pet.breed} (listing ${pet.id}) with the $${depositAmount} USD refundable deposit. My order number is ${order.id}.`
      ),
      '_blank',
      'noopener,noreferrer'
    );

    setIsSubmitting(false);
    closeReserveModal();
    setActiveTab('order-tracking');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop">
      <div className="relative w-full max-w-lg liquid-glass liquid-glass-strong rounded-3xl overflow-hidden flex flex-col modal-panel">
        {/* Header */}
        <div className="p-6 bg-[#002045] text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">7-Day VIP Hold</span>
            <h2 className="font-serif-display font-bold text-xl">Reserve this {pet.breed}</h2>
          </div>
          <button onClick={closeReserveModal} className="p-1.5 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitReserve} className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-surface-low dark:bg-surface-high border border-outline-variant/30 flex items-center gap-4">
            <PetPhoto src={mainPhotoOf(pet)} alt={pet.breed} className="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div className="text-xs">
              <h4 className="font-bold text-sm text-on-surface">{pet.breed}</h4>
              <p className="text-on-surface-variant">Full Price: <strong>{formatPrice(pet.priceUSD)}</strong></p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Deposit: {formatPrice(depositAmount)} (Fully Refundable)
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder=""
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-white dark:bg-[#282c31] text-on-surface"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-white dark:bg-[#282c31] text-on-surface"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder=""
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-white dark:bg-[#282c31] text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Delivery Destination City & State</label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder=""
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-white dark:bg-[#282c31] text-on-surface"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>
              A {formatPrice(depositAmount)} refundable deposit holds this {pet.breed} for 7 days. We confirm the deposit and the delivery
              schedule with you on WhatsApp ({WHATSAPP_DISPLAY}) — nothing is charged on this page.
            </p>
          </div>

          {emailError && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-200 text-[11px] font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-px" />
              <span>We could not notify our team ({emailError}). Please try again, or message us on WhatsApp.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#002045] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#1a365d] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Holding this pet...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" /> Hold this pet &amp; continue on WhatsApp
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
