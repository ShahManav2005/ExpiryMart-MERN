const getDaysLeft = (expiryDate) => {
  return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
};

// % of MRP that ExpiryMart pays the seller, based on days remaining
const getBuyingPricePercent = (daysLeft) => {
  const monthsLeft = daysLeft / 30;
  if (monthsLeft <= 1) return 40;
  if (monthsLeft <= 2) return 45;
  if (monthsLeft <= 3) return 50;
  return 50; // capped at 3 months per business rule
};

// % markup added on top of buying price to get the buyer's selling price
const getMarkupPercent = (daysLeft) => {
  const monthsLeft = daysLeft / 30;
  if (monthsLeft <= 2) return 80;
  if (monthsLeft <= 3) return 85;
  return 90;
};

const calculateRecommendedBuyingPrice = (product) => {
  const daysLeft = getDaysLeft(product.expiryDate);
  const percent = getBuyingPricePercent(daysLeft);
  const buyingPrice = Math.round(product.price * (percent / 100));
  return { daysLeft, percent, buyingPrice };
};

const calculateSellingPrice = (buyingPrice, expiryDate) => {
  const daysLeft = getDaysLeft(expiryDate);
  const markupPercent = getMarkupPercent(daysLeft);
  const markup = Math.round(buyingPrice * (markupPercent / 100));
  const sellingPrice = buyingPrice + markup;
  return { markupPercent, markup, sellingPrice };
};

const calculateAgentCommission = (sellingPrice) => Math.round(sellingPrice * 0.10);

const DELIVERY_FLAT_EARNING = 15; // simplification: assumes ≤5km, no geolocation in scope

const calculateCompanyProfit = (sellingPrice, buyingPrice, agentCommission, deliveryEarning = DELIVERY_FLAT_EARNING) => {
  return sellingPrice - buyingPrice - agentCommission - deliveryEarning;
};

const calculateDeliveryEarning = (distanceKm = 0) => {
  if (distanceKm <= 5) return DELIVERY_FLAT_EARNING;
  return DELIVERY_FLAT_EARNING + (distanceKm - 5) * 3;
};

module.exports = {
  getDaysLeft,
  calculateRecommendedBuyingPrice,
  calculateSellingPrice,
  calculateAgentCommission,
  calculateCompanyProfit,
  calculateDeliveryEarning,
  DELIVERY_FLAT_EARNING,
};