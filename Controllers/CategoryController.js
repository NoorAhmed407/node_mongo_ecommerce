const express = require('express');
const router = express.Router();
const Categories = require('./../Models/Categories');
const authMiddleware = require('./../Middlewares/Authorization');

router.post('/category/create', authMiddleware, createCategory);
router.get('/categories', getAllCategories);

async function createCategory(req,res){
    const {name} = req.body;
    try{
        let category = await Categories.create({name});
        return res.status(200).json({success: true, message: "Category Created Successfully", data: category});
    }
    catch(e){
        return res.status(500).json({success: false, message: e?.message,});
    }
}


async function getAllCategories(req,res){
    try{
        let categories = await Categories.find({}).select('-createdAt -updatedAt -__v');
        return res.status(200).json({success: true, message: "Categories fetched Successfully", data: categories});
    }
    catch(e){
        return res.status(500).json({success: false, message: e?.message,});
    }
}


module.exports = router; 