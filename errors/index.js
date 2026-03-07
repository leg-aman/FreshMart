const CustomAPIError = require('./custom-api')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')

// Keeping the typo version for backward compatibility
const UnauthenticartedError = UnauthenticatedError

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  UnauthenticartedError,
}