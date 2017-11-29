let config = require(ROOT_DIR + "/config");
let logger = require(ROOT_DIR + "/lib/logger")("redisTe", __filename);
let pool = require(ROOT_DIR + "/db/redis_dbpool"),
  client;
module.exports = class RedisTe {
  static async select(json) {
    if (!json.db) {
      return {code: errs.bad_request};
    }
    if (json.appid && !json.key) {
      json.key = json.appid + ":" + json.key;//如果参数里带有appid，则将appid封装到name键里面去
    }
    if (json.appid && json.name) {
      json.name = json.appid + ":" + json.name;//如果参数里带有appid，则将appid封装到key键里面去
    }
    if (json.value && typeof json.value == "object") {
      json.value = JSON.stringify(json.value);
    }
    try {
      if (!client) {
        client = await pool.client();
      }
      await client.select(json.db || config.redis.db);
      return client;
    } catch (err) {
      logger.error("get redis client error!", err);
      throw Error({code: errs.internal_server_error});
    }
  }

  /**
   * 设置值
   * @param json {db:2,key:'1',value:'12345',timeout:1000} timeout可选
   * @returns {Promise.<void>}
   */
  static async set(json) {
    if (!json.key || !json.value) {
      return {code: errs.bad_request};
    }
    if (!json.timeout) {
      try {
        const client = await RedisTe.select(json);
        return new Promise(function (resolve, reject) {
          client.set(json.key,json.value, (err, val) => {
            pool.release(client);
            if (err) {
              logger.error("set redis error!", err);
              resolve({code: errs.internal_server_error});
            } else {
              resolve({code: 0});
            }
          });
        });
      } catch (err) {
        logger.error("set redis error!", err);
        return {code: errs.internal_server_error};
      }
    } else {
      try {
        const client = await RedisTe.select(json);
        let args = [json.key, json.timeout, json.value];
        return new Promise(function (resolve, reject) {
          client.send_command(args, (err, val) => {
            pool.release(client);
            if (err) {
              logger.error("set redis error!", err);
              resolve({code: errs.internal_server_error});
            } else {
              resolve({code: 0});
            }
          });
        });
      } catch (err) {
        logger.error("set redis error!", err);
        return {code: errs.internal_server_error};
      }
    }
  }

  /**
   * 获取值
   * @param json
   * @returns {Promise.<void>}
   */
  static async get(json) {
    if (!json.key) {
      return {code: errs.bad_request};
    }
    try {
      let client = await RedisTe.select(json);
      return new Promise(function (resolve, reject) {
        client.get(json.key, (err, val) => {
          pool.release(client);
          if (err) {
            logger.error("get redis error!", err);
            resolve({code: errs.internal_server_error});
          } else {
            try {
              val = JSON.parse(val);
            } catch (err) {
              logger.warn(`val:${val},err:${err}`);
            }
            resolve({code: 0, data: val});
          }
        });
      });
    } catch (err) {
      logger.error("get redis error!", err);
      return {code: errs.internal_server_error};
    }
  }

  /**
   * 删除
   * @param json
   * @returns {Promise.<{code: number}>}
   */
  static async del(json) {
    let val;
    if (!json.key) {
      return {code: errs.bad_request};
    }
    try {
      const client = await RedisTe.select(json);
      return new Promise(function (resolve, reject) {
        client.del(json.key, (err, val) => {
          pool.release(client);
          if (err) {
            logger.error("del redis error!", err);
            resolve({code: errs.internal_server_error});
          } else {
            if(val>0){
              resolve({code: 0});
            }else{
              resolve({code: errs.data_not_exist});
            }
          }
        });
      });
    } catch (err) {
      logger.error("del redis error!", err);
      return {code: errs.internal_server_error};
    }
  }

  static async hset(json) {
    if (!json.key) {
      return {code: errs.bad_request};
    }
    try {
      let client = await RedisTe.select(json);
      return new Promise(function (resolve, reject) {
        client.hset(json.name, json.key,json.value, (err, val) => {
          pool.release(client);
          if (err) {
            logger.error("hset redis error!", err);
            resolve({code: errs.internal_server_error});
          } else {
            try {
              val = JSON.parse(val);
            } catch (err) {
              logger.warn(`val:${val},err:${err}`);
            }
            resolve({code: 0,data:val});
          }
        });
      });
    } catch (err) {
      logger.error("hset redis error!", err);
      return {code: errs.internal_server_error};
    }
  }

  static async hget(json) {
    if (!json.key) {
      return {code: errs.bad_request};
    }
    try {
      let client = await RedisTe.select(json);
      return new Promise(function (resolve, reject) {
        client.hget(json.name, json.key, (err, val) => {
          pool.release(client);
          if (err) {
            logger.error("hget redis error!", err);
            resolve({code: errs.internal_server_error});
          } else {
            try {
              val = JSON.parse(val);
            } catch (err) {
              logger.warn(`val:${val},err:${err}`);
            }
            resolve({code: 0,data:val});
          }
        });
      });
    } catch (err) {
      logger.error("hget redis error!", err);
      return {code: errs.internal_server_error};
    }
  }

  static async hdel(json) {
    if (!json.key) {
      return {code: errs.bad_request};
    }
    try {
      let client = await RedisTe.select(json);
      return new Promise(function (resolve, reject) {
        client.hdel(json.name, json.key, (err, val) => {
          pool.release(client);
          if (err) {
            logger.error("hdel redis error!", err);
            resolve({code: errs.internal_server_error});
          } else {
            resolve({code: 0});
          }
        });
      });
    } catch (err) {
      logger.error("hdel redis error!", err);
      return {code: errs.internal_server_error};
    }
  }
};