const Router = require("express").Router;
const authController = require("../../controllers/authController");
const TrustLogger = require("trust-logger-ba");

const config = require("../../config/config");

const Logger = new TrustLogger(
  "kafka:9092",
  "auth_management",
  "logs",
  "auth_management"
);

/**
 * routes for auth service 
 *  - /login Builds the response for the client. The login itself is handled by the Kong Gateway.
 */
module.exports = Router({ mergeParams: true })
  .post("/login", async (req, res, next) => {
    console.log("--- login requested ---");
    try {
      const callback = (status, message) => {
        if (status == 200)
          Logger.log(req, "Login", true, null, "user successfully logged in");
        res.status(status).send(message);
      };
      authController.loginUser(
        req.headers["x-consumer-username"],
        req.headers["cookie"],
        callback
      );
    } catch (error) {
      Logger.log(req, "Login", false, null, "user login failed");
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .post("/login?session_logout", async (req, res, next) => {
    console.log("hey");
    try {
      if (config.CONSOLE_LOGGING) console.log(req);
      const callback = (status, message) => {
        if (status == 200)
          Logger.log(req, "Login", true, null, "user successfully logged out");
        res.status(status).send(message);
      };
      authController.logoutUser(
        req.headers["x-consumer-username"],
        req.headers["cookie"],
        callback
      );
    } catch (error) {
      Logger.log(req, "Login", false, null, "user logout failed");
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  });
