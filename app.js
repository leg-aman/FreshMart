require('./db/connect')
const express = require('express');
const app = express();
const {marketPlaces} = require('./data/dat')
const connectDB = require('./db/connect')
require('dotenv').config()
const log = console.log
const port = process.env.PORT || 3000
const authenticateUser = require('./middleware/authentication')

// error handler
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// routers
const authRouter = require('./routes/auth')
const marketPlaceRouter = require('./routes/marketPlaceRouter')

// middleware
app.use(express.static('./public'));
app.use(express.json())



// Test route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to MarketPlace</h1>');
});

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/markets', authenticateUser, marketPlaceRouter )

app.use(notFound)
app.use(errorHandlerMiddleware)

// Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();