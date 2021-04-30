const Router = require("express").Router;
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const proofGenerationController = require("../../controllers/proofGenerationController");
const config = require("../../config/config");

var infoObject = {
  info: {
    title: "proof-management API",
    summary: "API to retrieve proofs for log-management API.",
    description: `This API can be used to validate log-messages created by the log-management service.
      For this task a simple blockchain is used. Each block saves a bloomfilter containing all logs
      that were generated between the startTime and endTime that is saved in the data field. The API
      gives access to validation tools to a) validate the whole chain or b) validate a single log.`,
    termsOfService: "Not Applicable",
    contact: {
      name: "API Support",
      url: "https://www.example.com/support",
      email: "support@example.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    version: "1.0.0",
  },
  paths: [
    {
      "/api/proofs": {
        get: {
          description: "Endpoint that returns the whole blockchain.",
          reponses: {
            200: {
              description: `Returns the whole blockchain. Each block contains a timestamp, the previous hash,
                  a nonce, a data field (which itsself contains startTime, endTime and the bloom filter) 
                  and the hash of the block.`,
            },
            "4xx/5xx": {
              description: "A message field containing the error text.",
            },
          },
        },
      },
    },
    {
      "/api/proofs/verify": {
        get: {
          description:
            "Endpoint for validating/verifying the whole chain or a single log.",
          parameters: [
            {
              name: "logID",
              in: "path",
              description: "The logID of the log which should be validated.",
              required: false,
            },
          ],
          reponses: {
            200: {
              description: `Returns a validation message. When no parameter is passed the whole chain will be checked.
                When the logID has been added to the path only the log associated with the ID will be checked.`,
            },
            "4xx/5xx": {
              description: "A message field containing the error text.",
            },
          },
        },
      },
    },
  ],
};

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
        message["description"] = infoObject;
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