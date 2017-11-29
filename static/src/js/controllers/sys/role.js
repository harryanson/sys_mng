/**
 * Created by Harry on 2016/4/20.
 */
app.controller('RoleCtrl', ['$scope', '$timeout', 'ModalService','gridTool', 'createAjax', function ($scope, $timeout, ModalService,gridTool, createAjax) {
    $scope.gridOptions =angular.extend(angular.copy(gridOptions,{}),{
      useExternalPagination: false,
      useExternalSorting: false,
        columnDefs: [
            {field: 'roleid', displayName: '角色id', visible: false},
            {field: 'rolename', displayName: '角色名', minWidth: 400, width: '50%', enableHiding: false},
            {
                field: 'enable',
                displayName: '状态',
                minWidth: 200,
                width: '25%',
                enableSorting: false,
                enableHiding: false,
                width: 150,
                cellTemplate: '<div class="text-center">{{grid.appScope.showStatus(row)}}</div>'
            },
            {
                field: 'info',
                displayName: '权限',
                enableSorting: false,
                enableHiding: false,
                pinnedRight: true,
                minWidth: 200, width: '25%',
                cellTemplate: '<div class="text-center"><button type="button" class="btn btn-link"  ng-click="grid.appScope.openModal(\'edit\', row);"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></div>'
            }
        ]
    });
    $scope.showStatus = function (row) {
        var info = row.entity, ret = '启用';
        if (info.rolename == '' && info.enable == 0) {
            ret = '禁用';
        }
        return ret;
    }
    function setChecked(json) {
        json.menus.forEach(function (m) {
            m.disabled = json.disabled;
            if (json.listids.indexOf(m.id) > -1) {
                m.checked = true;
            }
            if (json.listids.indexOf(m.id) > -1 && !!m.children) {
                setChecked({menus: m.children, listids: json.listids, disabled: json.disabled});
            }
        });
    }

    $scope.openModal = function (option, row) {
        var $$hashKey,roleid = "", menus = JSON.parse(JSON.stringify(currentUser.menus)), rolename = '', title = '添加角色', listids,
            disabled = false;
        var info = {title: '添加角色'}, key = 'rolelist_add';
        async.waterfall([function (cb) {
            if (option == 'edit') {
                $$hashKey=row.entity.$$hashKey,roleid = row.entity.roleid, listids = row.entity.listids, title = '编辑角色', key = 'rolelist_edit';
                rolename = row.entity.rolename;
                if (currentUser.roleid == row.entity.roleid) {
                    title = '权限管理';
                    disabled = true;
                }
                setChecked({menus: menus, listids: listids, disabled: disabled});
            }
            cb(null, menus);
        }, function (val, cb) {
            ModalService.baseModal({
                htmlId: 'html/sys/role/info.html',
                openCtrl: 'ModalCtrl',
                size: 'lg',
                param: {roleid: roleid, title: title, menus: menus, rolename: rolename, close: disabled}
            }, function (val) {
                console.log(val);
                cb(null, val);
            });
        }, function (val, cb) {
            val.key = key, listids = [];
            getListids(val.menus, listids);
            listids.sort(function (a, b) {
                return a.length - b.length;
            });
            if(!Array.isArray(listids)){
                listids=[listids];
            }
            val.listids = listids;
            delete val.menus;
            $scope.app.promise = createAjax(null, val, function (data) {
                showNotice(data);
                if (option == 'add') {
                    gridTool.addRow(val,$scope);
                } else {
                    val.$$hashKey=$$hashKey;
                    gridTool.editRow(val,$scope);
                }
            });
        }], function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    $scope.search = function () {
        var data = {key: 'rolelist'};
        gridTool.refresh(data,$scope);
    };
    $scope.search();
    function getListids(menus, listids) {
        menus.forEach(function (m) {
            if (!!m.children) {
                getListids(m.children, listids);
            }
            if (m.checked) {
                listids.push(m.id);
            }
        });
    }
}]);
