require('dotenv').config();

const cloudinary = require('cloudinary');

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
});

module.exports = { cloudinary };