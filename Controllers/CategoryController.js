const express = require('express');
const router = express.Router();
const Categories = require('./../Models/Categories');
const authMiddleware = require('./../Middlewares/Authorization');

router.post('/category/create', authMiddleware, createCategory);
router.post('/category/delete', authMiddleware, deleteCategory) ;
router.get('/categories', getAllCategories);
router.get('/categorieswithproduct', getAllCategoriesWithProducts);


async function getAllCategoriesWithProducts(req,res){
    try{
        const data = await Categories.find({}).select('-createdAt -updatedAt -__v').populate('products');
        return res.status(200).json({success: true, message: "Category Fetched Successfully", data: data});
    }
    catch(e){
        return res.status(500).json({success: false, message: e?.message,});
    }
}

async function createCategory(req,res){
    if(req.user.role !== 1){
        return res.status(401).json({success: false, message: "You have no rights to add Category"});
    }
    const {name} = req.body;
    try{
        let category = await Categories.create({name});
        return res.status(200).json({success: true, message: "Category Created Successfully", data: category});
    }
    catch(e){
        return res.status(500).json({success: false, message: e?.message,});
    }
}


async function deleteCategory(req,res){
    if(req.user.role !== 1){
        return res.status(401).json({success: false, message: "You have no rights to add Category"});
    }
    const {categoryId} = req.body;
    try{
        let category = await Categories.findByIdAndDelete(categoryId);
        return res.status(200).json({success: true, message: "Category Deleted Successfully", data: category});
    }
    catch(e){
        return res.status(500).json({success: false, message: e?.message});
    }
}



async function getAllCategories(req,res){
    try{
        let categories = await Categories.find({}).select('-products -createdAt -updatedAt -__v');
        return res.status(200).json({success: true, message: "Categories fetched Successfully", data: categories});
    }
    catch(e){
        return res.status(500).json({success: false, message: e?.message,});
    }
}


module.exports = router; 