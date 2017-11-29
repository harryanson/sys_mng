global.ROOT_DIR = __dirname;
const path = require("path"),
  Koa = require("koa"),
  convert = require("koa-convert"),
  koaStatic = require("koa-static"),
  bodyParser = require("koa-bodyparser"),
  koaLogger = require("koa-logger"),
  views = require("koa-views"),
  onerror = require("koa-onerror"),
  config = require(ROOT_DIR + "/config"),
  routers = require(ROOT_DIR + "/routers/index"),
  cors = require("kcors"),
app = new Koa(),
  logger = require(ROOT_DIR +"/lib/logger")("app", __filename, process.pid),
  fs = require("fs"),
  cluster = require("cluster"),
  numCPUs = require("os").cpus().length;
process.env.NODE_ENV = process.env.NODE_ENV || "production";
/*process.on("uncaughtException", function (err) {
  logger.error("catched uncaughtException");
  logger.error(err);
});
process.on("SIGHUP", function () {
  logger.info("Got SIGHUP. Process is restarted");
  for (let worker in cluster.workers) {
    cluster.workers[worker].process.disconnect();
  }
});*/
app.use(cors());

// 配置控制台日志中间件
app.use(koaLogger());

// 配置ctx.body解析中间件
app.use(bodyParser());
//异常处理
// onerror(app,"json");
// 配置静态资源加载中间件
app.use(koaStatic(path.join(__dirname, "./../static")));
app.use(views(path.join(__dirname, "./../static"), {
  map: {
    html: "underscore"
  }
}));
// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods());
//启用服务
if (process.env.NODE_ENV == "production") {
  if (cluster.isMaster) {
    (async() => {
      await require(ROOT_DIR +"/controllers/errcode").create_erreode_file();
    })();
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("listening", function (worker, address) {
      logger.info(`${config.appid} worker:${worker.process.pid} ,port:${config.port}`);
    });
    cluster.on("disconnect", function (worker) {
      let w = cluster.fork();
      logger.error(`[${new Date()}] [master:${process.pid}] wroker:${worker.process.pid} disconnect! new worker:${w.process.pid} fork`);
    });
    cluster.on("exit", function (worker) {
      logger.error(`[${new Date()}] [master:${process.pid}] wroker:${worker.process.pid} exit!`);
    });
  } else {
    //错误码全局变量
    global.errs = require(ROOT_DIR + "/config/errs.js");
    app.listen(config.port);
  }
} else {
  (async() => {
    await require(ROOT_DIR +"/controllers/errcode").create_erreode_file();
  })();
  //错误码全局变量
  global.errs = require(ROOT_DIR + "/config/errs.js");
  app.listen(config.port);
}
