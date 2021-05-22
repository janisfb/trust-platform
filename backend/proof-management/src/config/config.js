module.exports = {
  //the port the app will be using (NOTE: this is not the port Kong will expose)
  PORT: process.env.PORT || 6003,
  // turn on console logging
  CONSOLE_LOGGING: process.env.CONSOLE_LOGGING || true,
  //link to the mongo db
  DB_LINK:
    process.env.DB_LINK || "mongodb://host.docker.internal:27017/first_db",
};
