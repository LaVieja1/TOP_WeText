const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pictureUrl: { type: String, default: "../public/images/avatar.jpg"},
    publicId: { type: String },
});

module.exports = mongoose.model("User", UserSchema);