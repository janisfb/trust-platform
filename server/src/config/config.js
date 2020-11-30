module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'trustPlatform',
    user: process.env.DB_USER || 'trustPlatform',
    password: process.env.DB_PASS || 'trustPlatform',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: './trustPlatform.sqlite'
    }
  }
}
