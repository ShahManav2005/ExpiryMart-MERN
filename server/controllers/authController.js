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
            address : user.address,
            phone : user.phone,
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
            address : user.address,
            phone : user.phone,
            token : generateToken(user._id , user.role),
        });
    }catch(err){
        res.status(500).json({message : err.message})
    }
};

// @route PUT /api/auth/change-password
// @access private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { registerUser, loginUser, changePassword }