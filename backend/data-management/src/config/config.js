module.exports = {
  //the port the app will be using (NOTE: this is not the port Kong will expose)
  PORT: process.env.PORT || 6000,
  //max upload size for user uploads
  FILE_SIZE: process.env.FILE_SIZE || 50 * 1024 * 1024,
  // turn on console logging
  CONSOLE_LOGGING: process.env.CONSOLE_LOGGING || true,
  //per docker-compose the files-directory is mounted at work/files inside the container
  //  with __dirname as the start directory in work/src/controllers for the controllers
  UPLOAD_DIRECTORY: __dirname + "/../../files/",
};
