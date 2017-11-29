/*
 * 所有工具方法
 * */
var commonObj = {};
var currentUser={};
var mng_uri=location.protocol+'//'+location.hostname;
var gridOptions={
  exporterMenuCsv: false,
  enableGridMenu: true,
  enableHighlighting : false,
  useExternalPagination: true,
  useExternalSorting: true,
  paginationPageSizes: [25, 50, 75],
  paginationPageSize: 25
};
var storage_url='https://api.cdyzrs.com/storage/upload';
var user_orders =null;

if(location.hostname=='localhost'){
    mng_uri='http://127.0.0.1';
}
if((location.port!=80&&location.port!='')&&mng_uri.indexOf(':3300')==-1){
    mng_uri+=':3300';
}
console.log(mng_uri);
//初始化操作按钮
function initOperates(id,text,callback){
    //if(userLimits && userLimits.length > 0 && userLimits.indexOf(id) != -1 && $('#oper'+id).length == 0){
        var css = "";
        if(text.match(/(添加)/)){
            css = "glyphicon glyphicon-plus";
        }else if(text.match(/(修改)/)){
            css = "glyphicon glyphicon-pencil";
        }else if(text.match(/(删除)/)){
            css = "glyphicon glyphicon-minus";
        }else if(text.match(/(确认)/)){
            css = "glyphicon glyphicon-ok";
        }else if(text.match(/(拒绝)/)){
            css = "glyphicon glyphicon-ban-circle";
        }else if(text.match(/(未)/)){
            css = "glyphicon glyphicon-ban-circle";
        }else{
            css = "";
        }
        $("#mytool").append('<button id="oper'+id+'" type="button" class="btn btn-default btn-sm" style="margin:0 10px"><span class="'+css+'"></span>'+text+'</button>');
        if(!!callback){$('#oper'+id).click(function(){callback(this);});}
    //}
}
function addEditOper(type){
    if(type==1){$("#myModalLabel").html("添加");}else{$("#myModalLabel").html("修改");}
    $("#tableContent").hide();
    $("#addEditForm").parent().show();
    $.each($("#addEditContent").children(".input-group"),function(i,dom){$(dom).removeClass("has-error");})
    $.each($("#addEditContent").children(".has-error"),function(i,dom){$(dom).children(".help-block").html("");})
}
/**
 * 页面上部淡出消息
 * msg 淡出消息 string
 */
function showNotice(msg) {
    if (msg!=null||msg!=undefined) {
        if(typeof msg=='number'){
            msg=errcode[msg]['message'];
        }else if(typeof msg=='object'&&msg.code>=0){
          msg=errcode[msg.code]['message'];
        }
        qiao.bs.msg({msg: msg, type: 'danger', time: 10000});
    }
}

//弹出提醒
function showMsg(title,msg){
    if(!!title || !!msg){
        if(!msg){ msg = title;title = "提示"; }
        qiao.bs.alert({"title":title,"msg":msg,backdrop:true,"okbtn":"知道了"});
        setTimeout(function(){if($("#bsmodal").length > 0){$("#bsmodal").find("button").click();}},2000);
    }
}
//弹出提醒-确认
function showConfirm(title,msg,ok){
    if(typeof msg == "function"){ ok = msg;msg = ""; }
    if(!!title || !!msg){
        if(!msg){ msg = title;title = "确认操作"; }
        qiao.bs.confirm({"title":title,"msg":msg,backdrop:true},function(){
            if(!!ok){ok();}//点击“确认”后调用方法
        });
    }
}
/**
 * 弹出可输入对话框
 * title 标题 string
 * callFun 点击确认后回调方法
 */
function showDialog(title,callFun){
    if(typeof title === "function"){
        callFun = title;
        title = "请输入：";
    }
    $('#modalBootstrap .modal-title').html(title);
    //弹出前清空输入框
    $('#modalBootstrap .text-center input').val('');
    $('#modalBootstrap').modal({
        keyboard: true
    });
    //防止事件重复绑定，先清除掉按钮所绑定的事件
    $('#modalBootstrap .modal-footer button').unbind();
    //确认
    $('#modalBootstrap .modal-footer .btn-primary').click(function(){
        callFun();
    });
}

function localdate(){
    var ret, utcdate = typeof arguments[0] == "string" ? arguments[0] : moment(arguments[0]);
    switch (arguments.length) {
        case 1:
            ret = new Date(moment(utcdate, "YYYY-MM-DDTHH:mm:ss Z"));
            break;
        case 2:
            ret = moment(utcdate, "YYYY-MM-DDTHH:mm:ss Z").format(arguments[1]);
            break;
        default:
            ret =  moment(utcdate, "YYYY-MM-DDTHH:mm:ss Z").format("YYYY-MM-DD HH:mm:ss");
            break;
    }
    return ret;
}
//获取url中的参数
function getUrlParam(name) {
    var hash = location.hash; //获取url中"?"符后的字串
    var theRequest = {};
    if (hash.indexOf("?") != -1) {
        var str = hash.substr(hash.indexOf("?")+1,hash.length);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest[name];
}
//改变url中的参数值
function setUrlParam(uri, key, value)
{
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

function currentDateTime() {
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = parseInt(month) < 10 ? '0' + month : month;
    var day = date.getDate();
    day = parseInt(day) < 10 ? '0' + day : day;

    var hour = date.getHours();
    hour = parseInt(hour) < 10 ? '0' + hour : hour;
    var minute = date.getMinutes();
    minute = parseInt(minute) < 10 ? '0' + minute : minute;
    var seconds = date.getSeconds();
    seconds = parseInt(seconds) < 10 ? '0' + seconds : seconds;

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
};

/* *
 * 时间戳(1474936092)转换成格式化的日期时间(2016-09-26 17:28:12)
 * example : date('Y-m-d H:i:s', 1474936092);
 */
function date() {
    var args = Array.prototype.slice.call(arguments);

    if (args.length == 0) {
        return currentDateTime();
    }

    var date = new Date();
    var format = args[0];
    if (args.length == 2) {
        date = new Date(args[1] * 1000);
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = parseInt(month) < 10 ? '0' + month : month;
    var day = date.getDate();
    day = parseInt(day) < 10 ? '0' + day : day;

    var hour = date.getHours();
    hour = parseInt(hour) < 10 ? '0' + hour : hour;
    var minute = date.getMinutes();
    minute = parseInt(minute) < 10 ? '0' + minute : minute;
    var seconds = date.getSeconds();
    seconds = parseInt(seconds) < 10 ? '0' + seconds : seconds;

    format = format.replace(/Y/, year);
    format = format.replace(/m/, month);
    format = format.replace(/d/, day);
    format = format.replace(/H/, hour);
    format = format.replace(/i/, minute);
    format = format.replace(/s/, seconds);

    return format;
};

/* *
 * 格式化的日期时间(2016-09-26 17:28:12)转换成时间戳(1474936092)
 * example : strtotime('2016-09-26 17:28:12');
 */
function strtotime() {
    var args = Array.prototype.slice.call(arguments);

    if (args.length == 0) {
        return Date.parse(currentDateTime()) / 1000;
    }

    return Date.parse(args[0]) / 1000;
}
/**
 * 数组转object，如果没有key就用编号做key
 * @returns {{}}
 */
Array.prototype.toObject = function() {
    var obj={},key,id;
    if(arguments.length==1){
        id=arguments[0];
    }
    for (var i = 0,len = this.length;i<len;i++){
        if(typeof this[i] != "function") {
            if(!id){
                key=i;
            }else{
                key=this[i][id];
            }
            obj[key]=this[i];
            obj[key].index=i;
        }
    }
    return obj;
}