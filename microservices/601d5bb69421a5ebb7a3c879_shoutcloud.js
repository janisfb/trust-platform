// Service that sends the text in the file buffer to shoutcloud.io
module.exports = {
  execute: ({ filebuffer, filename }, serviceCallback) => {
    const request = require("request");

    var text = "";
    try {
      text = filebuffer.toString("utf-8");
    } catch (error) {
      console.log(error);
      serviceCallback(error.status, {
        error: "File format cannot be translated",
      });
    }
    console.log(text);

    const options = {
      method: "POST",
      url: "HTTP://API.SHOUTCLOUD.IO/V1/SHOUT",
      headers: {
        "content-type": "application/json",
        "accept-encoding": "application/json",
      },
      body: { INPUT: text },
      json: true,
    };

    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        serviceCallback(error.status || 500, {
          error: "Something went wrong.",
        });
      }

      console.log(body);

      try {
        serviceCallback(200, {
          result: body.OUTPUT,
        });
      } catch (err) {
        console.log("Error upon reformatting results.", err);
        serviceCallback(500, { error: "Something went wrong." });
      }
    });
  },
};
