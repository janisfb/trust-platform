const Router = require("express").Router;
const logController = require("../../controllers/logController");

var infoObject = {
  info: {
    title: "log-management API",
    summary: "API to retrieve logs.",
    description: `This API can be used to retrieve the log files associated with the current user.
      The 'logs'-field of this response already contains all the log messages. This API can also 
      be used to filter logs.`,
    termsOfService: "Not Applicable",
    contact: {
      name: "API Support (example values)",
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
      "/api/logs": {
        get: {
          description: "The endpoint you have just visited. Returns OpenAPI description and logs for user.",
          reponses: {
            200: {
              description:
                "Returns this page containing all logs associated to the user and fields for api information.",
            },
            "4xx/5xx": {
              description: "A message field containing the error text.",
            },
          },
        },
      },
    },
    {
      "api/logs/shared/": {
        get: {
          description:
            "Endpoint for logs that document a transfer of the file (shared to other API) with the ID dataId.",
          parameters: [
            {
              name: "dataId",
              in: "path",
              description:
                "The dataId of the file that should be searched for. Example: '405opg10klqlw4ec'",
              required: false,
            },
          ],
          reponses: {
            200: {
              description:
                "Returns all log entries with the dataId 'dataId' and the category 'share' if they can be associated to the user.",
            },
            "4xx/5xx": {
              description: "A message field containing the error text.",
            },
          },
        },
      },
    },
    {
      "api/logs/filter": {
        get: {
          description: "Endpoint for backend filtering of the logs.",
          parameters: [
            {
              name: "prios",
              in: "query",
              description: "Prios to be used. Example: '1,2,4'",
              required: false,
            },
            {
              name: "categories",
              in: "query",
              description: "Categories to be used. Example: 'share'",
              required: false,
            },
            {
              name: "dataId",
              in: "query",
              description: "DataId to be used. Example: '405opg10klqlw4ec'",
              required: false,
            },
            {
              name: "dataName",
              in: "query",
              description:
                "DataName to be used. Example: 'Bild.jpg' - wildcard search",
              required: false,
            },
            {
              name: "session",
              in: "query",
              description:
                "Session to be used. Example: '{-w17ZkN-wti-KLe6fwZniA}'",
              required: false,
            },
            {
              name: "user",
              in: "query",
              description:
                "User(-name) to be used. Example: 'test' - wildcard search",
              required: false,
            },
            {
              name: "user_ip",
              in: "query",
              description: "User_ip to be used. Example: '{172.19.0.1}'",
              required: false,
            },
          ],
          reponses: {
            200: {
              description:
                "Returns all log entries that match the given parameters.",
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
 * routes for retrieval of logs
 *  - /logs - gets all logs associated to the user
 *  - /logs/shared/:fileId - gets all shared instances of the file
 *  - /logs/filter/ - enables backend filtering for the logs
 */
module.exports = Router({ mergeParams: true })
  .get("/logs", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        message["description"] = infoObject;
        res.status(status).send(message);
      };
      logController.getUserLogs(req.headers["x-consumer-username"], callback);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message,
      });
    }
  })
  .get("/logs/shared/:dataId", async (req, res, next) => {
    try {
      const callback = (status, message) => {
        res.status(status).send(message);
      };
      logController.getSharedInstances(
        req.headers["x-consumer-username"],
        req.params.dataId,
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
