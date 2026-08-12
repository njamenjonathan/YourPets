/**
 * Single source of truth for how customers reach us.
 * Change the number here and every button, link and message follows.
 */
export const WHATSAPP_NUMBER = '13305161283';
export const WHATSAPP_DISPLAY = '+1 (330) 516-1283';
export const CONTACT_EMAIL = 'craftking990@gmail.com';
export const TIKTOK_URL = 'https://www.tiktok.com/@yourpets6?_r=1&_t=ZT-98e7qti1ijV';

/** Builds a WhatsApp deep link, optionally pre-filling the first message. */
export const whatsappLink = (message?: string): string =>
  message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;
