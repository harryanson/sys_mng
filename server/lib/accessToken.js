const config = require(ROOT_DIR + "/config"),
 fs = require("fs"),
 jwt = require("jsonwebtoken"),
  redisTe = require(ROOT_DIR + "/db/redisTe"),
  logger = require(ROOT_DIR + "/lib/logger")("accessToken", __filename);
let cert, option, alg = "RS256";// [RS256, RS384, RS512, ES256, ES384, ES512, HS256, HS384, HS512, none]
let prefix = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.";
module.exports = class AccessToken {
  /**
   * 创建token
   * @param json
   * @returns {Promise.<*>}
   */
  static async createToken(json) {
    let accessToken, now = new Date().getTime();
    option = {algorithm: alg};
    if (json.days) {
      option.expiresIn = json.days + "d";
    } else {
      option.noTimestamp = true;
    }
    cert = fs.readFileSync(ROOT_DIR + "/config/login_certs/rsa_private_key.pem");
    accessToken=await new Promise(function (resolve, reject) {
      jwt.sign({logintime: now, userno: json.userno}, cert, option, function (err, val) {
        accessToken = val.substr(prefix.length, val.length);
        resolve(accessToken);
      });
    });
    json.logintime = now, json.accessToken = accessToken;
    let ret=await redisTe.hset({
      db: config.token_redis.redis_db,
      name: config.token_redis.redis_prefix + json.appid,
      key: json.userno,
      value: json
    });
    if(ret.code==0){
      return {code: errs.ok, accessToken: accessToken};
    }else{
      return ret;
    }
  }

  /**
   * 获取token
   * @param json
   * @returns {Promise}
   */
  static async accessToken(json) {
    let ret=await redisTe.hget({
      db: config.token_redis.redis_db,
      name: config.token_redis.redis_prefix + json.appid,
      key: json.userno
    });
    return ret;
  }
  /**
   * token是否存在
   * @param json
   * @returns {Promise}
   */
  static async exists(json) {
    option = {algorithm: alg};
    if (json.appid == "api") {
      option.ignoreExpiration = true;
    }
    cert = fs.readFileSync(ROOT_DIR + "/config/login_certs/rsa_public_key.pem");
    let val =await new Promise(function (resolve, reject) {
      jwt.verify(prefix + json.accessToken, cert, function (err, val) {
        if (err) {
          resolve({code: errs.unauthorized});
        } else {
          resolve(val);
        }
      });
    });
    if (!!val && val.userno) {
      val =await redisTe.hget({
        db: config.token_redis.redis_db,
        name: config.token_redis.redis_prefix + json.appid,
        key: val.userno
      });
      if (val.code == 0) {
        if (!val.data) {
          return {code: errs.accesstoken_expired};
        } else {
          if (val.data.accessToken != json.accessToken) {
            return {code: errs.unauthorized};
          } else {
            return {code: errs.ok, userno: val.data.userno};
          }
        }
      } else {
        return val;
      }
    }else{
      return val;
    }
  }

  /**
   * 删除token
   * @param json
   * @returns {Promise}
   */
  static async removeToken(json) {
    let val = await AccessToken.exists(json),data;
    if (val.code ==0) {
      data = await redisTe.hdel({
        db: config.token_redis.redis_db,
        name: config.token_redis.redis_prefix + json.appid,
        key: val.userno
      });
    }
      return {code:0};
  }
}
