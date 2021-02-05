const Joi = require("joi");

module.exports = {
  /**
   * Validates the post request on creating new services.
   * Essentially mirrors the client side validation on the frontend.
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  validate(req, res, next) {
    const schema = Joi.object({
      company: Joi.string()
        .required()
        .error(new Error("You must provide a company name!")),

      url: Joi.string()
        .pattern(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
        )
        .required()
        .error(new Error("You must provide a valid url!")),

      tel: Joi.string()
        .pattern(/\(?\+?\(?4?9?\)?[ ()]?([- ()]?\d[- ()]?){10}/)
        .required()
        .error(new Error("You must provide a valid telephone number!")),

      email: Joi.string()
        .email()
        .required()
        .error(new Error("You must provide a valid email address!")),

      name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .error(
          new Error(
            "You must provide a service name with min. 3 and max. 50 characters!"
          )
        ),

      version: Joi.string()
        .min(3)
        .max(50)
        .required()
        .error(new Error("You must provide a version! Example: 1.0.0")),

      description: Joi.string()
        .min(10)
        .max(280)
        .required()
        .error(
          new Error(
            "You must provide a description with min. 10 max. 280 characters!"
          )
        ),

      needsFullAccess: Joi.boolean()
        .required()
        .error(
          new Error("You must provide if the service needs full data access!")
        ),

      accessReason: Joi.string()
        .min(10)
        .max(280)
        .required()
        .error(
          new Error(
            "You must provide an access reason if the service needs full access! Otherwise use the value 'Not Applicable'."
          )
        ),

      usesExternalService: Joi.boolean()
        .required()
        .error(
          new Error("You must provide if the service uses external services!")
        ),

      externalServiceName: Joi.string()
        .min(10)
        .max(150)
        .required()
        .error(
          new Error(
            "You must provide a reason if external services are used! Otherwise use the value 'Not Applicable'."
          )
        ),

      externalServiceReason: Joi.string()
        .min(10)
        .max(280)
        .required()
        .error(
          new Error(
            "You must provide the external services name if external services are used! Otherwise use the value 'Not Applicable'."
          )
        ),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      validationResult.error.statusCode = 400;
      next(validationResult.error);
    } else {
      next();
    }
  },
};
