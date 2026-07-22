const mongoose = require('moogose')
const { applyTimestamps } = require('./User')

const paymentSchema = new mongoose.Schema({
    orderId : { type : mongoose.Schema.Types.ObjectId , ref : 'Order' , required : true},
    paymentStatus : {type : String , enum : ['pending' , 'paid' ,'failed'] , default : 'pending'},
    paymentMethod : {type :String , default : 'mock'},
},{timestamps : true});

module.exports = mongoose.model('Payment' , paymentSchema);