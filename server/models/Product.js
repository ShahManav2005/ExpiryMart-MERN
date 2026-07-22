const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {type : String , required : true},
    category : { type : String , enum : ['FMCG' , 'OTC Medicine' , required : true]},
    quantity : {type : Number , required : true , default : 1},
    expiryDate : {type : Date , required : true},
    price : {type : Number , required : ture},
    discountedPrice : {type : Number},
    images : [{type : Number}],
    status : {
        type : String ,
        enum : ['pending_inspection' , 'approved' , 'rejected' , 'listed' , 'sold'],
        default : 'pending_inspection'
    },
    sellerId : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true}
} , {timestamps : true})