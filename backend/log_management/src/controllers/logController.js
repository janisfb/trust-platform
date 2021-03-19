const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://elasticsearch:9200" });

var config = require("../config/config");

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

      if(config.CONSOLE_LOGGING) 
        console.log(`fetched ${result.body.hits.total} logs for user ${reqUsername}!`);

      resCallback(200, response);
    }
  );
};

exports.getPrioLogs = function(reqUsername, reqQuery, resCallback) {
  console.log(reqQuery);
  if(!reqQuery || Object.keys(reqQuery).length === 0) {
    resCallback(404, "Request contained no priority.");
    return;
  }
  console.log(reqQuery.prios.split(","));

  client.search(
    {
      index: "logs-*",
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query: reqUsername,
                fields: ["user_name", "data_owner"],
              },
            },
            filter: {
              terms: {
                priority: reqQuery.prios.split(","),
              },
            },
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
      console.log(response);
      resCallback(200, response);
    }
  );
}