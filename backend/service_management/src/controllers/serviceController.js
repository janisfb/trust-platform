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
  if (!reqFiles || Object.keys(reqFiles).length === 0) {
    console.log("No files were uploaded / added to the request.");
    resCallback(400, "No files were uploaded.");
    return;
  }

  const newService = new Service({
    company: reqBody.contact.company,
    url: reqBody.contact.url,
    email: reqBody.contact.email,
    tel: reqBody.contact.tel,
    name: reqBody.serviceMeta.name,
    version: reqBody.serviceMeta.version,
    description: reqBody.serviceMeta.description,
    needsFullAccess: reqBody.sovereignty.needsFullAccess,
    accessReason: reqBody.sovereignty.accessReason,
    usesExternalService: reqBody.sovereignty.usesExternalService,
    externalServiceName: reqBody.sovereignty.externalServiceName,
    externalServiceReason: reqBody.sovereignty.externalServiceReason,
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

        if (config.CONSOLE_LOGGING)
          console.log(`Service uploaded to ${fileUploadPath}!`);
        resCallback(200, `Service uploaded!`);
      });
    })
    .catch((err) => {
      console.log(
        "Could not save service in db! Removing the associated db entry.",
        err
      );
      Service.deleteOne({ _id: newService._id }, function(err, result) {
        if(err) {
          console.log("could not delete entry:", err);
        } else {
          console.log("deleted entry:", result);
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
    .then((services) => {
      var response = [];

      //get information about all available files
      for (let service of services) {
        response.push({
          id: service._id,
          contact: {
            company: service.company,
            url: service.url,
            email: service.email,
            tel: service.tel,
          },
          serviceMeta: {
            name: service.name,
            version: service.version,
            description: service.description,
          },
          sovereignty: {
            needsFullAccess: service.needsFullAccess,
            accessReason: service.accessReason,
            usesExternalService: service.usesExternalService,
            externalService: {
              name: service.externalServiceName,
              reason: service.externalServiceReason,
            }
          }
        });
      }
      resCallback(200, response);
    })
    .catch((err) => {
      console.log(err);
      resCallback(404, "No services found!");
    });
};