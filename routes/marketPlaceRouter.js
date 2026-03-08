const express = require('express')
const router = express.Router()

const {
  createMarket,
  getMarkets,
  getMarketById,
  updateMarket,
  deleteMarket,
} = require('../controllers/marketPlaceController')

const authenticateUser = require('../middleware/authentication')
const authorizeRoles = require('../middleware/authorize')

router.get('/', authenticateUser, authorizeRoles('Vendor'), getMarkets)
router.get('/:id', authenticateUser, authorizeRoles('Vendor'), getMarketById)
router.post('/', authenticateUser, authorizeRoles('Vendor'), createMarket)
router.put('/:id', authenticateUser, authorizeRoles('Vendor'), updateMarket)
router.delete('/:id', authenticateUser, authorizeRoles('Vendor'), deleteMarket)

module.exports = router