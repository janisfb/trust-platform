var fs = require("fs");
const glob = require("glob");

const config = require("../config/config");

/**
 * Executes a service.
 *
 * @param {String} reqServiceId The body with the input. Already validated through middleware.
 * @param {String} reqFileId The id of the file that the service should be executed with.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.executeService = function (reqServiceId, reqFileId, resCallback) {
  console.log("Starting service", reqServiceId, reqFileId);

  const servicePath = getService(reqServiceId, resCallback);
  const file = getFile(reqFileId, resCallback);

  const service = require(servicePath);

  try {
    const serviceCallback = (status, result) => {
      resCallback(status, result);
    };
    service.execute(file, serviceCallback);
  } catch (err) {
    console.log(
      `Something went wrong while trying to execute the service with id ${reqServiceId}`,
      err
      );
    resCallback(500, "Something went wrong.");
  }
};

const getService = (serviceId, resCallback) => {
  let serviceUploadPath;

  var files = glob.sync(`${config.SERVICE_UPLOAD_DIRECTORY}/${serviceId}_*`);

  if (files.length > 0) {
    serviceUploadPath = files[0];
  }

  if (files.length > 1 || !fs.existsSync(serviceUploadPath)) {
    console.log(`No distinctive service found for ${serviceId}.`);
    resCallback(404, `No service found for ${serviceId}.`);
    return;
  }

  return serviceUploadPath;
}

const getFile = (fileId, resCallback) => {
  let fileUploadPath;

  var files = glob.sync(`${config.FILE_UPLOAD_DIRECTORY}/*-${fileId}-*`);

  if (files.length > 0) {
    fileUploadPath = files[0];
  }

  if (files.length > 1 || !fs.existsSync(fileUploadPath)) {
    console.log(`No distinctive file found for ${fileId}.`);
    resCallback(404, `No file found for ${fileId}.`);
    return;
  }

  return fs.readFileSync(fileUploadPath);
}