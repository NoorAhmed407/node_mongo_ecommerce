const express = require('express');
const router = express.Router();
const Orders = require('./../Models/Orders');
const authMiddleware = require('./../Middlewares/Authorization');


router.post('/order/create', authMiddleware, createOrder );
router.post('/order/update', authMiddleware, updateOrderStatus );
router.get('/orders', authMiddleware, getOrderDetails );

async function createOrder(req,res){
   const {user} = req;
   const {totalPrice, orderDetail} = req.body;
   try{
    let order = await Orders.create({orderedBy: user.id, totalPrice, orderDetail });
    return res.status(200).json({success: true, message: "Order Created Successfully", data: order});

   }
   catch(e){
        return res.status(400).json({success: false, message: e?.message,});
   }
    
}

async function getOrderDetails(req,res){
   if(req.user.role !== 1){
      return res.status(401).json({success: false, message: 'You have no rights to access orders'});
   }
   try{
      const orders = await Orders.find({})
      .select('-createdAy -updatedAt -__v')
      .populate({path: 'orderedBy', select: 'name email gender'})
      .populate(
         {
            path: 'orderDetail.product', 
            select: 'name description categoryId price', 
            populate: {
               path: 'categoryId', 
               select: '-products -createdAt -updatedAt -__v'
            }
         }
         );
      return res.status(200).json({success: true, message: "Orders Fetched Successfully", data: orders});

   }
   catch(e){
      return res.status(500).json({success: false, message: e?.message,});

   }
}


async function updateOrderStatus(req,res){
   if(req.user.role !== 1){
      return res.status(401).json({success: false, message: 'You have no rights to update order status'});
   }
   try{
      const order = await Orders.updateOne({_id: req.body.orderId}, {$set: {status: req.body.status}});
      if(order.modifiedCount){
         return res.status(200).json({success: true, message: "Order Status Updated Successfully.!"});
      }
      else{
         return res.status(400).json({success: true, message: "Something Went Wrong",});
      }
   }
   catch(e){
      return res.status(500).json({success: false, message: e?.message,});

   }
}

module.exports = router;