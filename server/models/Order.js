const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    buyerId : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
    items : [{
        productId : {type : mongoose.Schema.Types.ObjectId , ref : 'Product' , required : true},
        quantity : { type : Number , required : true},
        price : {type : Number , required : true}
    }],
    totalAmount : {type : Number , required : true},
    orderStatus : {
        type : String , 
        enum : ['placed' , 'confirmed' , 'delivered' , 'cancelled'],
        default : 'placed'
    },
    paymentMethod: { type: String, default: 'mock' },
    deliveryAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'delivered'],
        default: 'pending',
    },
    deliveryDistanceKm: { type: Number },
    deliveryEarning: { type: Number },
    deliveredAt: { type: Date },
},{timestamps : true})

module.exports = mongoose.model('Order',orderSchema);