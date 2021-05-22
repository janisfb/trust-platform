const Router = require("express").Router;
const serviceCreationMiddleware = require("../../middleware/serviceCreationMiddleware");
const serviceController = require("../../controllers/serviceController.js");
const serviceExecutionController = require("../../controllers/serviceExecutionController.js");
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const TrustLogger = require("trust-logger-ba");

const Logger = new TrustLogger({
  format: "standardFormat",
  transports: [
    {
      name: "kafkaTransport",
      meta: {
        kafkaBroker: "kafka:9092",
        kafkaClientId: "data-management",
        logTopic: "logs",
      },
    },
    {
      name: "consoleTransport",
      meta: {},
    },
  ],
  source: "data-management",
});

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
        console.log("reached next stop");
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
          // log the data used by the service
          var serviceName = message.service.name.split("_")[1].split(".")[0];
          var logPayload = {
            user_name: req.headers["x-consumer-username"],
            user_ip: req.headers["x-real-ip"],
            session: req.headers["cookie"]
              .replace("session=", "")
              .split("|")[0],
            status: "success",
            data_owner: message.file.creator,
            data_id: message.file.id,
            data_name: message.file.fileName,
            reason: `service '${serviceName}' with id '${message.service.id}' used`,
          };
          Logger.log("Use", logPayload);

          // if external services are used log that data was shared
          const externalCallback = (externalService) => {
            if (externalService != null) {
              var logPayload = {
                user_name: req.headers["x-consumer-username"],
                user_ip: req.headers["x-real-ip"],
                session: req.headers["cookie"].replace("session=", "").split("|")[0],
                status: "success",
                data_owner: message.file.creator,
                data_id: message.file.id,
                data_name: message.file.fileName,
                reason: `shared data with external service '${externalService}'`,
              };
              Logger.log("Share", logPayload);
            }              
          };
          serviceController.usesExternal(
            req.params.serviceId,
            externalCallback
          );
        } else {
          var logPayload = {
            user_name: req.headers["x-consumer-username"],
            user_ip: req.headers["x-real-ip"],
            session: req.headers["cookie"]
              .replace("session=", "")
              .split("|")[0],
            status: "failed",
            data_owner: "-",
            data_id: req.params.fileId,
            data_name: "-",
            reason: `'${serviceName}' service execution failed: ${message}`,
          };
          Logger.log("Use", logPayload);
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
      var logPayload = {
        user_name: req.headers["x-consumer-username"],
        user_ip: req.headers["x-real-ip"],
        session: req.headers["cookie"].replace("session=", "").split("|")[0],
        status: "failed",
        data_owner: "-",
        data_id: req.params.fileId,
        data_name: "-",
        reason: `'${serviceName}' service execution failed`,
      };
      Logger.log("Use", logPayload);
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  });

