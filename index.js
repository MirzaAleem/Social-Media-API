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
const cloudinary = require('cloudinary').v2;

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
  res.header('cross-origin-resource-policy', 'cross-origin');
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

//Cloudinary for image upload
cloudinary.config({ 
  cloud_name: 'dxwnemtgy', 
  api_key: '255315514475953', 
  api_secret: 'tvVHMu-DNM4CFIhksOLWRcn2VDU' 
});

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.buffer, { folder: 'Ayila' });
    res.status(200).json(result + " File Uploaded Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ' Cloudinary Internal Server Error' });
  }
});

app.use("/public", express.static(path.join(__dirname, "public/")));


app.listen(8000 , ()=>{
    console.log("Backend Server1 Started")
})
