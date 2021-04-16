const Router = require("express").Router;
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const proofGenerationController = require("../../controllers/proofGenerationController");
const config = require("../../config/config");

/**
 * routes for proof generation and retrieval
 *  - /proofs - get all blocks
 *  - /proofs/generate - generate new block for timeframe
 *  - /proofs - DEL - delete all blocks
 */
module.exports = Router({ mergeParams: true })
  .get("/proofs", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      proofGenerationController.getBlocks(callback);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .post(
    "/proofs/generate",
    accessPolicyMiddleware.isAccessAuthorized,
    async (req, res, next) => {
      try {
        const callback = (status, message) => {
          res.status(status).send(message);
        };
        console.log(req.query);
        proofGenerationController.generateProof(
          req.query.endTime,
          callback
        );
      } catch (error) {
        res.status(error.statusCode || 500).json({
          status: error.status,
          message: error.message,
        });
      }
    }
  )
  .delete(
    "/proofs",
    accessPolicyMiddleware.isAccessAuthorized,
    async (req, res, next) => {
      try {
        const callback = (status, message) => {
          res.status(status).send(message);
        };
        proofGenerationController.deleteAll(callback);
      } catch (error) {
        res.status(error.statusCode || 500).json({
          status: error.status,
          message: error.message,
        });
      }
    }
  );