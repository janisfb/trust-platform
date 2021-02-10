module.exports = {
  execute: ({ filebuffer, filename }, serviceCallback) => {
    const request = require("request");

    var location = "";
    try {
      location = filebuffer.toString("utf-8");
      if (!/^[\u00C0-\u017FA-Za-z]+,[a-z]{2}$/.test(location)) {
        serviceCallback(
          400,
          `Request: ${location} wrong format. 
          The file should contain a location in the format 'city,countryCode'. Example: 'Dortmund,de'`
        );
        return;
      }
    } catch (error) {
      console.log(error);
      serviceCallback(error.status || 500, {
        error: "File format cannot be translated",
      });
      return;
    }
    console.log(location);

    const options = {
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&lang=de&units=metric&appid=6053a7cb60c5e58116a1adb335d89dd0`,
    };

    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        serviceCallback(error.status || 500, {
          error: "Something went wrong.",
        });
      }

      console.log(body);
      var body = JSON.parse(body);
      serviceCallback(200, {
        result: `Die Temperatur in ${body.name} ist ${body.main.temp} (gefühlt ${body.main.feels_like}) Grad Celsius. Die momentane Wetterlage ist: ${body.weather[0].description}.`,
      });
    });
  },
};