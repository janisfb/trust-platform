
module.exports = {
  /**
   * Checks if user accessing is the "admin" user.
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  isAccessAuthorized(req, res, next) {
    try {
      const username = req.headers["x-consumer-username"];
      if (username == "admin") {
        next();
      } else {
        console.log(
          "You shall not pass! No access for",
          username
        );
        var noAccessErr = new Error(
          "You don't have access to this ressource."
        );
        noAccessErr.statusCode = 401;
        next(noAccessErr);
      }
    } catch (error) {
      error.statusCode = 403;
      next(error);
    }
  },
};
