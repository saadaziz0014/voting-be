const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
    },
});

// Create and export the Admin model
module.exports = mongoose.model('Admin', adminSchema);
