const Message = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat');
const { cloudinary } = require('../services/cloudinary');

const CLOUDINARY_PRESET = 'WeText';

const uploadImgCloudinary = async (image) => {
    try {
        const data = await cloudinary.uploader.upload(image, {
            upload_preset: CLOUDINARY_PRESET
        });
        return data;
    } catch (error) {
        return '';
    }
}

exports.sendMessage = async (req, res) => {
    const { content, chatId, image } = req.body;

    if (!chatId) return res.json(false);

    const img = await uploadImgCloudinary(image);

    const newMessage = {
        content,
        chat: chatId,
        sender: req.userId,
        image: img.url,
    }

    try {
        let message = await Message.create(newMessage);
        message = await message.populate('sender', 'name pictureUrl');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pictureUrl email',
        });

        //Update chat with latests message
        await Chat.findByIdAndUpdate(chatId, {
            lastMsg: message
        });

        return res.json(message);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}

exports.chatMessages = async (req, res) => {
    try {
        const messagesToUpdate = req.body.unseenMessages
        const [messages] = await Promise.all([
            Message.find({ chat: req.params.chatId }).populate('sender', 'name pictureUrl email'),
            Message.updateMany({ _id: { $in: messagesToUpdate } }, { $set: { inSeen: true } }),
        ]);
        return res.json(messages);
    } catch (error) {
        return res.json(error);
    }
}

exports.updateMsgsToSeen = async (req, res) => {
    try {
        const messagesToUpdate = req.body.unseenMessages;
        await Message.updateMany({ _id: { $in: messagesToUpdate } }, { $set: { inSeen: true } });
        return res.json(true);
    } catch (error) {
        return res.json(error);
    }
}