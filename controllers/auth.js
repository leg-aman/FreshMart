const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(400).json({ msg: 'Email already registered.' })
    }

    const user = await User.create({ name, email, password, role })
    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name,
            role: user.role
        },
        token
    })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentilas')
    }
    // compare password
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            role: user.role
        },
        token
    })
}

const logout = (req, res) => {
    // for JWT stored on client-side (JSON), logout is done client-side by deleting the token
    // here we just send a message
    res.status(200).json({ msg: 'Logged out successfully!' })
}
module.exports = { register, login, logout }