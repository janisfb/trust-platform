const Router = require("express").Router;
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const fileController = require("../../controllers/fileController");
const config = require("../../config/config");

/**
 * routes for file manipulation operations
 *  - /upload receive a single file and upload or overwrite it to the right directory
 *  - /delete delete a single file using either the name or the identifier
 */
module.exports = Router({ mergeParams: true })
  .post("/files", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      fileController.uploadFile(
        req.files,
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
  .get("/files", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      fileController.getUserFiles(
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
  .post("/files/:id", accessPolicyMiddleware.isAccessAuthorized, async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      fileController.updateFile(
        req.params.id,
        req.files,
        callback
      );
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .delete("/files/:id", accessPolicyMiddleware.isAccessAuthorized, async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      fileController.deleteFile(
        req.params.id,
        callback
      );
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
