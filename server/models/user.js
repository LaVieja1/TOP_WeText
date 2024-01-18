const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pictureUrl: { type: String, default: "https://res.cloudinary.com/djvf2vnbp/image/upload/v1705540508/gzwfyiin2urns1uyzzxt.png"},
    publicId: { type: String },
});

module.exports = mongoose.model("User", UserSchema);