/**
 * Builds the login response for the client.
 *
 * @param {string} reqUsername The username associated with the request.
 * @param {string} reqCookie The session token that was constructed by Kong.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.loginUser = function (reqUsername, reqCookie, resCallback) {
  if (!reqCookie) {
    console.log("No cookie was set.");
    resCallback(500, "Internal error upon setting cookie // Preflight - waiting for cookie request.");
    return;
  }

  console.log(`User ${reqUsername} logged in. Cookie: ${reqCookie}`);
  var response = {
    username: reqUsername,
    token: reqCookie,
  }
  resCallback(200, response);
};