/**
 * Created by Harry on 2017/8/25.
 */
const logger = require(ROOT_DIR + "/lib/logger")("agent", __filename),
    config = require(ROOT_DIR + "/config"),
    util = require(ROOT_DIR + "/lib/util"),
    redisTe = require(ROOT_DIR + "/db/redisTe"),
    accessToken = require(ROOT_DIR + "/lib/accessToken"),
    dbcall = require(ROOT_DIR + "/db/pgsql").dbcall;
module.exports = class Agent {
    /**
     * 查询
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async findAgent(ctx) {
        let params = util.wrapParams(ctx);
        let ret=await dbcall("pkg_agent.agent_list",params);
        await util.respone(ctx, ret);
    }
    /**
     * 用户增加
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async adduser(ctx) {
        let params = util.wrapParams(ctx);
        let ret = await dbcall("pkg_agent.agent_add_edit", params);
        await util.respone(ctx, ret);
    }

    static async editEnable(ctx) {
        let params = util.wrapParams(ctx);
        let ret =await dbcall("pkg_agent.enable", params);
        await util.respone(ctx, ret);
    }
    /**
     * 编辑密码
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async editpwd(ctx) {
        let params = util.wrapParams(ctx);
        let ret = await dbcall("pkg_agent.agent_update_pwd", params);
        await util.respone(ctx, ret);
    }

    /**
     * 校验密码
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async checkPwd(ctx) {
        let params = util.wrapParams(ctx);
        let ret = await dbcall("pkg_agent.agent_check_pwd", params);
        await util.respone(ctx, ret);
    }
  /**
   * 重置密码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async resetPwd(ctx) {
    let params = util.wrapParams(ctx);
    params.newpwd = config.reset_pwd;
    let ret = await dbcall("pkg_agent.agent_reset_pwd", params);
    await util.respone(ctx, ret);
  }
}