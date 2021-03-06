const config = {
  development: {
    username: "root",
    password: null,
    database: "prodaja_karata_dev",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Europe/Amsterdam"
  },
  test: {
    username: "root",
    password: null,
    database: "prodaja_karata_test",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Europe/Amsterdam"
  },
  production: {
    username: "root",
    password: null,
    database: "prodaja_karata_prod",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Europe/Amsterdam"
  }
}
export default config;
