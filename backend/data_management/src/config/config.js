module.exports = {
  //the port the app will be using
  PORT: process.env.PORT || 6000,
  //max upload size for user uploads
  FILE_SIZE: 50 * 1024 * 1024,
  //per docker-compose the files-directory is mounted at work/files inside the container
  //  with __dirname as the start directory in work/src/controllers for the controllers
  UPLOAD_DIRECTORY: __dirname + "/../../files/",
};
