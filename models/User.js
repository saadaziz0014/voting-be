const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    surname: String,
    wallet: String,
    network: String,
    fund: String,
    email: { type: String, unique: true },
    password: String,
    address: String,
    otp: String,
    otpExpires: Date,
    otpverified: { type: Boolean, default: false },
});

module.exports.User = mongoose.model("User", userSchema);
