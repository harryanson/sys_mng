var log4js = require("log4js"),
    config = require(ROOT_DIR + "/config");
log4js.configure({
    appenders: {
        console: {type: "console"},
        cheeseLogs: {
            type: "file",
            filename: ROOT_DIR + "/logs/" + config.appid + ".log",
            maxLogSize: 1048576,
            backups: 30
        }
    },
    categories: {
        cheese: {appenders: ["cheeseLogs"], level: "error"},
        default: {appenders: ["console", "cheeseLogs"], level: "trace"}
    }
});
exports = module.exports = function (categoryName) {
    // var logger = log4js.getLogger(name || config.appid);
    //console.log(process.cwd());
    var args = arguments;
    if (args.length <= 1)return log4js.getLogger(categoryName || config.appid);
    var logger = log4js.getLogger(categoryName || config.appid);
    var prefix = "";
    for (var i = 1; i < args.length; i++) {
        if (typeof args[i] == "string") {
            args[i] = args[i].replace(ROOT_DIR, "").replace(/(\\|\\\\)/g, "/");
        }
        if (i !== args.length - 1)
            prefix = prefix + args[i] + "] [";
        else
            prefix = prefix + args[i];
    }
    // console.log("prefix:",prefix);
    var pLogger = {};
    for (var key in logger) {
        pLogger[key] = logger[key];
    }
    ["log", "debug", "info", "warn", "error", "trace", "fatal"].forEach(function (item) {
        pLogger[item] = function () {
            var p = "";
            if (args.length) {
                p = "[" + prefix + "] ";
                //mac: new Error().stack.split('\n')[2].split(':')[1]
                p = "[" + new Error().stack.split("\n")[2].split(".js:")[1].split(":")[0] + " line] " + p;
                p = "\x1B[1m" + p + "\x1B[22m";
                arguments[0] = p + arguments[0];
                //console.log("p:",arguments[0]);
            }

            logger[item].apply(logger, arguments);
        };
    });
    return pLogger;
};
exports.log4js = log4js;
