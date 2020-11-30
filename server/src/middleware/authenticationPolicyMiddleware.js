const Joi = require('joi')

module.exports = {
  register (req, res, next) {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .error(new Error('You must provide a valid email address!')),

      password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{8,32}$/)
        .required()
        .error(new Error('Your password must be at least 8 characters in length an no longer than 32'))
    })

    const validationResult = schema.validate(req.body)

    if (validationResult.error) {
      validationResult.error.statusCode = 400
      next(validationResult.error)
    } else {
      next()
    }
  }
}
