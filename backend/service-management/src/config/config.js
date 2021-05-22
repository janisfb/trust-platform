module.exports = {
  //the port the app will be using (NOTE: this is not the port Kong will expose)
  PORT: process.env.PORT || 6001,
  //max upload size for uploads
  FILE_SIZE: process.env.FILE_SIZE || 50 * 1024 * 1024,
  //link to the mongo db
  DB_LINK:
    process.env.DB_LINK || "mongodb://host.docker.internal:27017/first_db",
  //true if service should log to the console
  CONSOLE_LOGGING: process.env.CONSOLE_LOGGING || true,
  //per docker-compose the services-directory is mounted at work/services inside the container
  //  with __dirname as the start directory in work/src/controllers for the controllers
  SERVICE_UPLOAD_DIRECTORY: __dirname + "/../../services/",
  FILE_UPLOAD_DIRECTORY: __dirname + "/../../files/",
};
