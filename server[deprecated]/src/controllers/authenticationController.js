const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign({ id: user.id }, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

exports.register = async (req, res, next) => {
  // Hashing
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const user = {
    email: req.body.email,
    password: hashedPassword
  }
  console.log('123')
  try {
    const userRecord = await User.create(user)
    user.id = userRecord.id
    delete user.password
    return user
  } catch (error) {
    error.statusCode = 403
    throw error
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (!user) {
      throw Object.assign(
        new Error('The login information was incorrect'),
        { statusCode: 403 }
      )
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      throw Object.assign(
        new Error('The login information was incorrect'),
        { statusCode: 403 }
      )
    }

    const userJson = user.toJSON()
    delete userJson.password
    return {
      user: userJson,
      token: jwtSignUser(user)
    }
  } catch (error) {
    error.statusCode = error.statusCode || 500
    console.error(error)
    throw error
  }
}
