const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male',
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
});
module.exports = mongoose.model("user", userSchema);
