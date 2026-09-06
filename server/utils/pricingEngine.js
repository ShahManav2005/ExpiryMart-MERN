const getDaysLeft = (expiryDate) => {
  return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
};

// % of Total MRP paid to seller (the BASE amount, before any distance charge)
const getBuyingPricePercent = (daysLeft) => {
  if (daysLeft >= 90) return 50;
  if (daysLeft >= 60) return 45;
  return 40; // 30–59 days
};

// % markup on the BASE seller buying amount — recalculated live for buyers
const getSellingMarkupPercent = (daysLeft) => {
  if (daysLeft >= 90) return 90;
  if (daysLeft >= 60) return 85;
  if (daysLeft >= 30) return 80;
  return 60; // below 30 days — clearance
};

const AGENT_FLAT_PAY = 30;
const MAX_DISTANCE_KM = 8.75;

// Shared by BOTH seller-side pickup distance and buyer-side delivery distance
const calculateDistanceCharge = (distanceKm) => {
  const d = Number(distanceKm);
  if (d > MAX_DISTANCE_KM) return { charge: 0, rejected: true };
  if (d >= 5.01) return { charge: 20, rejected: false };
  if (d >= 3.76) return { charge: 10, rejected: false };
  return { charge: 0, rejected: false }; // 0–3.75 km, free
};

// Called once, at approval — computes the BASE amount (before any distance deduction)
const calculateRecommendedBuyingPrice = (product) => {
  const daysLeft = getDaysLeft(product.expiryDate);
  const percent = getBuyingPricePercent(daysLeft);
  const totalMRP = product.price * product.quantity;
  const totalBuyingPrice = Math.round(totalMRP * (percent / 100));
  return { daysLeft, percent, totalMRP, totalBuyingPrice };
};

// Called every time a buyer views/buys — always uses the BASE per-unit price, never the post-deduction one
const calculateCurrentSellingPrice = (buyingPricePerUnit, expiryDate) => {
  const daysLeft = getDaysLeft(expiryDate);
  const markupPercent = getSellingMarkupPercent(daysLeft);
  const sellingPricePerUnit = Math.round(buyingPricePerUnit * (1 + markupPercent / 100));
  return { daysLeft, markupPercent, sellingPricePerUnit };
};

module.exports = {
  getDaysLeft,
  getBuyingPricePercent,
  getSellingMarkupPercent,
  calculateRecommendedBuyingPrice,
  calculateCurrentSellingPrice,
  calculateDistanceCharge,
  AGENT_FLAT_PAY,
  MAX_DISTANCE_KM,
};