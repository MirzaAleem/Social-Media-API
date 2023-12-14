//Adding Libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require("helmet");
const morgan = require('morgan');
const app = express();
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const path = require('path');
const cors = require('cors');

//dotenv for environment variables
dotenv.config();

//mongoose for database connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
    console.log("connected to MongoDB")
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

//cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('cross-origin-resource-policy', 'cross-origin');
  next();
});

//public folder for static files
app.use("/public", express.static(path.join(__dirname, "public/")));

//Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/post', postRoute);

//Server
app.listen(8000 , ()=>{
    console.log("Backend Server1 Started")
})
