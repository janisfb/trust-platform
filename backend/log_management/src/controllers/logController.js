const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://elasticsearch:9200" });

var config = require("../config/config");

// CAUTION: The elasticsearch requests are limited to the range 0 to 5000
//  if more than 5000 logs were generated queries might not return all generated logs!
//  This is for demonstrating purposes - in real world scenarions "scroll" or
//  chunk loading should be used

/**
 * Gets all the logs that are associated to the user.
 * These could be logs created by actions of the user himself or log
 *  containing data that is owned by the user.
 *
 * @param {string} reqUsername The username of the user that is requesting the logs.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.getUserLogs = function (reqUsername, resCallback) {
  client.search(
    {
      index: "logs-*",
      body: {
        from: 0,
        size: 5000,
        query: {
          multi_match: {
            query: reqUsername,
            fields: ["user_name", "data_owner"],
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log("Error while fetching files.");
        resCallback(500, err);
        return;
      }

      var response = {
        total: result.body.hits.total,
        logs: result.body.hits.hits,
      };

      if (config.CONSOLE_LOGGING)
        console.log(
          `fetched ${result.body.hits.total} logs for user ${reqUsername}!`
        );

      resCallback(200, response);
    }
  );
};

/**
 * Gets the log entries for the fileId that are associated with file sharing.
 * 
 * @param {string} reqUsername The username of the current user.
 * @param {string} fileId The fileId of the file.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.getSharedInstances = function(reqUsername, fileId, resCallback) {
  client.search(
    {
      index: "logs-*",
      body: {
        from: 0,
        size: 5000,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: reqUsername,
                  fields: ["user_name", "data_owner"],
                },
              },
              {
                multi_match: {
                  query: "share",
                  fields: ["category"],
                },
              },
              {
                term: {
                  data_id: fileId,
                },
              },
            ],
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log("Error while fetching files.");
        resCallback(500, err);
        return;
      }

      var response = {
        total: result.body.hits.total,
        logs: result.body.hits.hits,
      };

      if (config.CONSOLE_LOGGING)
        console.log(
          `fetched ${result.body.hits.total} logs of data sharing for user ${reqUsername} and file id ${fileId}!`
        );

      resCallback(200, response);
    }
  );
}

/**
 * Allows filtering of logs.
 * 
 * @param {string} reqUsername The username of the current user.
 * @param {*} reqQuery The query with the query parameters for the filters.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.filterLogs = function(reqUsername, reqQuery, resCallback) {
  console.log(reqQuery.prios);
  if(!reqQuery || Object.keys(reqQuery).length === 0) {
    resCallback(404, "Request contained no queries for filtering. Possible queries: prios, categories.");
    return;
  }

  var prios = [1, 2, 3, 4];
  if (reqQuery.prios != undefined) {
    prios = reqQuery.prios.split(",");
  }
  
  var categories = [
    "login",
    "create",
    "store",
    "change",
    "archive",
    "use",
    "share",
    "destroy",
  ];
  if (reqQuery.categories != undefined) {
    categories = reqQuery.categories.split(",");
  }

  client.search(
    {
      index: "logs-*",
      body: {
        from: 0,
        size: 5000,
        query: {
          bool: {
            must: {
              multi_match: {
                query: reqUsername,
                fields: ["user_name", "data_owner"],
              },
            },
            must: [
              {
                terms: {
                  priority: prios,
                }
              },
              {
                terms: {
                  category: categories,
                }           
              }
            ]            
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log("Error while fetching files.");
        console.log(err);
        resCallback(500, err);
        return;
      }

      var response = {
        total: result.body.hits.total,
        logs: result.body.hits.hits,
      };

      if (config.CONSOLE_LOGGING)
        console.log(
          `fetched ${result.body.hits.total} logs for user ${reqUsername}!`
        );
      resCallback(200, response);
    }
  );
}