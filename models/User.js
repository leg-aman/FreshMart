const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide name.'],
        trim: true,
        maxlength: [20, 'name cannot be more than 20 characters.'],
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, 'Please provide email.'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        required: [true, 'Please choose a role.'],
        enum: ['Vendor', 'Customer'],
        default: 'Customer'
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarketPlace'
    }],
},
    // adds createdAt and uodatedAt
   { timestamps: true},

)

UserSchema.pre('save', async function () {
    // next line prevents double hashing when updating other fields like role or favorites
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.name, role: this.role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME || '1d',
        }
    )
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)