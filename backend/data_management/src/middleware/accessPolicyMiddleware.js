
module.exports = {
  isAccessAuthorized(req, res, next) {
    try {
      const username = req.headers["x-consumer-username"];
      if (username == "admin" || req.params.id.split("-")[0] == username) {
        next();
      } else {
        console.log("You shall not pass! No access for: ", req.params.id.split("-")[0], username);
        throw new Error("You don't have access to this ressource.");
      }
    } catch (error) {
      error.statusCode = 403;
      throw error;
    }
  },
};
