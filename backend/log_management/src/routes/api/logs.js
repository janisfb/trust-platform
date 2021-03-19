const Router = require("express").Router;
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const logController = require("../../controllers/logController");
const config = require("../../config/config");

/**
 * routes for file manipulation operations
 *  - /upload receive a single file and upload or overwrite it to the right directory
 *  - /delete delete a single file using either the name or the identifier
 */
module.exports = Router({ mergeParams: true })
  .get("/logs", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      logController.getUserLogs(
        req.headers["x-consumer-username"], 
        callback
      );
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .get("/logs/prio", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      logController.getPrioLogs(
        req.headers["x-consumer-username"], 
        req.query,
        callback
      );
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  });
