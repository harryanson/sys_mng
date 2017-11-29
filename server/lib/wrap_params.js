const logger = require(ROOT_DIR + "/lib/logger")("wrap_params", __filename);
//合并参数
module.exports = class WrapParams {
  static getReqParams(req) {
    if (req.params && !req.params.uip) {//没解析过
      console.log(req.params, req.query);
      let params = WrapParams.extendJson(req.request.body, req.params, req.query);
      params = JSON.parse(JSON.stringify(params).replace(/'/g, "''"));
      //处理时间，只接受时间戳类型的时间参数
      if (params.before) {
        try {
          params.before = parseInt(params.before);
        } catch (e) {
          logger.warn("invalid params before:%s", params.before, e);
          delete params.before;
        }
      }
      if (params.after) {
        try {
          params.after = parseInt(params.after);
        } catch (e) {
          logger.warn("invalid params after:%s", params.after, e);
          delete params.after;
        }
      }
      params.path = req.path;
      if (req.loginname) {
        params.loginname = req.loginname;
      }
      params.uip = WrapParams.getClientIp(req);
      if (!params.accessToken) {
        params.accessToken = req.headers["x-access-token"];
      }

      if (req.userAgent) {
        params.appid = req.userAgent.appid;
        params.language = req.userAgent.language;
        params.os_name = req.userAgent.os_name;
        params.app_version = req.userAgent.app_version;
      }
      req.params=params;
      logger.info("params:%j", params);
    }
    return req.params;
  }

//合并json
  static extendJson(...args) {
    let ret = {};
    for (let i in args) {
      if (typeof args[i] == "object") {
        for (let k in args[i]) {
          if (!!args[i][k] || args[i][k] == 0 || args[i][k] == "0") {
            ret[k] = args[i][k];
          }
        }
      } else {
        // console.log("args["+ (i-0+1) +"] is not a object argument:",args[i]);
        continue;
      }
    }
    return ret;
  }

//获取客户端IP
  static getClientIp(req) {
    let ipAddress = req.headers["x-forwarded-for"] || req.ip || req.request.ip;
    if (ipAddress.indexOf('::ffff:') > -1) {
      ipAddress = ipAddress.substr('::ffff:'.length, ipAddress.length);
    }
    return ipAddress;
  }
};