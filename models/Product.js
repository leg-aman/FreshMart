const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide product name'],
            trim: true,
            maxlength: [50, 'Product name cannot be more than 50 characters'],
            minlength: [1, 'Product name must be at least 1 character']
        },
        category: {
            type: String,
            required: [true, 'Please provide category'],
            trim: true,
            maxlength: [30, 'Category cannot be more than 30 characters']
        },
        dietTags: {
            type: [String],
            default: []
        },
        inStock: {
            type: Boolean,
            default: true
        },
        marketPlaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MarketPlace',
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema)