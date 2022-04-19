const jwt = require('jsonwebtoken');
const {saltKey} = require('./../Helper/dbConfig');

module.exports = authMiddleware;


 async function authMiddleware(req,res,next){
     let token = req.header('Authorization')?.split('Bearer ')[1];
     if(!token){
         return res.status(401).json({"message": "Unauthorized!"});
     }
     try{
        const decode = jwt.verify(token, saltKey);
        req.user = decode;
        next();
     }
     catch(e){
         return res.status(400).json({success: false, message: "Invalid Token"});
     }
 } 