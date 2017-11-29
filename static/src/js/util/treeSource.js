window.menuTree =
  [
    {"id": "01", "text": "系统管理", expand: false,icon:"glyphicon-wrench", children: [
      {id: "0101", text: "帐号管理",icon:"glyphicon-home", key: "userlist",path:"/sys/sysuser/userlist",method:"get",html:"html/sys/sysuser/list.html",load_js: ["js/controllers/sys/sysuser.js"],children:[
        {id:"010101",text:"帐号添加", key: "userlist_add",path:"/sys/sysuser/add",method:"post"},
        {id:"010102",text:"帐号编辑", key: "userlist_edit",path:"/sys/sysuser/edit",method:"post"},
        {id:"010103",text:"帐号禁用启用", key: "userlist_del",path:"/sys/sysuser/enable",method:"post"},
        {id:"010104",text:"帐号密码更改", key: "userlist_editpwd",path:"/sys/sysuser/editpwd",method:"post"},
        {id:"010105",text:"帐号密码重置", key: "userlist_reset",path:"/sys/sysuser/resetpwd",method:"post"},
        {id:"010106",text:"帐号密码校验", key: "user_checkpwd",path:"/sys/sysuser/checkpwd",method:"post"}
      ]},
      {id: "0102", text: "角色管理", key: "rolelist",path:"/sys/role/find",method:"get",html:"html/sys/role/list.html",load_js:["bootstrapTreeview","js/controllers/sys/role.js"],children:[
        {id:"010201",text:"角色添加", key: "rolelist_add",path:"/sys/role/add",method:"post",html:"html/sys/role/info.html"},
        {id:"010202",text:"角色修改", key: "rolelist_edit",path:"/sys/role/edit",method:"post",html:"html/sys/role/info.html"},
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
    {"id": "02", "text": "代理", expand: true,icon:"glyphicon-shopping-cart", children:[{"id": "0201", "text": "代理管理", expand: false,icon:"glyphicon-shopping-cart",key: "agent_list",path:"/sys/agent/find",method:"get",html:"html/agent/list.html",load_js: ["js/controllers/agent/agent.js"],children:[
      {id:"020101",text:"代理添加",key: "agent_add",path:"/sys/agent/add",method:"post"},
      {id:"020102",text:"代理修改",key: "agent_edit",path:"/sys/agent/edit",method:"post"},
      {id:"020103",text:"代理禁用启用", key: "agent_del",path:"/sys/agent/enable",method:"post"},
      {id:"020104",text:"代理密码重置", key: "agent_reset",path:"/sys/agent/resetpwd",method:"post"}
    ]}]},
/*    {"id": "03", "text": "充值", expand: false,icon:"glyphicon-shopping-cart", children:[
      {"id":"0307","text":"商城商品","key":"store_product","path":"/sys/store/product",html:"html/store/pro_list.html",method:"get",load_js:["js/controllers/store/pro_list.js"],children:[
        {"id":"030701","text":"商城查询","key":"store_product_search","path":"/sys/store/product/search","method":"get"},
        {"id":"030702","text":"商城商品添加","key":"store_product_page","path":"/sys/store/product/page","html":"html/store/pro_add.html","method":"get",load_js:[["ngFileUpload"],["js/controllers/store/pro_add.js"]]},
        {"id":"030703","text":"商城添加","key":"store_product_add","path":"/sys/store/product/add","method":"post"},
        {"id":"030704","text":"商城商品编辑","key":"store_product_edit","path":"/sys/store/product/edit","method":"get","html":"html/store/pro_edit.html",load_js:[["js/controllers/store/pro_edit.js"],["ngFileUpload"]]},
        {"id":"030705","text":"商城提交","key":"store_product_sub","path":"/sys/store/product/sub","method":"post"}
      ]}
    ]}*/
  ]