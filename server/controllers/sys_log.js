/**
 * Created by Harry on 2017/8/25.
 */
const logger = require(ROOT_DIR + "/lib/logger")("sys_log", __filename),
  config = require(ROOT_DIR + "/config"),
  util = require(ROOT_DIR + "/lib/util"),
  dbcall = require(ROOT_DIR + "/db/pgsql").dbcall;
module.exports = class SysLog {
  /**
   * 查询
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async findLog(ctx) {
    let params = util.wrapParams(ctx);
    let ret=await dbcall("pkg_system.system_logs",params);
    await util.respone(ctx, ret);
  }
}