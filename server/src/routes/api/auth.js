const Router = require('express').Router
const authenticationController = require('../../controllers/authenticationController')
const authenticationPolicyMiddleware = require('../../middleware/authenticationPolicyMiddleware')

module.exports = Router({ mergeParams: true })
  .post('/register', authenticationPolicyMiddleware.register, async (req, res, next) => {
    try {
      const user = await authenticationController.register(req, res, next)
      res.send(user)
    } catch (error) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      })
    }
  })
  .post('/login', async (req, res, next) => {
    try {
      const userToken = await authenticationController.login(req, res, next)
      res.send(userToken)
    } catch (error) {
      next(error)
    }
  })
