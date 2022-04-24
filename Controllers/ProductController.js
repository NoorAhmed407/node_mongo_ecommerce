const express = require('express');
const authMiddleware = require('../Middlewares/Authorization');
const router = express.Router();
const multer = require('multer');
const Product = require('./../Models/Products');
const Categories = require('./../Models/Categories');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });



router.post('/product/create', [authMiddleware, upload.array('images', 3)], createProduct);
router.get('/products', authMiddleware, getProducts);
router.get('/product', authMiddleware, getSingleProduct);
router.post('/product/delete', authMiddleware, deleteProduct);
router.post('/product/update', [authMiddleware, upload.array('images', 3)], updateProduct);



async function updateProduct(req,res){
  if(req.user.role !== 1){
    return res.status(401).json({success: false, message: "You have no rights to add product"});
  }
  const {productId} = req.query;
   req.body.images = req.files.map(val=>val.path);

  try{
    let product = await Product.updateOne({_id: productId }, { $set:{...req.body}});
    return res.status(200).json({success: true, message: "Product Updated Successfully", data: product});
  }
  catch(e){
    return res.status(500).json({success: false, message: e?.message});
  }
}

async function deleteProduct(req,res){
  if(req.user.role !== 1){
    return res.status(401).json({success: false, message: "You have no rights to delete product"});
  }
  const {productId} = req.body;
  try{
    let product = await Product.findByIdAndDelete(productId);
    return res.status(200).json({success: true, message: "Product Deleted Successfully", data: product});
  }
  catch(e){
    return res.status(500).json({success: false, message: e?.message});
  }

}


async function getSingleProduct(req,res){
  const {id} = req.query;
  try{
    const product = await Product.findById(id).select('-createdAt -updatedAt -__v').populate({path: 'categoryId', select: ['name']});
    return res.status(200).json({success: true, message: "Product Fetched Successfully", data: product});
  }
  catch(e){
    return res.status(500).json({success: false, message: e?.message});

  }
}

async function getProducts(req,res){
  const query = req.query;
 
  try{
    const products = await Product.find({...query}).select('-createdAt -updatedAt -__v').populate({path: 'categoryId', select: ['name'] });
    return res.status(200).json({success: true, message: "Product Fetched Successfully", data: products});
  }
  catch(e){
    return res.status(500).json({success: false, message: e?.message});

  }
}


async function createProduct(req, res){

  if(req.user.role !== 1){
    return res.status(401).json({success: false, message: "You have no rights to add product"});
  } 
  const {name,description,categoryId, price} = req.body;
  const images = req.files.map(val=>val.path);

   try{
     let category = await Categories.findById(categoryId);
     let product = await Product.create({name, description, categoryId, price, images });
     category.products.push(product._id);
     await category.save();
    return res.status(200).json({success: true, message: "Product Created Successfully", data: product});
}
catch(e){
    return res.status(400).json({success: false, message: e?.message,});
}
}



module.exports = router;