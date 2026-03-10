const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      maxlength: 30,
      minlength: 1,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      maxlength: 30,
      minlength: 1,
      trim: true,
    },
    dietTags: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
    },
    marketPlaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketPlace',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema)