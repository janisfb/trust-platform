const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')
const loggerMiddleware = require('./middleware/loggerMiddleware')
const router = require('./routes/createRouter')()
const { sequelize } = require('./models')

const app = express()
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(cors())

app.use(morgan('combined'))

app.use(loggerMiddleware('hi'))

app.use('/api', router)

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

sequelize.sync()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server started on port ${config.port}`)
    })
  })
