const Image = require('../models/image');

exports.getImages = (req, res, next) => {
    Image.find()
        .then(images => {
            console.log(images);
            res.render('gallery/images', {
                imgs: images,
                pageTitle: 'Gallery',
                path: '/gallery'
            });
        })
        .catch(err => {
            console.log(err);
        });
};