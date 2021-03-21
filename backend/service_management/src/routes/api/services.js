const Router = require("express").Router;
const serviceCreationMiddleware = require("../../middleware/serviceCreationMiddleware");
const serviceController = require("../../controllers/serviceController.js");
const serviceExecutionController = require("../../controllers/serviceExecutionController.js");
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const TrustLogger = require("trust-logger-ba");

const config = require("../../config/config");

const Logger = new TrustLogger(
  "kafka:9092",
  "data_management",
  "logs",
  "data_management"
);

/**
 * routes for adding services, getting a list of the available services 
 * and executing services on data
 */
module.exports = Router({ mergeParams: true })
  .post(
    "/services",
    serviceCreationMiddleware.validate,
    async (req, res, next) => {
      try {
        const callback = (status, message) => {
          res.status(status).send(message);
        };
        console.log(req.body);
        serviceController.createService(req.body, req.files, callback);
      } catch (error) {
        res.status(error.statusCode || 500).json({
          status: error.status,
          message: error.message,
        });
      }
    }
  )
  .get("/services", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      serviceController.getServices(callback);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .get("/services/:serviceId/:fileId", accessPolicyMiddleware.isAccessAuthorized, async (req, res, next) => {
    try {
      const callback = (status, message) => {
        if(status == 200) {
          // log the data use by the service
          var data = {
            owner: message.file.creator,
            id: message.file.id,
            name: message.file.fileName,
          };
          var serviceName = message.service.name.split("_")[1].split(".")[0];
          Logger.log(
            req,
            "Use",
            true,
            data,
            `service '${serviceName}' with id '${message.service.id}' used`
          );

          // if external services are used log that data was shared
          const externalCallback = (externalService) => {
            if (externalService != null)
              Logger.log(
                req,
                "Share",
                true,
                data,
                `shared data with external service '${externalService}'`
              );
          };
          serviceController.usesExternal(
            req.params.serviceId,
            externalCallback
          );
        } else {
          Logger.log(
            req,
            "Use",
            false,
            { owner: "-", id: req.params.fileId, name: "-" },
            `'${serviceName}' service execution failed: ${message}`
          );
        }

        res.status(status).send(message);
      };
      serviceExecutionController.executeService(
        req.params.serviceId,
        req.params.fileId,
        callback
      );
    } catch (error) {
      console.log("error upon routing: ",error);
      Logger.log(
        req,
        "Use",
        false,
        { owner: "-", id: req.params.fileId, name: "-" },
        `'${serviceName}' service execution failed`
      );
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  });

