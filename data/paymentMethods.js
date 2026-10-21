/**
 * Payment methods supported by Stripe (used for display in Payment section).
 * Sources: Stripe payment method support; logos from payment-icons CDN (jsdelivr).
 * Removed: Wise (not a Stripe payment method), Masterpass (discontinued; we show Mastercard).
 * Included: Visa, Mastercard, Amex, Discover, JCB, UnionPay, PayPal (all Stripe-supported).
 */
const CDN = "https://cdn.jsdelivr.net/npm/payment-icons@0.0.13/svg/flat";

export const PAYMENT_METHODS = [
  { name: "Visa", logo: `${CDN}/visa.svg`, alt: "Visa" },
  { name: "Mastercard", logo: `${CDN}/mastercard.svg`, alt: "Mastercard" },
  { name: "American Express", logo: `${CDN}/amex.svg`, alt: "American Express" },
  { name: "Discover", logo: `${CDN}/discover.svg`, alt: "Discover" },
  { name: "JCB", logo: `${CDN}/jcb.svg`, alt: "JCB" },
  { name: "UnionPay", logo: `${CDN}/unionpay.svg`, alt: "China UnionPay" },
  { name: "PayPal", logo: `${CDN}/paypal.svg`, alt: "PayPal" },
];
