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
const multer = require('multer');
const path = require('path');
const cors = require('cors');

dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
    console.log("connected to MongoDB")
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ayila.netlify.app'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/post', postRoute);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single("file"), (req, res) => {
  try {
      return res.status(200).json("File Uploaded Successfully")
  } catch (error) {
      return res.status(500).json(error)
  }
});

app.use("/public", express.static(path.join(__dirname, "public/")));


app.listen(8000 , ()=>{
    console.log("Backend Server1 Started")
})
