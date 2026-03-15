const {StatusCodes} = require('http-status-codes')

const authorizeRoles = (...roles) =>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(StatusCodes.FORBIDDEN).json({ msg: 'Access denied: insufficent permissions'})
        }
        next()
    }
}

module.exports = authorizeRoles