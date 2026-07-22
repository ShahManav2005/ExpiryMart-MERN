const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String , required : true , unique : true},
    password : {type : String , required : true},
    role : {type : String , enum : ['buyer' , 'seller' , 'agent' , 'admin'] , rerquired : true},
    phone : {type : String},
    shopName : {type : String}, //seller only
    address : {type : String} , //buyer only
} , {timestamps : true})

module.exports = mongoose.model('User' , userSchema)

