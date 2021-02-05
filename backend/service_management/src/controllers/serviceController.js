const Service = require("../models/Service");
var path = require("path");
const config = require("../config/config");

/**
 * Creates a new service.
 *
 * @param {*} reqBody The body with the input. Already validated through middleware.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.createService = function (reqBody, reqFiles, resCallback) {
  console.log(reqBody)
  console.log("i")
  if (!reqFiles || Object.keys(reqFiles).length === 0) {
    console.log("No files were uploaded / added to the request.");
    resCallback(400, "No files were uploaded.");
    return;
  }

  const newService = new Service({
    company: reqBody.company,
    url: reqBody.url,
    email: reqBody.email,
    name: reqBody.name,
    version: reqBody.version,
    description: reqBody.description,
    needsFullAccess: reqBody.needsFullAccess,
    accessReason: reqBody.accessReason,
    usesExternalService: reqBody.usesExternalService,
    externalServiceName: reqBody.externalServiceName,
    externalServiceReason: reqBody.externalServiceReason,
  });

  newService
    .save()
    .then((newService) => {
      // input field containing the file
      const uploadFile = reqFiles.uploadFile;
      
      const fileUploadPath = path.join(
        config.SERVICE_UPLOAD_DIRECTORY,
        `${newService._id}_${uploadFile.name}`
        );
      console.log("got here", fileUploadPath);

      // the created temp file will be moved to the users directory
      uploadFile.mv(fileUploadPath, function (err) {
        if (err) {
          console.log("Error while uploading service code. Removing the associated db entry.");
          Service.deleteOne({ _id: newService._id }, function (err, result) {
            if (err) {
              console.log("could not delete entry:", err);
            } else {
              console.log("deleted entry:", result);
            }
          });
          resCallback(500, err);
          return;
        }

        console.log(`Service uploaded to ${fileUploadPath}!`);
        resCallback(200, `Service uploaded to ${fileUploadPath}!`);
      });
    })
    .catch((err) => {
      console.log(
        "Could not save service in db! Removing the associated db entry.",
        err
      );
      Service.deleteOne({ _id: newService._id }, function(err, result) {
        if(err) {
          console.log("could not delete entry:", err)
        } else {
          console.log("deleted entry:", result)
        }
      });
      resCallback(500, err);
    });
};

/**
 * Gets all available services.
 *
 * @param {*} resCallback The callback.
 */
exports.getServices = function (resCallback) {
  Service.find()
    .then((services) => resCallback(200, services))
    .catch((err) => {
      console.log(err);
      resCallback(404, "No services found!")
    });
};