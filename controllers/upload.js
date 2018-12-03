const fs = require('fs');
const imageDownload = require('image-downloader');
const sharp = require('sharp');

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
    const date = new Date().toISOString();
    var imgSize = 0;

    const options = {
        url: imgAddress,
        dest: './images/tmp'
    };

    if (!(imgAddress.endsWith('.jpg') ||
            imgAddress.endsWith('.jpeg') ||
            imgAddress.endsWith('.png'))) {
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
            console.log('File saved to: ', filename);
            return sharp(`./images/tmp/${imgName}`)
                .resize(300, null)
                .toFile(`./images/${imgName}`)
                .then(() => console.log('Resized'))
                .catch(err => console.log('Sharp error: ' + err));
        })
        .then(() => {
            let stats = fs.statSync(`./images/${imgName}`);
            let fileSizeInBytes = stats.size;
            imgSize = fileSizeInBytes;
            console.log('Size: ' + imgSize);
            const image = new Image({
                imageName: imgName,
                imageSize: imgSize,
                imageUrl: `images/${imgName}`,
                uploadDate: date
            });
            image.save()
                .then(() => {
                    res.redirect('/gallery');
                    fs.unlink(`./images/tmp/${imgName}`, (err) => console.log(err));
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
    const date = new Date().toISOString().split('T')[0];
    var imgSize = 0;

    if (!img) {
        return res.render('upload/upload-form', {
            pageTitle: 'Upload',
            path: '/upload'
        });
    }

    sharp(`./images/tmp/${imgName}`)
        .resize(300, null)
        .toFile(`./images/${imgName}`)
        .then(() => {
            return console.log('Resized');
        })
        .then(() => {
            let stats = fs.statSync(`./images/${imgName}`);
            let fileSizeInBytes = stats.size;
            imgSize = fileSizeInBytes;
            console.log('Size: ' + imgSize);
            const image = new Image({
                imageName: imgName,
                imageSize: imgSize,
                imageUrl: `images/${imgName}`,
                uploadDate: date
            });
            image.save()
                .then(() => {
                    res.redirect('/gallery');
                    fs.unlink(`./images/tmp/${imgName}`, (err) => console.log(err));
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => console.log('Sharp error: ' + err));
};