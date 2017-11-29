/**
 * 整合所有子路由
 */

const router = require("koa-router")();
const sys = require("./sys"),
sysUser=require(ROOT_DIR+"/controllers/sys_user");
router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {code: errs.internal_server_error};
    ctx.app.emit('error', err, ctx);
  }
});
router.use("/sys",sysUser.checkUser, sys.routes(), sys.allowedMethods());
module.exports = router;


