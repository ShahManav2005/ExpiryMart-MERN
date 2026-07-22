const bcrypt = require('bcryptjs')
const User = require('../models/User')
const generateToken = require('../utils/generateTokens')

//@route POST /api/auth/register
const registerUser = async (req,res) =>{
    try{
        const {name,email,password,role,phone,shopName,address} = req.body;
        
        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message : 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            name,
            email, 
            password : hashedPassword,
            role,
            phone,
            shopName,
            address
        });

        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            token : generateToken(user._id , user.role),
        });

    }catch(err){
        res.status(500).json({message : err.message})
    }
};


// @route POST /api/auth/login

const loginUser = async (req,res) => {
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message : 'Invalid email or password'})
        }

        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch){
            return res.status(401).json({message : 'Invalid password or email'})
        }

        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            token : generateToken(user._id , user.role),
        });
    }catch(err){
        res.status(500).json({message : err.message})
    }
};

module.exports = {registerUser , loginUser}