const MarketPlace = require('../models/MarketPlace')
const { StatusCodes } = require('http-status-codes')

const createMarket = async (req, res) => {
  try {
    const { marketName, location, address, description, category } = req.body
    
    const market = await MarketPlace.create({
      marketName,
      location,
      address,
      description,
      category,
      ownerId: req.user.userId
    })

    res.status(StatusCodes.CREATED).json({ market })
  } catch (error) {
    console.log({ msg: error.message })
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
  }
}

const getMarkets = async(req,res) => {
    const markets = await MarketPlace.find({ 
        ownerId: req.user.userId,
        isActive: true})
    res.status(StatusCodes.OK).json({markets})
}

const getMarketById = async (req, res) => {
    const market = await MarketPlace.findById(req.params.id).populate(
        'ownerId',
        'name email role'
    )
      if (!market) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Market not found' })
  }

  if (market.ownerId._id.toString() !== req.user.userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Not authorized' })
  }

  res.status(StatusCodes.OK).json({ market })
}

const updateMarket = async (req, res) => {
    const market = await MarketPlace.findById(req.params.id)
    if (!market) return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Market not found' })

    if (market.ownerId.toString() !== req.user.userId)
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Not authorized' })

    const { marketName, location, address, description, category } = req.body

    market.marketName = marketName || market.marketName
    market.location = location || market.location
    market.address = address || market.address
    market.description = description || market.description
    market.category = category || market.category

    await market.save()
    res.status(StatusCodes.OK).json({ market })
}

const deleteMarket = async (req, res) => {
    const market = await MarketPlace.findById(req.params.id)
    if (!market) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Market not found' })}

    if (market.ownerId.toString() !== req.user.userId){
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Not authorized' })
      }

    market.isActive = false
    await market.save()
    res.status(StatusCodes.OK).json({ msg: 'Market deleted' })
}

module.exports = {
    createMarket,
    getMarkets,
    getMarketById,
    updateMarket,
    deleteMarket
}