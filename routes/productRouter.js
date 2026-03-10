const express = require('express')
const router = express.Router()

const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')

const authenticateUser = require('../middleware/authentication')
const authorizeRoles = require('../middleware/authorize')

router.get('/', authenticateUser ,getProducts)
router.post('/', authenticateUser, authorizeRoles('Vendor'), createProduct)
router.put('/:id', authenticateUser, authorizeRoles('Vendor'), updateProduct)
router.delete('/:id', authenticateUser, authorizeRoles('Vendor'), deleteProduct)

module.exports = router