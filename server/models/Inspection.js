const mongoose = require('mongoose')

const inspectionSchema = new mongoose.Schema({
    productId : {type : mongoose.Schema.Types.ObjectId , ref : 'Product' , required : true},
    agentId : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    status : {type : String , enum : ['pending' , 'approved' , 'rejected'], default : 'pending'},
    notes : {type : String},
    inspectedAt : {type : Date}
} , { timestamps : true})

module.exports = mongoose.model('Inspection' , inspectionSchema)