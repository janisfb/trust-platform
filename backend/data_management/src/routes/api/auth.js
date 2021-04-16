const Router = require("express").Router;
const authController = require("../../controllers/authController");
const TrustLogger = require("trust-logger-ba");

const config = require("../../config/config");

const Logger = new TrustLogger({
  format: "standardFormat",
  transports: [
    {
      name: "kafkaTransport",
      meta: {
        kafkaBroker: "kafka:9092",
        kafkaClientId: "data_management",
        logTopic: "logs",
      },
    },
    {
      name: "consoleTransport",
      meta: {},
    },
  ],
  source: "data_management",
});

/**
 * routes for auth service 
 *  - /login Builds the response for the client. The login itself is handled by the Kong Gateway.
 */
module.exports = Router({ mergeParams: true })
  .post("/login", async (req, res, next) => {
    console.log("--- login requested ---");
    try {
      const callback = (status, message) => {
        if (status == 200) {
          var logPayload = {
            user_name: req.headers["x-consumer-username"],
            user_ip: req.headers["x-real-ip"],
            session: req.headers["cookie"]
              .replace("session=", "")
              .split("|")[0],
            status: "success",
            data_owner: "-",
            data_id: "-",
            data_name: "-",
            reason: "user successfully logged in",
          };
          Logger.log("Login", logPayload);
        }
        res.status(status).send(message);
      };
      authController.loginUser(
        req.headers["x-consumer-username"],
        req.headers["cookie"],
        callback
      );
    } catch (error) {
      var logPayload = {
        user_name: req.headers["x-consumer-username"],
        user_ip: req.headers["x-real-ip"],
        session: req.headers["cookie"].replace("session=", "").split("|")[0],
        status: "failed",
        data_owner: "-",
        data_id: "-",
        data_name: "-",
        reason: "user login failed",
      };
      Logger.log("Login", logPayload);
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
        if (status == 200) {
          var logPayload = {
            user_name: req.headers["x-consumer-username"],
            user_ip: req.headers["x-real-ip"],
            session: req.headers["cookie"]
              .replace("session=", "")
              .split("|")[0],
            status: "failed",
            data_owner: "-",
            data_id: "-",
            data_name: "-",
            reason: "user successfully logged out",
          };
          Logger.log("Login", logPayload);
        }
        res.status(status).send(message);
      };
      authController.logoutUser(
        req.headers["x-consumer-username"],
        req.headers["cookie"],
        callback
      );
    } catch (error) {
      var logPayload = {
        user_name: req.headers["x-consumer-username"],
        user_ip: req.headers["x-real-ip"],
        session: req.headers["cookie"].replace("session=", "").split("|")[0],
        status: "failed",
        data_owner: "-",
        data_id: "-",
        data_name: "-",
        reason: "user logout failed",
      };
      Logger.log("Login", logPayload);
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  });
