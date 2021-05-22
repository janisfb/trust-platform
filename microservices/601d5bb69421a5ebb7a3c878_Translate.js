// not added to service db
module.exports = {
  execute: ({ filebuffer, filename }, serviceCallback) => {
    const request = require("request");

    var text = "";
    try {
      text = filebuffer.toString("utf-8");
    } catch (err) {
      console.log(error);
      serviceCallback(error.status, {
        error: "File format cannot be translated",
      });
    }
    console.log(text);

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "accept-encoding": "application/json",
        "x-rapidapi-key": "a8054801e9mshe75407be40c86aep19f3d1jsn55592c3f10ec",
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
        useQueryString: true,
      },
      form: { q: text, source: "en", target: "de" },
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
        var parsedBody = JSON.parse(body);
        if(parsedBody.message != undefined) {
          serviceCallback(200, { result: `Für diesen Monat wurde das Limit an Zeichen für diese API überschritten. 
          Dieser Service kann also leider nicht ausgeführt werden.`});
        } else {
          serviceCallback(200, {
            result: parsedBody.data.translations[0].translatedText,
          });
        }
      } catch (err) {
        console.log("Error upon reformatting results.", err);
        serviceCallback(500, { error: "Something went wrong." });
      }
    });
  },
};