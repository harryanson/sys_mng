const logger = require(ROOT_DIR + "/lib/logger")("sys_user", __filename),
  fs = require("fs"),
  config = require(ROOT_DIR + "/config"),
  util = require(ROOT_DIR + "/lib/util"),
  redisTe = require(ROOT_DIR + "/db/redisTe"),
  accessToken = require(ROOT_DIR + "/lib/accessToken"),
  dbcall = require(ROOT_DIR + "/db/pgsql").dbcall,
  treeSource = require(ROOT_DIR + "/config/treeSource"),
  whiteLimit = ["/sys/logout", "/sys/sysuser/editpwd"];
module.exports = class SysUser {
  /**
   * 校验系统用户
   * @param ctx
   * @param next
   * @returns {Promise.<*|{type, alias, describe}|{encode, decode, is, equals, pattern}>}
   */
  static async checkUser(ctx, next) {
    let ret, params = util.wrapParams(ctx);
    if (params.path.indexOf("/sys/login")) {
      if (!params.accessToken) {
        ret = {code: errs.bad_request};//缺少accessToken
      }
      let data = await accessToken.exists({
        appid: config.appid,
        uip: params.uip,
        accessToken: params.accessToken
      });
      if (data.code != 0) {
        await util.respone(ctx, data);
      } else {
        params.userno = data.userno;
      }
      if (whiteLimit.join().indexOf(params.path) == -1) {
        let bool = await SysUser.checkLimit({path: params.path, uip: params.uip, userno: params.userno});
        if (bool) {
          return next();
        } else {
          await util.respone(ctx, {code: errs.unauthorized});
        }
      } else {
        return next();
      }
    } else {
      return next();
    }
  }

  /**
   * 后台登录
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await dbcall("pkg_system.system_user_login",params);
    if (ret.code === 0) {
      ret.data.appid = config.appid;
      ret.data.uip = params.uip;
      ret.data.userno = params.loginname;
      let val = await accessToken.createToken(ret.data);
      if (val.code == 0) {
        ret.data.accessToken = val.accessToken;
        await util.respone(ctx, ret);
      } else {
        await util.respone(ctx, val);
      }
    } else {
      await util.respone(ctx, ret);
    }
  }

  /**
   * 退出 删除app token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async logout(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await accessToken.removeToken({
      appid: config.appid,
      uip: params.uip,
      userno: params.userno,
      accessToken: params.accessToken
    });
    params.type=2;
    params.operator=params.userno;
    params.relatedNo=params.userno;
    params.relatedTable='system_user';
    params.operIp=params.uip;
    ret = await dbcall("pkg_system.log_add",params);
    await util.respone(ctx, ret);
  }

  /**
   * 获取帐号信息
   * @param data
   * @param cb
   * @returns {Promise.<void>}
   */
  static async checkLimit(data) {
    let val = await accessToken.accessToken({appid: config.appid, uip: data.uip, userno: data.userno});
    let limit=treeSource.pathTree[data.path];
    if (val.code==0&&val.data &&val.data.limits&&limit) {
      let ret = val.data.limits.includes(limit.id);
      return ret;
    } else {
      return false;
    }
  }
  /**
   * 系统用户列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async userlist(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await dbcall("pkg_system.system_userlist", params);
    await util.respone(ctx, ret);
  }

  /**
   * 用户增加
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async adduser(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await dbcall("pkg_system.system_user_add_edit", params);
    await util.respone(ctx, ret);
  }

  static async editEnable(ctx) {
    let params = util.wrapParams(ctx);
    let ret =await dbcall("pkg_system.system_user_enable", params);
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
    let ret = await dbcall("pkg_system.system_user_reset_pwd", params);
    await util.respone(ctx, ret);
  }

  /***
   * 删除帐号
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async deluser(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await dbcall("pkg_system.system_user_delete", params);
    await util.respone(ctx, ret);
  }

  /**
   * 编辑密码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async editpwd(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await dbcall("pkg_system.system_user_update_pwd", params);
    await util.respone(ctx, ret);
  }

  /**
   * 校验密码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async checkPwd(ctx) {
    let params = util.wrapParams(ctx);
    let ret = await dbcall("pkg_system.system_user_check_pwd", params);
    await util.respone(ctx, ret);
  }
};