const Product = require('../models/Product')
const MarketPlace = require('../models/MarketPlace')
const { StatusCodes } = require('http-status-codes')

const createProduct = async (req, res) => {
    try {
        const { name, category, dietTags, inStock, marketPlaceId } = req.body

        const market = await MarketPlace.findById(marketPlaceId)

        if (!market) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Marketplace not found' })
        }

        if (market.ownerId.toString() !== req.user.userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Not authorized' })
        }

        const product = await Product.create({
            name,
            category,
            dietTags,
            inStock,
            marketPlaceId
        })

        res.status(StatusCodes.CREATED).json({ product })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}

const getProducts = async (req, res) => {
    const markets = await MarketPlace.find({ ownerId: req.user.userId }).select('_id')
    const marketIds = markets.map((market) => market._id)

    const products = await Product.find({
        marketPlaceId: { $in: marketIds }
    }).populate('marketPlaceId', 'marketName location')

    res.status(StatusCodes.OK).json({ products })
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Product not found' })
        }

        const market = await MarketPlace.findById(product.marketPlaceId)

        if (!market) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Marketplace not found' })
        }

        if (market.ownerId.toString() !== req.user.userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Not authorized' })
        }

        const { name, category, dietTags, inStock } = req.body

        product.name = name || product.name
        product.category = category || product.category
        product.dietTags = dietTags || product.dietTags
        product.inStock = inStock ?? product.inStock

        await product.save()

        res.status(StatusCodes.OK).json({ product })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Product not found' })
    }

    const market = await MarketPlace.findById(product.marketPlaceId)

    if (!market) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Marketplace not found' })
    }

    if (market.ownerId.toString() !== req.user.userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Not authorized' })
    }

    await product.deleteOne()

    res.status(StatusCodes.OK).json({ msg: 'Product deleted' })
}

const searchProducts = async (req, res) => {
  try {
    const { category, dietTag, name } = req.query

    const queryObject = {}

    // filter by category
    if (category) {
      queryObject.category = category
    }

    // filter by diet tag
    if (dietTag) {
      queryObject.dietTags = dietTag
    }

    // search by product name
    if (name) {
      queryObject.name = { $regex: name, $options: 'i' }
    }

    const products = await Product.find(queryObject).populate(
      'marketPlaceId',
      'marketName location'
    )

    res.status(200).json({ count: products.length, products })
  } catch (error) {
    res.status(500).json({ msg: 'Search failed' })
  }
}

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    searchProducts
}