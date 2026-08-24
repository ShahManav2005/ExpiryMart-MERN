// const { validate } = require("../models/Inspection");

const MIN_EXPIRY_DAYS = 30;

const validateProductForApproval = (product) => {
    const errors = [];

    const daysUntilExpiry = Math.ceil(
        (new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < MIN_EXPIRY_DAYS) {
        errors.push(`Product expires in ${daysUntilExpiry} day(s), minimum required is ${MIN_EXPIRY_DAYS}`)
    }

    if (!['FMCG', 'OTC Medicine'].includes(product.category)) {
        errors.push(`Invalid category: ${product.category}`)
    }

    return { valid: errors.length === 0, errors: errors }
}

module.exports = { validateProductForApproval }