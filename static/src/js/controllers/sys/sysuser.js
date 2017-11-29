/**
 * Created by Harry on 2016/4/20.
 */
app.controller('SysUserCtrl', ['$scope', '$timeout', 'ModalService', 'gridTool','createAjax', function ($scope, $timeout, ModalService,gridTool, createAjax) {
    $scope.gridOptions = angular.extend(angular.copy(gridOptions,{}),{
        columnDefs: [
            {field: 'loginname', displayName: '登录帐号', width: '150', enableHiding: false},
            {field: 'rolename', displayName: '角色', minWidth: 100, width: '10%', enableHiding: false},
            {field: 'username', displayName: '用户真实姓名', minWidth: 100, width: '10%', enableHiding: false},
            {field: 'mobile', displayName: '电话', minWidth: 100, width: '20%', enableHiding: false},
            {
                field: 'enable',
                displayName: '状态',
                minWidth: 100,
                width: '10%',
                cellTemplate: '<div  class="text-center">{{grid.appScope.showEnable(row.entity)}}</div>'
            },
            {
                field: 'option',
                displayName: '编辑/重置/启禁',
                enableSorting: false,
                enableHiding: false,
                pinnedRight: true,
                minWidth: 200, width: '350',
                cellTemplate: '<div class="text-center">' +
                '<button type="button" class="btn btn-link"  ng-click="grid.appScope.openModal(\'userlist_edit\', row);"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>' +
                // '<button type="button" class="btn btn-link"  ng-click="grid.appScope.editpwd(\'userlist_editpwd\', row);"><span class="glyphicon glyphicon-lock" aria-hidden="true"></span></button>' +
                '<button type="button" class="btn btn-link"  ng-click="grid.appScope.resetPwd(\'userlist_reset\', row);"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>' +
                '<button type="button" class="btn btn-link"  ng-click="grid.appScope.delUser(\'userlist_del\', row);"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>' +
                '</div>'
            }
        ]
    });
    $scope.showEnable = function (row) {
        var ret = '已禁用';
        switch (parseInt(row.enable, 10)) {
            case 1:
                ret = '已启用';
                break;
        }
        return ret;
    }
    $scope.search = function () {
        var data = {
            key: 'userlist', pageNumber: 1,
            pageSize: gridOptions.paginationPageSize,
            content: $scope.content
        };
        gridTool.refresh(data,$scope);
    };
    $scope.search();

    /**
     * 用户编辑 和添加
     * @param option
     * @param row
     */
    $scope.openModal = function (option, row) {
        var $$hashKey, title = "账号添加", info = {}, option = option;
        if (!!row) {
            info = row.entity;
            title = "账号修改";
            $$hashKey=info.$$hashKey;
        }
        async.waterfall([function (cb) {
            var data;
            createAjax(null, {"key": "rolelist_all"}, function (res) {
                cb(null, res);
            });
        }, function (val, cb) {
            info = angular.extend({title: title, role: val, key: option}, info);
            ModalService.baseModal({
                htmlId: 'html/sys/sysuser/info.html',
                openCtrl: 'ModalCtrl',
                size: 'lg',
                param: angular.extend(info)
            }, function (val) {
                val.$$hashKey=$$hashKey;
                cb(null, val);
            })
        }, function (val, cb) {
          val.role.some(function (role) {
            if(val.roleid==role.roleid){
              val.rolename=role.rolename;
              return true;
            }else{
              return false;
            }
          })
            delete  val.role;
            delete  val.title;
            createAjax(null, val, function (res) {
                showNotice(res);
                if(/_add/.test(option)){
                    gridTool.addRow(val,$scope);
                }else{
                    gridTool.editRow(val,$scope);
                }
            });
        }], function (err) {
            if (err) {
                console.log(err);
            }
        });
    };

    /**
     * 密码修改
     * @param option
     * @param row
     */
    $scope.editpwd = function (option, row) {
        var title = "密码修改", loginname = row.entity.loginname;
        async.waterfall([function (cb) {
            ModalService.baseModal({
                htmlId: 'html/blocks/pwd.html',
                openCtrl: 'ModalCtrl',
                size: 'lg',
                param: {title: title, loginname: loginname, key: option}
            }, function (val) {
                cb(null, val);
            })
        }, function (val, cb) {
            if (val.newpwd != val.isnewpwd) {
                alert('两次密码输入不一致!');
                return false;
            }
            createAjax(null, val, function (res) {
                showNotice(errors.ok);
            });
        }], function (err) {
            if (err) {
                console.log(err);
            }
        });
    };

    $scope.resetPwd = function (option, row) {
        var title = "密码重置", loginname = row.entity.loginname;
        async.waterfall([function (cb) {
            ModalService.baseModal({
                htmlId: 'html/sys/sysuser/reset.html',
                openCtrl: 'ModalCtrl',
                size: 'lg',
                param: {title: title, loginname: loginname, key: option}
            }, function (val) {
                cb(null, val);
            })
        }, function (val, cb) {
            createAjax(null, val, function (res) {
                showNotice(res);
            });
        }], function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    $scope.delUser = function (option, row) {
        var enableText = row.entity.enable == 1 ? '禁用' : '启用';
        var r = confirm("确定要" + enableText + "吗?");
        if (r == true) {
            var loginname = row.entity.loginname;
            var val = {loginname: loginname, enable: row.entity.enable == 1 ? 0 : 1, key: option};
            row.entity.enable=val.enable;
            createAjax(null, val, function (res) {
                showNotice(res);
                gridTool.editRow(row.entity,$scope);
            });
        }
        else {
            return false;
        }
    }
}]);
