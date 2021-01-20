var path = require("path");
var fs = require("fs");
var uniqid = require("uniqid");

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

  const fileUploadPath = path.join(
    config.UPLOAD_DIRECTORY,
    uniqid(`${reqUsername}-`,`-${new Date().getTime() / 1000}-${uploadFile.name}`)
  );

  // the created temp file will be moved to the users directory
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

  const fileUploadPath = path.join(config.UPLOAD_DIRECTORY, reqFileId);

  if (!fs.existsSync(fileUploadPath)) {
    console.log(`No file found for ${reqFileId}.`);
    resCallback(404, `No file found for ${reqFileId}.`);
    return;
  }

  // input field containing the file
  const uploadFile = reqFiles.uploadFile;

  // the created temp file will be moved to the users directory
  uploadFile.mv(fileUploadPath, function (err) {
    if (err) {
      console.log("Error while updating file.");
      resCallback(500, err);
      return;
    }

    console.log(`File at ${fileUploadPath} updated!`);
    resCallback(200, `File ${reqFileId} updated!`);
  });
};

/**
 * Deletes the given file.
 * 
 * @param {*} reqFileId The id of the file that should be deleted.
 * @param {*} resCallback The callback containing the result of the operation.
 */
exports.deleteFile = function (reqFileId, resCallback) {
  const fileUploadPath = path.join(config.UPLOAD_DIRECTORY, reqFileId);

  if (!fs.existsSync(fileUploadPath)) {
    console.log(`No file found for ${reqFileId}.`);
    resCallback(404, `No file found for ${reqFileId}.`);
    return;
  }

  try {
    fs.unlinkSync(fileUploadPath);
    console.log(`File at ${fileUploadPath} deleted!`);
    resCallback(200, `File ${reqFileId} was deleted!`);
    return;
  } catch (error) {
    resCallback(500, err);
  }
}

/**
 * Gets all the files that the user is allowed to perform operations on.
 *
 * @param {string} reqUsername The username that is associated with the request.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.getUserFiles = function (reqUsername, resCallback) {
  const files = fs.readdirSync(config.UPLOAD_DIRECTORY);

  console.log(`got ${files.length} files`);

  var response = [];

  //get information about all available files
  for (let file of files) {
    if (reqUsername == "admin" || path.basename(file).split("-")[0] == reqUsername) {
      response.push(getFileInfo(file));
    }
  }

  console.log(response);
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

  const id = file;
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
