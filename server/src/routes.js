const AuthenticationController = require('./controllers/authenticationController')

module.exports = (app) => {
  app.post('/register',
    AuthenticationController.register)
}
