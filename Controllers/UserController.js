const express = require('express');
const router = express.Router();
const {saltKey} = require('../Helper/dbConfig');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const User = require('./../Models/User'); 



router.post('/user', getUser);
router.post('/register', register);
router.post('/login', login);


async function getUser(req,res){
    return res.status(200).json({message: "Success"});
}


async function login(req,res) {
    let {email,password} = req.body;
    try{
        if(!email || !password) {
            return res.status(400).json({"error": "Please Enter all the fields"});
        }
    
        //Check if user already exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(200).json({success: false, message: "User Not found! Please Register"});
        }

        //Compare passwords

        let isMatch = await bcrypt.compare(password,user.password);
            if(isMatch) return res.status(400).json({success: false, "messasge": "Invalid Credentials"});

        // Create token
        const token = jwt.sign(
            { id: user.id, email },
            saltKey,
            {
            expiresIn: "2h",
            }
        );

        //Response
        res.status(200).json({
            success: true,
            message: "User Logged In successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                role: user.role,
            }
        });
    
    }
    catch(e){
        return res.status(500).json({success: false, message: e.message});
    }
}


async function register(req,res){
    let {name,email,password,gender, role} = req.body;
    try{
        if(!name || !email || !password || !gender) {
            return res.status(400).json({"error": "Please Enter all the fields"});
        }
    
    //Check if user already exists
    const user = await User.findOne({email});
    if(user){
        return res.status(200).json({success: false, message: "User Already Exists! Please Login"});
    }

    
    //generate EncryptedPassword
    const encryptedPassword = await bcrypt.hash(password, 10);

     // Create user in database
     const newUser = await User.create({ name, email: email.toLowerCase(), password: encryptedPassword, gender, role});

    // Create token
    const token = jwt.sign(
        { id: newUser.id, email },
        saltKey,
        {
          expiresIn: "2h",
        }
      );

      //Response
      res.status(200).json({
        success: true,
        message: "User Registered successfully",
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            gender: newUser.gender,
            role: newUser.role,
        }
    });
    }
    catch(e){
        return res.status(500).json({success: false, message: e.message});
    }
}





module.exports = router;