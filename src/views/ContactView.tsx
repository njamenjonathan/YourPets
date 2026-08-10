import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const ContactView: React.FC = () => {
  const { showNotification } = usePetStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showNotification('Thank you for contacting YourPets. A concierge will respond within 2 hours.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="p-8 rounded-3xl bg-[#002045] text-white shadow-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Concierge Desk</span>
        <h1 className="font-serif-display font-bold text-3xl md:text-4xl">Get in Touch</h1>
        <p className="text-xs text-white/80 mt-1">Direct inquiries for pet reservations, climate flight logistics, or breeder applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Direct Banner */}
          <div className="p-6 rounded-3xl bg-emerald-600 text-white space-y-3 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-lg">
              <MessageCircle className="w-6 h-6" /> WhatsApp Concierge Line
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              For instant live photos, video calls with baby puppies/kittens, or flight nanny scheduling, chat with us directly on WhatsApp:
            </p>
            <a
              href="https://wa.me/13305161283"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-emerald-900 px-5 py-3 rounded-2xl font-bold text-xs hover:bg-emerald-50 transition-colors shadow-md"
            >
              <Phone className="w-4 h-4 text-emerald-600" /> Chat on WhatsApp: +1 (330) 516-1283
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4">
            <h3 className="font-serif-display font-bold text-xl text-on-surface">Concierge Headquarters</h3>

            <div className="space-y-3 text-xs text-on-surface-variant">
              <p className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Beverly Hills, CA 90210 & Aspen, CO
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" /> +1 (330) 516-1283 (Direct WhatsApp)
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" /> craftking990@gmail.com
              </p>
              <p className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 24/7 Veterinary Concierge On-Call
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 p-8 rounded-3xl bg-white dark:bg-[#1f2226] border border-outline-variant/30 space-y-4">
          <h3 className="font-serif-display font-bold text-2xl text-on-surface">Send Us a Direct Message</h3>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              Thank you! Your message has been routed directly to our chief veterinary concierge.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-on-surface">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=""
                    className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-on-surface">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-on-surface">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-on-surface">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder=""
                  className="w-full p-3 rounded-xl border border-outline-variant bg-surface-low dark:bg-surface-high"
                />
              </div>

              <button
                type="submit"
                className="bg-[#002045] text-white px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider hover:bg-[#1a365d] transition-colors flex items-center gap-2"
              >
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
