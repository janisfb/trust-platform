var path = require("path");
var fs = require("fs");

var config = require("../config/config");

exports.uploadFile = function (reqFiles, reqUsername, resCallback) {
  if (!reqFiles || Object.keys(reqFiles).length === 0) {
    console.log("No files were uploaded / added to the request.");
    resCallback(400, "No files were uploaded.");
    return;
  }

  // The name of the input field (retrieve the file)
  let uploadFile = reqFiles.uploadFile;

  let userDirectory = path.join(
    config.UPLOAD_DIRECTORY,
    reqUsername
  );

  if (!fs.existsSync(userDirectory)) {
    fs.mkdirSync(userDirectory);
  }

  let fileUploadPath = path.join(userDirectory, uploadFile.name);

  // Temp file will be moved to the final destination
  uploadFile.mv(fileUploadPath, function (err) {
    if (err) {
      console.log("Error while uploading file.");
      resCallback(500, err);
      return;
    }

    console.log(`File uploaded to ${fileUploadPath}!`);
    resCallback(200, `File uploaded to ${fileUploadPath}!`);
  });
};

