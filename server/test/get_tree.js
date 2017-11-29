global.ROOT_DIR = __dirname + '/..';
const dbcall = require(ROOT_DIR + "/db/pgsql").dbcall,
  treeSource = require(ROOT_DIR + "/config/treeSource");
(async(json)=>{
  let tree={};
  function getTree(json){
    if (Array.isArray(json) && json.length > 0) {
      json.forEach((data, i) => {
        if (typeof data == "object" && !!data) {
          getTree(data);
        }
      });
    } else {
      if(json.path){
        tree[json.path]={id:json.id,key:json.key};
      }
      if(json.children&&json.children.length>0){
        getTree(json.children);
      }
    }
  }
  getTree(json);
  console.log(tree)
  process.exit();
})(treeSource.menuTree)