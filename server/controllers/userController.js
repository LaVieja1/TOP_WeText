const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloudinary} = require('../services/cloudinary');

const CLOUDINARY_PRESET = 'WeText';

exports.check_email = [
    body('email', 'El email debe ser valido.').isEmail()
        .trim()
        .escape()
        .normalizeEmail(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json(errors.array());
        else {
            try {
                const user = await User.findOne({ email: req.body.email }).exec();
                if (!user) next();
                else {
                    return res.json([{ msg: 'El email ya esta en uso.' }]);
                }
            } catch (err) {
                return res.json(err);
            }
        }
    }
]

exports.create_user = [
    body('pwd', 'La contraseña no puede ser vacía.')
        .isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres')
        .matches('[A-Z]').withMessage('La contraseña debe tener al menos una mayúscula')
        .matches('[0-9]').withMessage('La contraseña debe tener al menos 1 número')
        .trim()
        .escape(),
    body('username', 'El usuario no puede estar vacío')
        .isLength({ min: 4, max: 12 }).withMessage('El usuario debe contener entre 4 a 12 caracteres')
        .trim()
        .escape(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json(errors.array());
        try {
            const hashedPwd = await bcryptjs.hash(req.body.pwd, 6);
            const user = await new User({
                email: req.body.email,
                password: hashedPwd,
                name: req.body.username,
                friends: [],
            }).save();
            res.json({ id: user._id });
        } catch (err) {
            return res.json(err);
        }
    }
]

exports.login = [
    body('email', 'El email debe ser valido.').isEmail()
    .trim()
    .escape()
    .normalizeEmail(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json(errors.array());
        try {
            const user = await User.friends({ 'email': req.body.email }).exec();
            if (!user) return res.json([{ msg: 'Email no existe' }]);
            bcryptjs.compare(req.body.pwd, user.password, (err, passwordMatch) => {
                if (passwordMatch) {
                    jwt.sign({ user }, `${process.env.SECRET_KEY}`, { expiresIn: '1d' }, (err, token) => {
                        if (err) return res.json(err);
                        return res.json({ token, id: user._id });
                    })
                } else {
                    return res.json([{ msg: 'Contraseña incorrecta' }]);
                }
            })
        } catch (err) {
            return res.json(err);
        }
    }
]

exports.get_user_data = [
    body('email', 'El email debe ser valido.').isEmail()
        .trim()
        .escape()
        .normalizeEmail(),

    async (req, res, next) => {
        const userId = req.params.userId;

        const user = await User.findOne({ _id: userId });
        if (!user) return res.json(false);
        const { _id, email, pictureUrl, publicId, name } = user;
        return res.json({ _id, email, pictureUrl, publicId, name });
    }
]

exports.update_user = async (req, res) => {
    const { image, username } = req.body;
    if (!image.length) {
        const user = await User.updateOne({ _id: req.params.userId },
            {
                $set: {
                    name: username
                }
            });
        return res.json(true);
    }
    try {
        const data = await cloudinary.uploader.upload(image, {
            upload_preset: CLOUDINARY_PRESET
        });
        const savedImg = await User.updateOne({ _id: req.params.userId },
            {
                $set: {
                    pictureUrl: data.url,
                    publicId: data.public_id,
                    name: username
                }
            });
        res.json({ pictureUrl: data.url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Algo salio mal' });
    }
}

exports.searchUser = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: '', $options: "i" } },
                    { email: { $regex: '', $options: "i" } },
                ]
            }
            : {}
        const users = await User.find(keyword, { 'password': 0, 'publicId': 0 });
        return res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: 'Algo salio mal' });
    }
}