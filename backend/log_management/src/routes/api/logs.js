const Router = require("express").Router;
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const logController = require("../../controllers/logController");
const config = require("../../config/config");

/**
 * routes for retrieval of logs
 *  - /logs - gets all logs associated to the user
 *  - /logs/shared/:fileId - gets all shared instances of the file
 *  - /logs/filter/ - enables backend filtering for the logs
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
  .get("/logs/shared/:fileId", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      logController.getSharedInstances(
        req.headers["x-consumer-username"], 
        req.params.fileId,
        callback
      );
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  }) 
  .get("/logs/filter", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      logController.filterLogs(
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
