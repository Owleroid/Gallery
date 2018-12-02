const path = require('path');

const express = require('express');

const uploadController = require('../controllers/upload');

const router = express.Router();


router.get('/upload', uploadController.getUploadPage);

router.post('/upload-by-url', uploadController.postUploadImageUrl);

router.post('/upload-manualy', uploadController.postUploadImageFile);

module.exports = router;
