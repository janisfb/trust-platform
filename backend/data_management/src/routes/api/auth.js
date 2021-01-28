const Router = require("express").Router;
const authController = require("../../controllers/authController");

/**
 * routes for auth service 
 *  - /login Builds the response for the client. The login itself is handled by the Kong Gateway.
 */
module.exports = Router({ mergeParams: true }).post(
  "/login",
  async (req, res, next) => {
    try {
      console.log(req);
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      authController.loginUser(
        req.headers["x-consumer-username"],
        req.headers["cookie"],
        callback
      );
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  }
);
