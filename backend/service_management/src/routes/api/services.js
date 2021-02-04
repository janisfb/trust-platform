const Router = require("express").Router;
const serviceCreationMiddleware = require("../../middleware/serviceCreationMiddleware");
const serviceController = require("../../controllers/serviceController.js");

/**
 * routes for adding services and getting a list of the available services
 */
module.exports = Router({ mergeParams: true })
  .post(
    "/services",
    serviceCreationMiddleware.validate,
    async (req, res, next) => {
      try {
        const callback = (status, message) => {
          res.status(status).send(message);
        };
        serviceController.createService(req.body, callback);
      } catch (error) {
        res.status(error.statusCode || 500).json({
          status: error.status,
          message: error.message,
        });
      }
    }
  )
  .get("/services", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      serviceController.getServices(callback);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  });

