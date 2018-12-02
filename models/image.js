const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  imageName: {
    type: String,
    required: true
  },
  imageSize: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  uploadDate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Image', imageSchema);