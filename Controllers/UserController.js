const express = require('express');
const router = express.Router();
const {saltKey} = require('../Helper/dbConfig');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const User = require('./../Models/User');
const authMiddleware = require('./../Middlewares/Authorization');



router.get('/user',authMiddleware, getUser);
router.post('/register', register);
router.post('/login', login);
router.post('/changepassword', authMiddleware, changePassword);



async function changePassword(req,res){
   try {
    const {oldPassword,newPassword, confirmPassword} = req.body;

    //Check if fields are empty
    if(!oldPassword || !newPassword || !confirmPassword){
        return res.status(400).json({success: false, message: "Please Enter All the fields"});
    }
    
    //Check new and confirm password condition
    if(newPassword !== confirmPassword){
        return res.status(400).json({success: false, message: "New and Confirm Passwords are not same"});
    }
    
    //Get User Current Password and Check with DB
    const userCurrentPassword = await User.findById(req.user.id).select('password');
    const isMatch = await bcrypt.compare(oldPassword, userCurrentPassword?.password);
    if(!isMatch){
        return res.status(400).json({success: false, messasge: "Current password is Incorrect"});
    }

    //Encrypt New Password and save on DB
    let encryptedPassword = await bcrypt.hash(newPassword, 10);
    let myUser = await User.updateOne({_id: req.user.id }, { $set:{password: encryptedPassword}});
    

    //Response
    if(myUser.acknowledged){
        return res.status(200).json({success: true, messasge: "Password Updated Successfully"}); 
    }
    else{
        return res.status(400).json({success: false, messasge: "Something Went wrong"});
    }


   }
   catch(e){
        return res.status(500).json({success: false, message: e.message});
   }

}   



async function getUser(req, res){
    try{
        const user = await User.findById(req.user.id).select('-password -createdAt -updatedAt -__v');
        return res.status(200).json({success: true, data: user, message: "User details fetched Successfully!"});
    }
    catch(e){
        return res.status(500).json({success: false, message: e.message});

    }
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
            if(!isMatch){
                return res.status(400).json({success: false, "messasge": "Invalid Credentials"});
            }

        // Create token
        const token = jwt.sign(
            { id: user.id, email, gender: user.gender, role: user.role  },
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
        { id: newUser.id, email, gender: newUser.gender, role: newUser.role},
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