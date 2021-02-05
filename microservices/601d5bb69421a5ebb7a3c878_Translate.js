module.exports = {
  execute: (file, serviceCallback) => {
    var axios = require("axios").default;

    var options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "accept-encoding": "application/gzip",
        "x-rapidapi-key": "a8054801e9mshe75407be40c86aep19f3d1jsn55592c3f10ec",
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
      },
      data: { q: "Hello, world!", source: "en", target: "de" },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        serviceCallback(response);
      })
      .catch(function (error) {
        console.error(error);
        serviceCallback("There was an error");
      });
  },
};