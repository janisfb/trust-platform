var path = require("path");
var fs = require("fs");
var uniqid = require("uniqid");
const glob = require("glob");

var config = require("../config/config");

/**
 * Uploads a single file to the upload directory defined in the config.
 *
 * the format of the files name on the server is:
 * <creatorUsername>-<uniqueId>-<unixCreationTime>-<fileName>
 *
 * @param {*} reqFiles The files, that are uploaded.
 * @param {string} reqUsername The username associated with the request.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.uploadFile = function (reqFiles, reqUsername, resCallback) {
  if (!reqFiles || Object.keys(reqFiles).length === 0) {
    console.log("No files were uploaded / added to the request.");
    resCallback(400, "No files were uploaded.");
    return;
  }

  // input field containing the file
  const uploadFile = reqFiles.uploadFile;
  const uploadFileName = uniqid(`${reqUsername}-`,`-${new Date().getTime() / 1000}-${uploadFile.name}`);

  const fileUploadPath = path.join(
    config.UPLOAD_DIRECTORY,
    uploadFileName
  );

  // the created temp file will be moved to the users directory
  uploadFile.mv(fileUploadPath, function (err) {
    if (err) {
      console.log("Error while uploading file.");
      resCallback(500, err);
      return;
    }

    if (config.CONSOLE_LOGGING)
      console.log(`File uploaded to ${fileUploadPath}!`);

    var fileInfo = getFileInfo(uploadFileName);

    var response = {
      message: `File uploaded!`,
      file: fileInfo,
    };
    resCallback(200, response);
  });
};

/**
 * Updates the given file with the new file.
 * 
 * @param {string} reqFileId The id of the file that should be updated.
 * @param {*} reqFiles The file it should be updated with.
 * @param {*} resCallback The callback.
 */
exports.updateFile = function (reqFileId, reqFiles, resCallback) {
  if (!reqFiles || Object.keys(reqFiles).length === 0) {
    console.log("No files were uploaded / added to the request.");
    resCallback(400, "No files were uploaded.");
    return;
  }

  var fileUploadPath = glob.sync(`${config.UPLOAD_DIRECTORY}/*-${reqFileId}-*`)[0];

  if (config.CONSOLE_LOGGING) console.log("file can be replaced", fileUploadPath);

  // These checks are already performed by the accessPolicyMiddleware and
  // would therefore be redundant
  // ----------------------------------------------------------------
  // if (files.length > 0) {
  //   fileUploadPath = files[0];
  // }

  // if (files.length > 1 || !fs.existsSync(fileUploadPath)) {
  //   console.log(`No distinctive file found for ${reqFileId}.`);
  //   resCallback(404, `No file found for ${reqFileId}.`);
  //   return;
  // }

  // input field containing the file
  const uploadFile = reqFiles.uploadFile;

  if (!fs.existsSync(fileUploadPath)) {
    resCallback(404, `No file found for id ${reqFileId}.`);
    return;
  }

  // the created temp file will be moved to the users directory
  uploadFile.mv(fileUploadPath, function (err) {
    if (err) {
      console.log("Error while updating file.");
      resCallback(500, err);
      return;
    }

    if (config.CONSOLE_LOGGING)
      console.log(`File at ${fileUploadPath} updated!`);
    
    var fileInfo = getFileInfo(fileUploadPath.replace(/^.*[\\\/]/, ""));

    var response = {
      message: `File ${reqFileId} updated!`,
      file: fileInfo,
    };
    resCallback(200, response);
  });
};

/**
 * Deletes the given file.
 * 
 * @param {*} reqFileId The id of the file that should be deleted.
 * @param {*} resCallback The callback containing the result of the operation.
 */
exports.deleteFile = function (reqFileId, resCallback) {
  var files = glob.sync(`${config.UPLOAD_DIRECTORY}/*-${reqFileId}-*`);

  // These checks are already performed by the accessPolicyMiddleware and
  // would therefore be redundant
  // ----------------------------------------------------------------
  // if (files.length > 0) {
  //   fileUploadPath = files[0];
  // }

  // if (files.length > 1 || !fs.existsSync(fileUploadPath)) {
  //   console.log(`No distinctive file found for ${reqFileId}.`);
  //   resCallback(404, `No file found for ${reqFileId}.`);
  //   return;
  // }

  let fileUploadPath = files[0];

  if (!fs.existsSync(fileUploadPath)) {
    resCallback(404, `No file found for id ${reqFileId}.`);
    return;
  }

  try {
    var fileInfo = getFileInfo(fileUploadPath.replace(/^.*[\\\/]/, ""));

    var response = {
      message: `File at ${reqFileId} was deleted!`,
      file: fileInfo,
    };

    console.log(response);

    fs.unlinkSync(fileUploadPath);

    if (config.CONSOLE_LOGGING)
      console.log(`File at ${fileUploadPath} deleted!`);

    resCallback(200, response);
    return;
  } catch (error) {
    resCallback(500, error);
  }
}

/**
 * Gets all the files that the user is allowed to perform operations on.
 *
 * @param {string} reqUsername The username that is associated with the request.
 * @param {boolean} allFiles Return all files including files not owned by the user (only admin)
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.getUserFiles = function (reqUsername, allFiles, resCallback) {
  const files = fs.readdirSync(config.UPLOAD_DIRECTORY);

  var response = [];

  //get information about all available files
  for (let file of files) {
    if ((allFiles && reqUsername == "admin") || path.basename(file).split("-")[0] == reqUsername) {
      response.push(getFileInfo(file));
    }
  }

  
  if (config.CONSOLE_LOGGING) console.log(`got ${response.length} file(s) \n`, response);
  resCallback(200, response);
};

/**
 * Gets the stats to a single file.
 * The stats are: id, fileName, creator, fileSizeInBytes, creationTime, lastAccessTime, lastModifiedTime
 *
 * @param {string} file The file.
 * @returns An objects with the files stats.
 */
const getFileInfo = (file) => {
  const filePath = path.join(config.UPLOAD_DIRECTORY, file);
  var fileStats = fs.statSync(filePath);
  const splittedName = file.split("-");

  const id = splittedName[1];
  const fileName = splittedName[3];
  const creator = splittedName[0];
  const fileSizeInBytes = fileStats.size;

  var dateObj = new Date(splittedName[2] * 1000);
  var utcString = dateObj.toISOString();
  const creationTime = utcString;

  const lastAccessTime = fileStats.atime;
  const lastModifiedTime = fileStats.mtime;

  return {
    id: id,
    fileName: fileName,
    creator: creator,
    fileSizeInBytes: fileSizeInBytes,
    creationTime: creationTime,
    lastAccessTime: lastAccessTime,
    lastModifiedTime: lastModifiedTime,
  };
};
