const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    throw new UnauthenticatedError('Authentication invalid')
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    }

    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth