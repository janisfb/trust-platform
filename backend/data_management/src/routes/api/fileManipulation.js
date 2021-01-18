const Router = require("express").Router;
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const fileManipulationController = require("../../controllers/fileManipulationController");

/**
 * routes for file manipulation operations
 *  - /upload receive a single file and upload or overwrite it to the right directory
 *  - /delete delete a single file using either the name or the identifier
 */
module.exports = Router({ mergeParams: true })
  .post("/files", accessPolicyMiddleware.isAccessAuthorized, async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      fileManipulationController.uploadFile(
        req.files,
        req.headers["x-consumer-username"],
        callback
      );
    } catch (error) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .get("/files", async (req, res, next) => {
    console.log("received request");
    res.send("received request");
  });
