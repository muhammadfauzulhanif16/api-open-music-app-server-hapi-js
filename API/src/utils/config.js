require('dotenv').config()

exports.config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  db: {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    name: process.env.PGDATABASE
  },
  rabbitmq: {
    host: process.env.RABBITMQ_SERVER
  },
  redis: {
    host: process.env.REDIS_SERVER
  },
  auth: {
    access: {
      key: process.env.ACCESS_TOKEN_KEY,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    refresh: {
      key: process.env.REFRESH_TOKEN_KEY
    }
  }
}
