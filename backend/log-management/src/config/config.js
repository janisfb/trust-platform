module.exports = {
  //the port the app will be using (NOTE: this is not the port Kong will expose)
  PORT: process.env.PORT || 6002,
  // turn on console logging
  CONSOLE_LOGGING: process.env.CONSOLE_LOGGING || true,
};
