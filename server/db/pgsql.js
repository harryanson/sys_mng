const config = require(ROOT_DIR + "/config"),
  logger = require(ROOT_DIR + "/lib/logger")("pgsql", __filename),
  Pool = require("pg").Pool,
  client = new Pool(config.pgdb);
module.exports = class PGSql {
  /**
   * 处理json 时间为long型
   * @param json
   * @returns {*}
   */
  static changeJson(json) {
    if (Array.isArray(json) && json.length > 0) {
      json.forEach((data, i) => {
        if (typeof data == "object" && !!data) {
          PGSql.changeJson(data);
        }
      });
    } else {
      try {
        Object.keys(json).forEach((key, i) => {
          if (/time$/i.test(key) && json[key] instanceof Date) {
            try {
              json[key] = json[key].getTime();
            } catch (err) {
              logger.warn(`key:${key},value:${json[key]},err:${err}`);
            }
          } else if (typeof json[key] == "object"&&json[key]!=null) {
            PGSql.changeJson(json[key]);
          } else if (/time$/i.test(key) && typeof json[key] == "string") {
            try {
              let tempTime = new Date(Date.parse(json[key]));
              if (tempTime instanceof Date) {
                json[key] = tempTime.getTime();
              }
            } catch (err) {
              logger.warn(`key:${key},value:${json[key]},err:${err}`);
            }
          }
          if (/_/.test(key)) {
            let newkey = key.substr(0, key.indexOf("_")) + key.substr(key.indexOf("_") + 1, 1).toUpperCase() + key.substring(key.indexOf("_") + 2);
            json[newkey] = json[key];
            delete json[key];
          }
        });
      } catch (err) {
        logger.warn(`json:${json},err:${err}`);
      }
    }
    return json;
  }

  /**
   * 调用函数或者增，删，改
   * @param json
   */
  static async dbcall(select,data) {
    let ret;
    if (/^select|^update|^insert|^delete/i.test(select)) {
      ret = await PGSql.query(select,data);
    } else {
      if (data && !/^\(/.test(data)) {
        delete data.accessToken;
        data = "(('" + JSON.stringify(data).replace(/(\')/g, "'||chr(39)||'") + "')::json)";
      } else {
        data = "()";//无参数
      }
      ret = await PGSql.callfun(select,data);
    }
    return ret;
  }

  /**
   * 调用函数
   * @param select
   * @param data
   * @returns {Promise.<*>}
   */
  static async callfun(select,data) {
    let ret, code;
    let sqlString = "select " + select + data;
    logger.trace(`${sqlString}`);

    let rows;
    try{
      rows =await client.query(sqlString);
    }catch(err){
      let dbError = err.stack.substr(6, err.stack.indexOf("\n") - 1);
      logger.error("database error: ", err.stack);
      try {
        dbError = JSON.parse(dbError);
      } catch (e) {
        dbError=null;
      }
      if (dbError) {
        ret = dbError;
      } else {
        ret = {code: errs.internal_server_error};
      }
      return ret;
    }
    if (rows && rows.rows && rows.rows[0]) {
      ret = rows.rows[0][select.substr(select.indexOf(".") + 1)];
      if (!!ret && ret != "null" && typeof  ret == "string") {
        try {
          ret = JSON.parse(ret);
        } catch (e) {
          //打印异常
          logger.error(sqlString, e);
          ret = {code: errs.internal_server_error};
        }
      }
      ret = PGSql.changeJson(ret);
      if (typeof ret == "object" && (ret.code == undefined || ret.code == null)) {
        ret.code = 0;
      }
      return ret;
    }
  }

  static async query(select,data) {
    let ret;
    let rows = await client.query(select, data);
    if (/^select/i.test(select) && rows && rows.rows) {
      let ret = PGSql.changeJson(rows.rows);
      return ret;
    } else if (/^update|^insert|^delete/i.test(select)) {
      logger.info(select, "  ", rows);
      return {code: 0};
    }
  }
};