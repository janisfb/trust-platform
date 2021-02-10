module.exports = {
  execute: ({ filebuffer, filename }, serviceCallback) => {
    const request = require("request");

    console.log(
      "starting service fileIO for ",
      filename,
      "buffer: ",
      filebuffer
    );

    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        url: "https://file.io",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      var req = request(options, function (error, response, body) {
        if (error) {
          console.log(error);
          serviceCallback(error.status || 500, {
            error: "Something went wrong.",
          });
        }

        console.log(body);

        try {
          var parsedBody = JSON.parse(body);
          serviceCallback(200, {
            result: `Deine Datei wurde hochgeladen und kann die nächsten ${String(
              parsedBody.expiry
            ).replace(" days", "")} 
              Tage unter ${parsedBody.link} heruntergeladen werden`,
          });
        } catch (err) {
          console.log("Error upon reformatting results.", err);
          serviceCallback(500, { error: "Something went wrong." });
        }
      });

      var formReq = req.form();
      formReq.append("file", filebuffer, { filename: filename });
    });
  },
};
