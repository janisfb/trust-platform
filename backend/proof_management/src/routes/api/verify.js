const Router = require("express").Router;
const proofVerificationController = require("../../controllers/proofVerificationController");
const config = require("../../config/config");

/**
 * routes for proof verification
 *  - /proofs/verify/:logId - verify the log with _id logId
 *  - /proofs/verify - verify the chain
 */
module.exports = Router({ mergeParams: true })
  .get("/proofs/verify/:logId", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      proofVerificationController.verifyLog(req.params.logId, callback);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .get("/proofs/verify", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      proofVerificationController.verfiyChain(callback);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  });
