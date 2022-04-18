const express = require('express');
const router = express.Router();
const User = require('./../Models/User'); 


router.get('/', (req,res)=>{
    return res.status(200).json({message: "Success"});
});


router.post('/',async (req,res)=>{
    try{
        let user = {
            name: 'Muneer',
            email: "muneerahmed@gmail.com",
            password: "12345678",
            // gender: "Male",
        };
        let newUser = await User.create(user);
        return res.status(200).json({data: newUser, success: true, message: "User Created Successfully!"});
    }
    catch(e){
        return res.status(500).json({success: false, message: e.message});
    }
});





module.exports = router;