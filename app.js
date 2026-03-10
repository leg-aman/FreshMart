const express = require('express')
const app = express()
const connectDB = require('./db/connect')
require('dotenv').config()

const port = process.env.PORT || 3000

const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const authRouter = require('./routes/auth')
const marketPlaceRouter = require('./routes/marketPlaceRouter')

app.use(express.static('./public'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Welcome to MarketPlace</h1>')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/markets', marketPlaceRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()