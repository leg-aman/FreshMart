const mongoose = require('mongoose')

// market name, location, address, owner ID

const MarketPlaceSchema = new mongoose.Schema({
    marketName: {
        type: String,
        required: [true, 'Please provide market place name.'],
        trim: true,
        maxlength: [50, 'name cannot be more than 50 characters'],
        minlength: [1, 'name must be at least 3 characters']
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        maxlength: 200
    },
    category:{
        type: String,
        enum: ['Restaurant','Shop','other']
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('MarketPlace', MarketPlaceSchema)