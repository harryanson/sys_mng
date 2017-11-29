/**
 * 管理员用户子路由
 */
let ctrls={};
const router = require("koa-router")(),
  util = require(ROOT_DIR + "/lib/util"),
  fs = require("fs"),
  path = require('path'),
  dir=ROOT_DIR + '/controllers',
  tempRroutes =util.walkSync(dir).forEach(file=>{let ctrl=require(file);ctrls[ctrl.name]=ctrl;});
const routers = router.post("/login", ctrls.SysUser.login)//后台登录
  .post("/logout", ctrls.SysUser.logout)//退出后台
  .get("/sysuser/userlist", ctrls.SysUser.userlist)//系统管理员列表
  .post("/sysuser/add", ctrls.SysUser.adduser)//添加系统管理员
  .post("/sysuser/edit", ctrls.SysUser.adduser)//修改系统管理员
  .post("/sysuser/enable", ctrls.SysUser.editEnable)//启用/禁用系统管理员
  .post("/sysuser/resetpwd", ctrls.SysUser.resetPwd)//重置系统管理员密码
  .post("/sysuser/deluser", ctrls.SysUser.deluser)//删除系统管理员
  .post("/sysuser/checkpwd", ctrls.SysUser.checkPwd)//校验系统管理员密码
  .post("/sysuser/editpwd", ctrls.SysUser.editpwd)//修改系统管理员密码
  //角色
  .get("/role/find", ctrls.Role.findRole)//查询角色
  .post("/role/add", ctrls.Role.addOrEditRole)//添加角色
  .post("/role/edit", ctrls.Role.addOrEditRole)//添加或者编辑角色
  .post("/role/del", ctrls.Role.editEnable)//启用/禁用角色
  .get("/role/all", ctrls.Role.allRole)//所有角色
    //系统日志
  .get("/logs",ctrls.SysLog.findLog)//查询日志
    .get("/agent/find", ctrls.Agent.findAgent)//代理列表
    .post("/agent/add", ctrls.Agent.adduser)//添加代理
    .post("/agent/edit", ctrls.Agent.adduser)//修改代理
    .post("/agent/enable", ctrls.Agent.editEnable)//启用/禁用代理
    .post("/agent/checkpwd", ctrls.Agent.checkPwd)//校验代理密码
    .post("/agent/editpwd", ctrls.Agent.editpwd)//修改代理密码
    .post("/agent/resetpwd", ctrls.Agent.resetPwd)//重置代理密码
  //错误码
  .get("/errs", ctrls.ErrCode.errs);
module.exports = routers;