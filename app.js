const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const connectDB = require('./db/connect')
require('dotenv').config()

const helmet = require('helmet')
// const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})



const port = process.env.PORT || 3000

const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const authRouter = require('./routes/auth')
const marketPlaceRouter = require('./routes/marketPlaceRouter')
const productRouter = require('./routes/productRouter')

app.use(express.static('./public'))
app.use(express.json())
app.use(cookieParser())

app.use(helmet())
// app.use(xss())
app.use(limiter)

app.get('/', (req, res) => {
  res.send('<h1>Welcome to FreshMart</h1>')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/markets', marketPlaceRouter)
app.use('/api/v1/products', productRouter)

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