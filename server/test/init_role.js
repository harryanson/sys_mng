global.ROOT_DIR = __dirname + '/..';
const dbcall = require(ROOT_DIR + "/db/pgsql").dbcall,
  treeSource = require(ROOT_DIR + "/config/treeSource");
(async(json)=>{
  let ids=[];
  function getRoleId(json){
    if (Array.isArray(json) && json.length > 0) {
      json.forEach((data, i) => {
        if (typeof data == "object" && !!data) {
          getRoleId(data);
        }
      });
    } else {
      Object.keys(json).forEach((key, i) => {
        if(key=='id'){
          ids.push(json[key]);
        }else if(key=='children'&&json[key].length>0){
          getRoleId(json[key]);
        }
      });
    }
  }
  getRoleId(json);
  let ret = await dbcall("pkg_system.system_role_add_edit", {rolename:'admin',roleid:1,listids:ids});
  console.log(ret)
  process.exit();
})(treeSource.menuTree)