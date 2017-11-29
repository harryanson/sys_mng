/**
 * Created by Harry on 2017/7/28.
 */
const logger = require(ROOT_DIR + "/lib/logger")("util", __filename),
  WarpParams = require(ROOT_DIR + "/lib/wrap_params"),
  fs = require("fs"),
  path = require('path'),
config = require(ROOT_DIR + "/config");
module.exports = class Util {
  static wrapParams(req) {
    return WarpParams.getReqParams(req);
  }

  static generateUUID() {
    function _p8(s) {
      let p = (Math.random().toString(16) + "000000000").substr(2, 8);
      return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }

    return _p8() + _p8(true) + _p8(true) + _p8();
  }

  static timeout(s) {
    return new Promise((resolve) => {
      setTimeout(resolve, s * 1000);
    });
  }

  /**
   * 返回数据处理
   * @param ctx
   * @param json
   */
  static async respone(ctx, json) {
    ctx.status = json.code == 0 ? 200 : parseInt(json.code / 1000);
    ctx.body = json;
  }

  /**
   * 获取目录所有文件
   * @param dir
   */
  static walkSync(dir) {
    return fs.readdirSync(dir)
      .reduce((files, file) =>
          fs.statSync(path.join(dir, file)).isDirectory() ?
            files.concat(Util.walkSync(path.join(dir, file))) :
            files.concat(path.join(dir, file)),
        []);
  }
}