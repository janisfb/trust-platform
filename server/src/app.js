const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')
const loggerMiddleware = require('./middleware/loggerMiddleware')

const app = express()
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(cors())

app.use(loggerMiddleware('hi'))

app.use(morgan('combined'))

require('./routes')(app)

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`)
})
