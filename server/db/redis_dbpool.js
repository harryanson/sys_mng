const redis = require("redis"),
  poolModule = require("generic-pool"),
  config = require(ROOT_DIR + "/config").redis,
  logger = require(ROOT_DIR + "/lib/logger")("redisPool"),
  pool = poolModule.createPool({
      name: "redis",
      create: function () {
        return new Promise((resolve, reject) =>{
          let client = redis.createClient(config.port, config.host, {no_ready_check: true});
          client.on("error", function (err) {
            logger.error("Redis Error " + err);
          });
          client.on("connect", function () {
            client.select(config.db, function (err) {
              if (err) {
                logger.error(err);
              }
              resolve(client);
            });
          });
        });
      },
      destroy: function (client) {
        logger.warn("Redis client quit!");
        client.quit();
      }
    }, {
      max: 3,
      min: 1,
      idleTimeoutMillis: 1 * 60 * 60 * 1000,
      log: false
    });
exports.client =async() => {
  return pool.acquire().then(client=>{return client;}).catch(function (err) {
    logger.error(err);
      return {code: errs.internal_server_error};
  });
};

exports.release =(client) => {
  if (!pool) {
    pool.release(client);
  }
};
