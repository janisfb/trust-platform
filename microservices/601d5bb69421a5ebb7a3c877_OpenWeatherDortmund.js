module.exports = {
  execute: (file, serviceCallback) => {
    var axios = require("axios").default;

    var options = {
      method: "GET",
      url: "https://community-open-weather-map.p.rapidapi.com/weather",
      params: { q: "Dortmund,de", lang: "de", units: "metric" },
      headers: {
        //api keys should not be 'public'
        "x-rapidapi-key": "a8054801e9mshe75407be40c86aep19f3d1jsn55592c3f10ec",
        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("in the service:", response.data);
        serviceCallback(response.data);
      })
      .catch(function (error) {
        console.error(error);
        return error;
      });
  },
};