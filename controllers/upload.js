const fs = require("fs");
const imageDownload = require('image-downloader');
const sizeOf = require('image-size');

const Image = require('../models/image');

exports.getUploadPage = (req, res, next) => {
    res.render('upload/upload-form', {
        pageTitle: 'Upload',
        path: '/upload'
    });
};

exports.postUploadImageUrl = (req, res, next) => {
    const imgAddress = req.body.imageURL;
    const imgName = imgAddress.substr(imgAddress.lastIndexOf('/') + 1);
    var imgSize = 0;

    const options = {
        url: imgAddress,
        dest: './images'
    };

    if (!imgAddress) {
        return res.render('upload/upload-form', {
            pageTitle: 'Upload',
            path: '/upload'
        });
    }

    imageDownload.image(options)
        .then(({
            filename,
            image
        }) => {
            console.log('File saved to', filename)
            let stats = fs.statSync(`./images/${imgName}`);
            let fileSizeInBytes = stats.size;
            imgSize = fileSizeInBytes;
        })
        .then(() => {
            const image = new Image({
                imageName: imgName,
                imageSize: imgSize,
                imageUrl: `images/${imgName}`
            });
            image.save()
                .then(() => {
                    res.redirect('/gallery');
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.error(err)
        });
};

exports.postUploadImageFile = (req, res, next) => {
    const img = req.file;
    const imgName = req.file.filename;
    const imgSize = req.file.size;

    if (!img) {
        return res.render('upload/upload-form', {
            pageTitle: 'Upload',
            path: '/upload'
        });
    }

    const imageUrl = img.path;

    const image = new Image({
        imageName: imgName,
        imageSize: imgSize,
        imageUrl: imageUrl
    });
    image.save()
        .then(() => {
            res.redirect('/gallery');
        })
        .catch(err => {
            console.log(err);
        });
};