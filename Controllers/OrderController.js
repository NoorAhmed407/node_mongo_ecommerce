const express = require('express');
const router = express.Router();
const Orders = require('./../Models/Orders');
const authMiddleware = require('./../Middlewares/Authorization');


router.post('order/create', authMiddleware, createOrder );

async function createOrder(req,res){
   const {user} = req;
   try{
    let order = await Orders.create({orderedBy: user.id, });
   }
   catch(e){
        return res.status(400).json({success: false, message: e?.message,});
   }
    
}


module.exports = router;