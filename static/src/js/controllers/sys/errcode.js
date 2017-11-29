/**
 * Created by Harry on 2016/4/20.
 */
app.controller('ErrCodeCtrl', ['$scope','$timeout','ModalService','$localStorage', function ($scope,$timeout,ModalService,$localStorage) {

    $scope.gridOptions = {
        exporterMenuCsv: false,
        enableGridMenu: true,
        enableRowSelection: true,
        enableHighlighting : false,
        i18n:'zh-cn',
        columnDefs: [
            {field: 'name', displayName: '名字'},
            {field: 'zh-Hans', displayName: '简体' },
            {field: 'zh-Hant', displayName: '繁体'},
            {field: 'en', displayName: '英文'},
        ],
        paginationPageSizes: paginationPageSizes,
        paginationPageSize: paginationPageSize
    };
    $scope.delData=function(row){
        var info=row.entity,index,codes=[];
        showConfirm("删除错误码","是否确认删除？",function(){
            $scope.gridOptions.data.forEach(function(item,i){
                if(item.code==info.code){
                    index=i;
                    return ;
                }
            });
            codes.push(info.code);
            createAjax(null, {key:'errcode_del',codes:codes}, function (data) {
                $timeout(function(){
                    $scope.gridOptions.data.splice(index,1);
                });
            });

        });
    };
    $scope.getPagedDataAsync = function () {
        var data={},range=$scope.errorRange,search=[];
        if(!!range){
            search=['code>='+range.min+" and code<="+range.max];
            data={search:search};
        }
        data.key='errcode';
        createAjax(null,data, function (data) {
            $timeout(function() {
                $scope.gridOptions.data = data;
            });
        });
    };
    $scope.getPagedDataAsync();
    /**
     * 获取范围
     * @param code
     */
    function getRange(code,cb){
        var code=parseInt(code,10),ret;
        async.waterfall([function(cb) {
            cb(null,$localStorage.errcode_range);
        },function (val,cb) {
            if(!val){
                createAjax(null, {key:'errcoderange_all'}, function (data) {
                    data=data.map(function(item){
                        item.name=item.name+'【'+item.min+'——'+item.max+'】';
                        return item;
                    });
                    $localStorage.errcode_range=data;
                    cb(null,data);
                });
            }else{
                cb(null,val);
            }
        },function(data,cb){
            data.some(function(err,i){
                if(parseInt(err.min,10)<=code&&parseInt(err.max,10)>=code){
                    ret=err;
                    return true;
                }
            });
            cb(null,ret);
        }], function (err,ret) {
            if (err) {
                showNotice(errors.internal_server_error);
            }
            cb(ret);
        });

    }
    $scope.openModal=function(option,row){
        var info={title:'添加错误码'},key='errcode_add';
        async.waterfall([function(cb){
            if(option=='edit'){
                key='errcode_edit';
                info=row.entity;
                info.title='编辑错误码';
                info.hans=info['zh-Hans'];
                getRange(info.code,function(val){
                    info.range=val;
                    cb(null,null);
                });
            }else{
                cb(null,null);
            }
        },function(val,cb){
            ModalService.baseModal({htmlId:'errcode_info.html',openCtrl:'ModalCtrl',size:'lg',param:info},function(val){
                val.min=val.range.min;
                val.max=val.range.max;
                val['zh-Hans']=val.hans;
                delete val.hans;
                delete val.range;
                cb(null,val);
            });
        },function(val,cb){
            val.key=key;
            createAjax(null, val, function (data) {
                $timeout(function(){
                    if(option=='add'){
                        $scope.gridOptions.data.unshift(val);
                    }else{
                        $scope.gridOptions.data= $scope.gridOptions.data.map(function(v){
                            if(v.code==val.code){
                                v=val;
                            }
                            return v;
                        });
                    }
                    showNotice(errors.ok);
                });
            });
        }],function(err){
            if(err){
                console.log(err);
            }
        });

    }
}]);
