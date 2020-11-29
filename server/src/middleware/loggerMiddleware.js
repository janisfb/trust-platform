const fs = require('fs')

module.exports = function loggerMiddleware (msg) {
  return function (req, res, next) {
    const currentDatetime = new Date()
    const formattedDate =
      currentDatetime.getFullYear() +
      '-' +
      (currentDatetime.getMonth() + 1) +
      '-' +
      currentDatetime.getDate() +
      ' ' +
      currentDatetime.getHours() +
      ':' +
      currentDatetime.getMinutes() +
      ':' +
      currentDatetime.getSeconds()
    const method = req.method
    const url = req.url
    const ip = req.ip
    const status = res.statusCode
    const email = req.body.email
    const log = `${formattedDate} ${method} ${url} ${status} - ${ip} - ${msg}`
    const path = `./logs/${email}.log`
    console.log(path)
    fs.appendFile(path, log + '\n', err => {
      if (err) {
        console.log(err)
      }
    })
    next()
  }
}
