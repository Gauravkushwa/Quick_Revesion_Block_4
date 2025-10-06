const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const AuthModel = require('../models/Auth');


const RegisterUser = async(req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await AuthModel.findOne({email});
        if(user){
            res.status(404).json({MSG: "User Already Exist.."})
        };
    
        const hashedPass =  bcrypt.hash(password, 5, async(error, hash) =>{
            if(error) {
                res.json({MSG: "error with hashing the Password", error: error.message})
            }
    
            const newUser =  new AuthModel({email, password: hash});
            await newUser.save();
            res.status(201).json({MSG: "user Created successfully..", newUser: newUser})
        })
    } catch (error) {
        res.status(500).json({MSG: "Inter Server Error", error: error.message})
    }

};


const LoginUser = async(req, res) =>{
    try {
        const {email, password} = req.body;
        const machingUSer = await AuthModel.findOne({email});

        if(!machingUSer){
            res.status(404).json({MSG: "User not Found..."})
        };

        const isMaching = bcrypt.compare(password, machingUSer.password);
        if(!isMaching){
            res.status(404).json({MSG: "inviled Credentials..!"})
        }

        const token = jwt.sign(password, {user: user._id}, "Masai", )
    } catch (error) {
        
    }
}