const glob = require("glob");
const config = require("../config/config");
const fs = require("fs");

module.exports = {
  isAccessAuthorized(req, res, next) {
    try {
      const username = req.headers["x-consumer-username"];
      if (username == "admin") {
        next();
      } else {
        var files = glob.sync(
          `${config.UPLOAD_DIRECTORY}/*-${req.params.id}-*`
        );

        let fileUploadPath;
        console.log(files);

        if (files.length > 0) {
          fileUploadPath = files[0];
        }

        if (files.length > 1 || !fs.existsSync(fileUploadPath)) {
          console.log(`No distinctive file found for ${req.params.id}.`);
          var notFoundErr = new Error(
            "You don't have access to this ressource."
          );
          notFoundErr.statusCode = 404;
          next(notFoundErr);
        }

        var filename = fileUploadPath.replace(/^.*[\\\/]/, "");

        if (filename.split("-")[0] == username) {
          next();
        } else {
          console.log(
            "You shall not pass! No access for",
            username,
            "on ressource",
            req.params.id
          );
          var noAccessErr = new Error(
            "You don't have access to this ressource."
          );
          noAccessErr.statusCode = 401;
          next(noAccessErr);
        }
      }
    } catch (error) {
      error.statusCode = 403;
      next(error);
    }
  },
};
