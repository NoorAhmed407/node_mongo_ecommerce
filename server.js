const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {dbUrl, dbOptions} = require('./Helper/dbConfig');

//Initialize Express app
const app = express();

//Initialize Cors
app.use(cors());

//Parsing Incoming JSON requests to req.body
app.use(express.json());

//Connect to MongoDB
mongoose.connect(dbUrl, dbOptions, ()=>console.log('Successfully Connected to Database!'), e => console.log('Error', e));


//Initialize Routes.
app.use('/api/auth', require('./Controllers/UserController'));



//error handling middleware
app.use((err,req,res,next)=>{
    res.send(err.message);
});


const PORT = 4000;
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});