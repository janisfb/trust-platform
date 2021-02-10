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
  if (reqServiceId == "undefined" || reqFileId == "undefined") {
    console.log(`Wrong params. ${reqServiceId}, ${reqFileId}`);
    resCallback(400, "Wrong params.");
    return;
  }

  if (config.CONSOLE_LOGGING)
    console.log("Starting service", reqServiceId, reqFileId);

  const servicePath = getService(reqServiceId, resCallback);
  const fileObj = getFile(reqFileId, resCallback);

  const service = require(servicePath);

  try {
    const serviceCallback = (status, result) => {
      resCallback(status, result);
    };
    service.execute(fileObj, serviceCallback);
  } catch (err) {
    console.log(
      `Something went wrong while trying to execute the service with id ${reqServiceId}`,
      err
      );
    resCallback(500, "Something went wrong.");
  }
};

/**
 * Returns the service path (if found on disc) associated to a given id.
 * There is no access restriction on services in this prototype.
 * 
 * @param {*} serviceId The serviceId for which the path should be returned.
 * @param {*} resCallback The callback for the Router containing the status and message.
 * @returns {string} serviceUploadPath - returns the path of the service.
 */
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

/**
 * Returns the file (if found on disc) associated to a given id.
 * The enforcement of access restrictions has already been done by middleware 
 * at this step. 
 * 
 * @param {string} fileId The id of the file that should get attached.
 * @param {*} resCallback The callback for the Router containing the status and message.
 * @returns {*} An obj containing the file buffer and the filename.
 */
const getFile = (fileId, resCallback) => {
  let fileUploadPath;

  var files = glob.sync(`${config.FILE_UPLOAD_DIRECTORY}/*-${fileId}-*`);
  fileUploadPath = files[0];

  // These checks are already performed by the accessPolicyMiddleware and 
  // would therefore be redundant
  // ----------------------------------------------------------------
  // if (files.length > 0) {
  //   fileUploadPath = files[0];
  // }

  // if (files.length > 1 || !fs.existsSync(fileUploadPath)) {
  //   console.log(`No distinctive file found for ${fileId}.`);
  //   resCallback(404, `No file found for ${fileId}.`);
  //   return;
  // }

  console.log("formatting ...")
  var filename = fileUploadPath.replace(/^.*[\\\/]/, "");
  var filebuffer = fs.readFileSync(fileUploadPath);
  console.log("collected ", filename);
  return {filebuffer: filebuffer, filename: filename};
}