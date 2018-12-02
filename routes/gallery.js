const path = require('path');

const express = require('express');

const galleryController = require('../controllers/gallery');

const router = express.Router();


router.get('/gallery', galleryController.getImages);

module.exports = router;
