const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userModel = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        maxLength: 600
    },
    profilePicture: {
        type: String
    },
})

// Hashing the password before saving it to the database
userModel.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
    }
    next()
})

// Method to validate the password when logging in
userModel.methods.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);  // Compare the given password with the hashed password
};

module.exports = mongoose.model('User', userModel)