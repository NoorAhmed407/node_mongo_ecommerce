const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {dbUrl, dbOptions, PORT} = require('./Constants/dbConfig');

//Initialize Express app
const app = express();

//Initialize Cors
app.use(cors());

//Parsing Incoming JSON requests to req.body
app.use(express.json());

//Connect to MongoDB
mongoose.connect(dbUrl, dbOptions, ()=>console.log('Connected'), e => console.log('Error', e));


//Initialize Routes.
app.use('/api/user', require('./Controllers/UserController'));





app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});