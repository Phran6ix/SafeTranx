export default () => ({
  port: parseInt(process.env.PORT) || 4000,
  database: {
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASS,
    user: process.env.POSTGRES_USER,
    databse: process.env.POSTGRES_DB,
    QUEUE_HOST: process.env.QUEUE_HOST,
    QUEUE_PORT: process.env.QUEUE_PORT
  }

})
