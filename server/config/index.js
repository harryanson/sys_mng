const config = {
  appid: "sys_mng",
  host:"0.0.0.0",
  port: process.env.PORT || 3300,
  redis: {
    "port": 8812,
    "host": "182.92.200.252",
    "auth": false,
    "password": "",
    db: 2
  },
  pgdb:{
    user: "postgres", //env var: PGUSER
    database: "leisuregame", //env var: PGDATABASE
    password: "q1w2e3r4", //env var: PGPASSWORD
    host: "182.92.200.252", // Server hosting the postgres database
    port: 9912, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  },
  reset_pwd:123123,
  token_redis: {redis_db: 2, redis_prefix: "accessToken:"}
};

module.exports = config;