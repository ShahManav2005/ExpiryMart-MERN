const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {type : String , required : true},
    category : { type : String , enum : ['FMCG' , 'OTC Medicine'], required : true},
    quantity : {type : Number , required : true , default : 1},
    expiryDate : {type : Date , required : true},
    price : {type : Number , required : true},
    totalMRP: { type: Number },
    discountedPrice : {type : Number},
    buyingPricePerUnit: { type: Number },
    totalBuyingPrice: { type: Number },
    sellingPrice: { type: Number },  // what the buyer pays (computed at approval)
    sellerDistanceCharge: { type: Number, default: 0 },
    sellerNetPayout: { type: Number }, // totalBuyingPrice minus the distance charge — what the seller actually receives
    images : [{type : String}],
    inspectionFeePaid: { type: Boolean, default: false },
    inspectionFeeMethod: { type: String, enum: ['card', 'upi'] },
    status : {
        type : String ,
        enum : ['pending_inspection' , 'approved' , 'rejected' , 'listed' , 'sold'],
        default : 'pending_inspection'
    },
    sellerId : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true}
} , {timestamps : true})

module.exports = mongoose.model('Product', productSchema);