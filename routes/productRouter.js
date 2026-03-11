const express = require('express')
const router = express.Router()

const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/productController')

const authenticateUser = require('../middleware/authentication')
const authorizeRoles = require('../middleware/authorize')

router.get('/', authenticateUser, authorizeRoles('Vendor' || 'Customer'), getProducts)
router.post('/', authenticateUser, authorizeRoles('Vendor'), createProduct)
router.put('/:id', authenticateUser, authorizeRoles('Vendor'), updateProduct)
router.delete('/:id', authenticateUser, authorizeRoles('Vendor'), deleteProduct)

router.get('/search', searchProducts)

module.exports = router