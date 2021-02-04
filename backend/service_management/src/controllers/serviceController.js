const Service = require("../models/Service");

/**
 * Creates a new service.
 *
 * @param {*} reqBody The body with the input. Already validated through middleware.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.createService = function (reqBody, resCallback) {
  console.log(reqBody)
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
    .then(resCallback(200, newService))
    .catch((err) => {
      console.log("Could not save service in db!", err);
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