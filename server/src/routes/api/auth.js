const Router = require('express').Router

module.exports = Router({ mergeParams: true })
  .post('/register', async (req, res, next) => {
    try {
      res.send({
        message: `Register: ${req.body.email}!`
      })
    } catch (error) {
      next(error)
    }
  })
