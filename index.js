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

dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
    console.log("connected to MongoDB")
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);

app.listen(8000 , ()=>{
    console.log("Backend Server1 Started")
})
