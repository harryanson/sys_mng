/**
 * Created by Harry on 2017/8/17.
 */
const logger = require(ROOT_DIR + "/lib/logger")("errcode", __filename),
  fs = require("fs"),
  redisTe=require(ROOT_DIR + "/db/redisTe"),
  util = require(ROOT_DIR + "/lib/util"),
  dbcall = require(ROOT_DIR + "/db/pgsql").dbcall;
module.exports = class ErrCode {
  /**
   * 创建错误码文件
   * @returns {Promise.<void>}
   */
  static async create_erreode_file() {
    let errItems = await dbcall("select * from leisuregame_errcode t order by t.code asc", []);
    let ErrCodetIems = [];
    let errStr = "module.exports = {\r\n";
    for (let j = 0; j < errItems.length; j++) {
      errStr += "      " + errItems[j].name + ":" + errItems[j].code + ",//" + errItems[j]["message"] + "\r\n";
      ErrCodetIems.push(errItems[j].code);
    }
    for (let i = 0; i < errItems.length; i++) {
      if (ErrCodetIems.indexOf(errItems[i].code) == -1) {
        errStr += "      " + errItems[i].name + ":" + errItems[i].code + ",//" + errItems[i]["message"] + "\r\n";
      }
    }
    errStr = errStr.substring(0, errStr.lastIndexOf(",")) + errStr.substring(errStr.lastIndexOf(",") + 1);
    errStr += "}";
    fs.writeFile(ROOT_DIR + "/config/errs.js", errStr, function (err) {
      if (err) {
        logger.error(err);
      }
    });
    let msgObj = {}, errcodeStr = 'module.exports = {\r\n';
    errStr = 'module.exports = {\r\n';
    //根据code获取对象
    for (let j = 0; j < errItems.length; j++) {
      msgObj = {};
      if (errItems[j]["name"]) {
        msgObj.name = errItems[j]["name"];
      }
      if (errItems[j]["message"]) {
        msgObj["message"] = errItems[j]["message"];
      }
      if (errItems[j]["statusCode"]) {
        msgObj["status"] = parseInt(errItems[j]["statusCode"], 10);
      }
      errcodeStr += "      " + errItems[j].code + ":" + JSON.stringify(msgObj) + ",\r\n";
    }
    errcodeStr = errcodeStr.substring(0, errcodeStr.lastIndexOf(',')) + errcodeStr.substring(errcodeStr.lastIndexOf(',') + 1);
    errcodeStr += '}';
    fs.writeFile(ROOT_DIR + "/config/errCode.js", errcodeStr,function (err) {
      if (err) {
        logger.error(err);
      }
    });
  }

  /**
   * 获取错误码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async errs(ctx,next) {
    let params=util.wrapParams(ctx);
    console.log('-------------')
    let ret = require(ROOT_DIR + "/config/errs");
    ctx.body = ret;
  }
};
