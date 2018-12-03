const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const errorController = require('./controllers/error');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/tmp');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const galleryRoutes = require('./routes/gallery');
const uploadRoutes = require('./routes/upload');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('imageFile'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(galleryRoutes);
app.use(uploadRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://Admin:Xloprtnm1987@cluster0-4nxjx.mongodb.net/gallery'
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });