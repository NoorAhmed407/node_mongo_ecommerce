const express = require('express');
const authMiddleware = require('../Middlewares/Authorization');
const router = express.Router();
const multer = require('multer');
const Product = require('./../Models/Products');


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



async function deleteProduct(req,res){
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
   const {name,description,categoryId, price} = req.body;
   const images = req.files.map(val=>val.path);
   try{
    let product = await Product.create({name, description, categoryId, price, images });
    return res.status(200).json({success: true, message: "Product Created Successfully", data: product});
}
catch(e){
    return res.status(400).json({success: false, message: e?.message,});
}
}



module.exports = router;