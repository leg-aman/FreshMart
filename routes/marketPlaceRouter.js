const express = require('express')
const router = express.Router()

// Get marketPlaces data
router.get('/api/v1/marketPlaces', (req, res) => {
  res.json(marketPlaces);
});

router.get('/api/v1/getMarketPlaces/:id', (req, res) => {
    const marketPlaceId = parseInt(req.params.id, 10)
    const marketPlace = marketPlaces.find(m => m.marketPlace_id === marketPlaceId)

    if (!marketPlace) {
        return res.status(404).send('Market place not found!')
    }

    res.json(marketPlace)
})

router.post('/api/v1/marketPlaces', (req,res) => {
    
})

router.delete('/api/v1/marketPlaces/:id', (req,res) => {
    
})

module.exports = router
