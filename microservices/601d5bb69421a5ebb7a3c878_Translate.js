module.exports = {
  execute: (file, serviceCallback) => {
    const request = require("request");

    var text = "";
    try {
      text = file.toString('utf-8');
    } catch (err) {
      console.log(error);
      serviceCallback(error.status, { error: "File format cannot be translated" });
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
        serviceCallback(error.status, { error: "Something went wrong."})
      }

      console.log(body);
      serviceCallback(200, { result: JSON.parse(body).data.translations[0].translatedText });
    });
    // var axios = require("axios").default;

    // var options = {
    //   method: "POST",
    //   url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
    //   headers: {
    //     "content-type": "application/x-www-form-urlencoded",
    //     "accept-encoding": "application/gzip",
    //     "x-rapidapi-key": "a8054801e9mshe75407be40c86aep19f3d1jsn55592c3f10ec",
    //     "x-rapidapi-host": "google-translate1.p.rapidapi.com",
    //   },
    //   data: { q: "Hello, world!", source: "en", target: "es" },
    // };

    // axios
    //   .request(options)
    //   .then(function (response) {
    //     console.log(response.data);
    //     serviceCallback(200, response);
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //     serviceCallback(error.status, `There was an error: \n ${error}`);
    //   });
  }
};