/**
 * Created by Harry on 2017/8/19.
 */
/**
 *  系统权限
 * @type {{pathTree: [*]}}
 */
module.exports = {
  pathTree:{ '/sys/sysuser/userlist': { id: '0101', key: 'userlist' },
    '/sys/sysuser/add': { id: '010101', key: 'userlist_add' },
    '/sys/sysuser/edit': { id: '010102', key: 'userlist_edit' },
    '/sys/sysuser/enable': { id: '010103', key: 'userlist_del' },
    '/sys/sysuser/editpwd': { id: '010104', key: 'userlist_editpwd' },
    '/sys/sysuser/resetpwd': { id: '010105', key: 'userlist_reset' },
    '/sys/sysuser/checkpwd': { id: '010106', key: 'user_checkpwd' },
    '/sys/role/find': { id: '0102', key: 'rolelist' },
    '/sys/role/add': { id: '010201', key: 'rolelist_add' },
    '/sys/role/edit': { id: '010202', key: 'rolelist_edit' },
    '/sys/role/del': { id: '010203', key: 'rolelist_del' },
    '/sys/role/all': { id: '010204', key: 'rolelist_all' },
    '/sys/logs': { id: '0103', key: 'loglist' },
    '/sys/errcoderange/find': { id: '0104', key: 'errcoderange' },
    '/sys/errcoderange/add': { id: '010401', key: 'errcoderange_add' },
    '/sys/errcoderange/del': { id: '010402', key: 'errcoderange_edit' },
    '/sys/errcoderange/all': { id: '010403', key: 'errcoderange_all' },
    '/sys/agent/find': { id: '0201', key: 'agent_list' },
    '/sys/agent/add': { id: '020101', key: 'agent_add' },
    '/sys/agent/edit': { id: '020102', key: 'agent_edit' },
    '/sys/agent/enable': { id: '020103', key: 'agent_del' },
    '/sys/agent/resetpwd': { id: '020104', key: 'agent_reset' },
    '/sys/store/product': { id: '0307', key: 'store_product' },
    '/sys/store/product/search': { id: '030701', key: 'store_product_search' },
    '/sys/store/product/page': { id: '030702', key: 'store_product_page' },
    '/sys/store/product/add': { id: '030703', key: 'store_product_add' },
    '/sys/store/product/edit': { id: '030704', key: 'store_product_edit' },
    '/sys/store/product/sub': { id: '030705', key: 'store_product_sub' } },
  menuTree: [
    {"id": "01", "text": "系统管理", expand: true,icon:"glyphicon-wrench", children: [
      {id: "0101", text: "帐号管理",icon:"glyphicon-home", key: "userlist",path:"/sys/sysuser/userlist",method:"get",html:"html/sys/sysuser/list.html",load_js: ["js/controllers/sys/sysuser.js"],children:[
        {id:"010101",text:"帐号添加", key: "userlist_add",path:"/sys/sysuser/add",method:"post"},
        {id:"010102",text:"帐号编辑", key: "userlist_edit",path:"/sys/sysuser/edit",method:"post"},
        {id:"010103",text:"帐号禁用启用", key: "userlist_del",path:"/sys/sysuser/enable",method:"post"},
        {id:"010104",text:"帐号密码更改", key: "userlist_editpwd",path:"/sys/sysuser/editpwd",method:"post"},
        {id:"010105",text:"帐号密码重置", key: "userlist_reset",path:"/sys/sysuser/resetpwd",method:"post"},
        {id:"010106",text:"帐号密码校验", key: "user_checkpwd",path:"/sys/sysuser/checkpwd",method:"post"}
      ]},
      {id: "0102", text: "角色管理", key: "rolelist",path:"/sys/role/find",method:"get",html:"html/sys/role/list.html",load_js:["bootstrapTreeview","js/controllers/sys/role.js"],children:[
        {id:"010201",text:"角色添加", key: "rolelist_add",path:"/sys/role",method:"post",html:"html/sys/role/info.html"},
        {id:"010202",text:"角色修改", key: "rolelist_edit",path:"/sys/role",method:"post",html:"html/sys/role/info.html"},
        {id:"010203",text:"角色删除", key: "rolelist_del",path:"/sys/role/del",method:"post",html:"html/sys/role/info.html"},
        {id:"010204",text:"所有角色", key: "rolelist_all",path:"/sys/role/all",method:"get"}
      ]},
      {id: "0103", text: "日志管理", key: "loglist",path:"/sys/logs",method:"get",html:"html/sys/logs/list.html",load_js:["js/filters/logTypeFilter.js","js/controllers/sys/log.js"]},
      {id: "0104", text: "错误码范围管理", key: "errcoderange",path:"/sys/errcoderange/find",method:"get",html:"html/sys/errcode_range/list.html",load_js: ["js/controllers/sys/errcode_range.js"],children:[
        {id:"010401",text:"错误码范围添加",key: "errcoderange_add",path:"/sys/errcoderange/add",method:"post"},
        {id:"010402",text:"错误码范围删除",key: "errcoderange_edit",path:"/sys/errcoderange/del",method:"delete"},
        {id:"010403",text:"错误码范围所有", key: "errcoderange_all",path:"/sys/errcoderange/all",method:"get"}
      ]}
    ]},
    {"id": "02", "text": "代理", expand: false,icon:"glyphicon-shopping-cart", children:[{"id": "0201", "text": "代理管理", expand: false,icon:"glyphicon-shopping-cart",key: "agent_list",path:"/sys/agent/find",method:"get",html:"html/agent/list.html",load_js: ["js/controllers/agent/agent.js"],children:[
      {id:"020101",text:"代理添加",key: "agent_add",path:"/sys/agent/add",method:"post"},
      {id:"020102",text:"代理修改",key: "agent_edit",path:"/sys/agent/edit",method:"post"},
      {id:"020103",text:"代理禁用启用", key: "agent_del",path:"/sys/agent/enable",method:"post"},
      {id:"020104",text:"代理密码重置", key: "agent_reset",path:"/sys/agent/resetpwd",method:"post"}
    ]}]},
    {"id": "03", "text": "充值", expand: false,icon:"glyphicon-shopping-cart", children:[
      {"id":"0307","text":"商城商品","key":"store_product","path":"/sys/store/product",html:"html/store/pro_list.html",method:"get",load_js:["js/controllers/store/pro_list.js"],children:[
        {"id":"030701","text":"商城查询","key":"store_product_search","path":"/sys/store/product/search","method":"get"},
        {"id":"030702","text":"商城商品添加","key":"store_product_page","path":"/sys/store/product/page","html":"html/store/pro_add.html","method":"get",load_js:[["ngFileUpload"],["js/controllers/store/pro_add.js"]]},
        {"id":"030703","text":"商城添加","key":"store_product_add","path":"/sys/store/product/add","method":"post"},
        {"id":"030704","text":"商城商品编辑","key":"store_product_edit","path":"/sys/store/product/edit","method":"get","html":"html/store/pro_edit.html",load_js:[["js/controllers/store/pro_edit.js"],["ngFileUpload"]]},
        {"id":"030705","text":"商城提交","key":"store_product_sub","path":"/sys/store/product/sub","method":"post"}
      ]}
    ]}
  ]
};