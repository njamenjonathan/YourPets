/**
 * Every price in the app is stored in USD and converted for display by
 * formatPrice() in PetStoreContext. Keeping the base amounts here means the
 * labels a shopper reads and the totals we charge cannot drift apart, and no
 * screen has to hardcode a "$" that would contradict the selected currency.
 */

export const ADDON_PRICES_USD = {
  insurance: 25,
  starterKit: 85,
  vipTransport: 150
} as const;

export const DELIVERY_COST_USD = {
  domestic: 100,
  international: 200
} as const;

export const RESERVATION_DEPOSIT_USD = 50;

export const TAX_RATE = 0.08;

export interface AddOnSelection {
  insurance: boolean;
  starterKit: boolean;
  vipTransport: boolean;
}

export const addOnsTotalUSD = (addOns: AddOnSelection): number =>
  (addOns.insurance ? ADDON_PRICES_USD.insurance : 0) +
  (addOns.starterKit ? ADDON_PRICES_USD.starterKit : 0) +
  (addOns.vipTransport ? ADDON_PRICES_USD.vipTransport : 0);

export const taxesUSD = (taxableUSD: number): number => Math.round(taxableUSD * TAX_RATE);
