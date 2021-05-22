const Router = require("express").Router;
const accessPolicyMiddleware = require("../../middleware/accessPolicyMiddleware");
const fileController = require("../../controllers/fileController");
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
    source: "data-management"
  }
);

/**
 * routes for file retrieving and file manipulation operations
 *  - get all files associated to the user
 *  - receive a single file and upload or overwrite it to the right directory
 *  - delete a single file using either the name or the identifier
 */
module.exports = Router({ mergeParams: true })
  .post("/files", async (req, res, next) => {
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
            data_owner: message.file.creator,
            data_id: message.file.id,
            data_name: message.file.fileName,
            reason: "data was uploaded",
          };
          Logger.log("Store", logPayload);
        } else {
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
            reason: "data was uploaded",
          };
          Logger.log("Store", logPayload);
        }

        res.status(status).send(message);
      };
      fileController.uploadFile(
        req.files,
        req.headers["x-consumer-username"],
        callback
      );
    } catch (error) {
      Logger.log(req, "Change", false, null, "could not upload the file");
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .get("/files", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        if (status == 200) {
          var data = [];
          message.forEach((obj) =>
            data.push({
              data_owner: obj.creator,
              data_id: obj.id,
              data_name: obj.fileName,
            })
          );
          data.forEach((dataObj) => {
            var logPayload = {
              user_name: req.headers["x-consumer-username"],
              user_ip: req.headers["x-real-ip"],
              session: req.headers["cookie"]
                .replace("session=", "")
                .split("|")[0],
              status: "success",
              data_owner: dataObj.data_owner,
              data_id: dataObj.data_id,
              data_name: dataObj.data_name,
              reason: "file information requested by user",
            };
            Logger.log("View", logPayload);
          })
        } else {
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
            reason: `could not get user files: ${message}`,
          };
          Logger.log("View", logPayload);
        }

        res.status(status).send(message);
      };
      fileController.getUserFiles(req.headers["x-consumer-username"], false, callback);
    } catch (error) {
      var logPayload = {
        user_name: req.headers["x-consumer-username"],
        user_ip: req.headers["x-real-ip"],
        session: req.headers["cookie"].replace("session=", "").split("|")[0],
        status: "failed",
        data_owner: "-",
        data_id: "-",
        data_name: "-",
        reason: "could not get user files",
      };
      Logger.log("View", logPayload);
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .get("/files/all", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        if (status == 200) {
          var data = [];
          message.forEach((obj) =>
            data.push({
              data_owner: obj.creator,
              data_id: obj.id,
              data_name: obj.fileName,
            })
          );
          data.forEach((dataObj) => {
            var logPayload = {
              user_name: req.headers["x-consumer-username"],
              user_ip: req.headers["x-real-ip"],
              session: req.headers["cookie"]
                .replace("session=", "")
                .split("|")[0],
              status: "success",
              data_owner: dataObj.data_owner,
              data_id: dataObj.data_id,
              data_name: dataObj.data_name,
              reason: "file information requested by user",
            };
            Logger.log("View", logPayload);
          });
        } else {
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
            reason: "could not get user files",
          };
          Logger.log("View", logPayload);
        }

        res.status(status).send(message);
      };
      fileController.getUserFiles(req.headers["x-consumer-username"], true, callback);
    } catch (error) {
      var logPayload = {
        user_name: req.headers["x-consumer-username"],
        user_ip: req.headers["x-real-ip"],
        session: req.headers["cookie"].replace("session=", "").split("|")[0],
        status: "failed",
        data_owner: "-",
        data_id: "-",
        data_name: "-",
        reason: "could not get user files",
      };
      Logger.log("View", logPayload);
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .post(
    "/files/:id",
    accessPolicyMiddleware.isAccessAuthorized,
    async (req, res, next) => {
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
              data_owner: message.file.creator,
              data_id: message.file.id,
              data_name: message.file.fileName,
              reason: "file changed/replaced by user",
            };
            Logger.log("Change", logPayload);
          } else {
            Logger.log(
              req,
              "Change",
              false,
              { owner: "-", id: req.params.id, name: "-" },
              `file change/replace failed: ${message}`
            );
          }

          res.status(status).send(message);
        };
        fileController.updateFile(req.params.id, req.files, callback);
      } catch (error) {
        var logPayload = {
          user_name: req.headers["x-consumer-username"],
          user_ip: req.headers["x-real-ip"],
          session: req.headers["cookie"].replace("session=", "").split("|")[0],
          status: "failed",
          data_owner: "-",
          data_id: "-",
          data_name: "-",
          reason: "file change/replace failed",
        };
        Logger.log("Change", logPayload);
        res.status(error.statusCode || 500).json({
          status: error.status,
          message: error.message,
        });
      }
    }
  )
  .delete(
    "/files/:id",
    accessPolicyMiddleware.isAccessAuthorized,
    async (req, res, next) => {
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
              data_owner: message.file.creator,
              data_id: message.file.id,
              data_name: message.file.fileName,
              reason: "file deleted by user",
            };
            Logger.log("destroy", logPayload);
          } else {
            var logPayload = {
              user_name: req.headers["x-consumer-username"],
              user_ip: req.headers["x-real-ip"],
              session: req.headers["cookie"]
                .replace("session=", "")
                .split("|")[0],
              status: "failed",
              data_owner: "-",
              data_id: req.params.id,
              data_name: "-",
              reason: `file deletion failed: ${message}`,
            };
            Logger.log("destroy", logPayload);
          }

          res.status(status).send(message);
        };
        fileController.deleteFile(req.params.id, callback);
      } catch (error) {
        var logPayload = {
          user_name: req.headers["x-consumer-username"],
          user_ip: req.headers["x-real-ip"],
          session: req.headers["cookie"].replace("session=", "").split("|")[0],
          status: "failed",
          data_owner: "-",
          data_id: req.params.id,
          data_name: "-",
          reason: `file deletion failed: ${message}`,
        };
        Logger.log("destroy", logPayload);
        res.status(error.statusCode || 500).json({
          status: error.status,
          message: error.message,
        });
      }
    }
  );
