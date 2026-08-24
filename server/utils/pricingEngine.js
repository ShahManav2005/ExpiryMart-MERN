const calculatePricing = (product) => {
    const daysLeft = Math.ceil(
        (new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    )

    let discountPercent = 0;
    let riskLevel = 'low';

    if(daysLeft <= 7){
        discountPercent = 50;
        riskLevel = 'high'
    }else if(daysLeft <= 30){
        discountPercent = 30;
        riskLevel = 'medium'
    }else if(daysLeft <= 90){
        discountPercent = 15;
        riskLevel = 'low'
    }else{
        discountPercent = 0;
        riskLevel = 'low'
    }

    const discountedPrice = Math.round(product.price * (1 - discountPercent / 100));

    return {daysLeft , discountPercent , discountedPrice , riskLevel}
}

module.exports = { calculatePricing }