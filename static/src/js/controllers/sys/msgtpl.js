/**
 * Created by Harry on 2016/4/20.
 */
app.controller('MsgTplCtrl', ['$scope', '$timeout', 'ModalService', '$localStorage', function ($scope, $timeout, ModalService, $localStorage) {

    $scope.gridOptions = {
        exporterMenuCsv: false,
        enableGridMenu: true,
        i18n: 'zh-cn',
        columnDefs: [
            {name: 'key', displayName: 'key', enableHiding: false, pinnedLeft: true},
            {name: 'name', displayName: '名称', enableHiding: false, pinnedLeft: true},
            {name: 'title', displayName: '标题'},
            {name: 'content', displayName: '内容'},
            {
                name: 'enable',
                displayName: '状态',
                width: 100,
                cellTemplate: '<div  class="text-center">{{enable == 0 ? "已禁用" :"已启用"}}</div>'
            },
            {
                name: 'option',
                displayName: '操作',
                enableSorting: false,
                enableHiding: false,
                pinnedRight: true,
                width: 150,
                cellTemplate: '<div class="text-center"><button type="button" class="btn btn-link"  ng-click="grid.appScope.openModal(\'edit\', row);"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></div>'
            }
        ],
        paginationPageSizes: paginationPageSizes,
        paginationPageSize: paginationPageSize
    };
    $scope.operate = function (row, option) {
        var key = '', info={}, index, codes = [];
        switch (option) {
            case 'add':
                key = 'msgtpl_add';
                break;
            case 'edit':
                info = row.entity;
                key = 'msgtpl_edit';
                break;
            case 'toggle':
                info = row.entity;
                key = 'msgtpl_toggle';
                break;
        }
        info.key=key;
        createAjax(null, info, function (data) {
            $timeout(function () {
                if (option == 'add') {
                    $scope.gridOptions.data.unshift(info);
                }
            });
        });
    };
    $scope.getPagedDataAsync = function () {
        var data = {}, search = [];
        if (!!$scope.content) {
           data.content=$scope.content;
        }
        data.key = 'msgtpl';
        createAjax(null, data, function (data) {
            $timeout(function () {
                $scope.gridOptions.data = data;
            });
        });
    };
    $scope.getPagedDataAsync();

    $scope.openModal = function (option, row) {
        var info = {msgTitle: '添加消息模板',type:1}, key = 'msgtpl_add';
        async.waterfall([function (cb) {
            if (option == 'edit') {
                key = 'msgtpl_edit';
                info = row.entity;
                info.msgTitle = '编辑消息模板';
                cb(null, null);
            } else {
                cb(null, null);
            }
        }, function (val, cb) {
            ModalService.baseModal({
                htmlId: 'msgtpl_info.html',
                openCtrl: 'ModalCtrl',
                size: 'lg',
                param: info
            }, function (val) {
                cb(null, val);
            });
        }, function (val, cb) {
            val.msgkey = val.key;
            val.key = key;
            val.language='zh-Hans';
            createAjax(null, val, function (data) {
                $timeout(function () {
                    if (option == 'add') {
                        $scope.gridOptions.data.unshift(val);
                    } else {
                        $scope.gridOptions.data = $scope.gridOptions.data.map(function (v) {
                            if (v.key == val.key) {
                                v = val;
                            }
                            return v;
                        });
                    }
                    showNotice(errors.ok);
                });
            });
        }], function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}]);
