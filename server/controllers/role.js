/**
 * Created by Harry on 2017/8/23.
 */
const logger = require(ROOT_DIR + "/lib/logger")("api", __filename),
  config = require(ROOT_DIR + "/config"),
  util = require(ROOT_DIR + "/lib/util"),
  dbcall = require(ROOT_DIR + "/db/pgsql").dbcall;
module.exports = class Role {
  /**
   * 禁用启用
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async editEnable(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await dbcall("pkg_system.system_role_enable", params);
    await util.respone(ctx, ret);
  }
  /**
   * 查询
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async findRole(ctx) {
    let params = util.wrapParams(ctx);
    let data = await dbcall("select * from system_role order by roleid", []);
    await util.respone(ctx, {code:0,data:data});
  }

  /**
   * 所有角色
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async allRole(ctx) {
    let params = util.wrapParams(ctx);
    let data = await dbcall('select roleid,rolename from system_role t' +
      ' where enable=1 order by t.createtime desc', []);
    await util.respone(ctx, {code:0,data:data});
  }
  /**
   * 添加或者编辑
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async addOrEditRole(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await dbcall("pkg_system.system_role_add_edit", params);
    await util.respone(ctx, ret);
  }
};