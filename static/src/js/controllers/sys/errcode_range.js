/**
 * Created by Harry on 2016/4/20.
 */
app.controller('ErrCodeRangeCtrl', ['$scope','$timeout', function ($scope,$timeout) {
    $scope.gridOptions = {
        exporterMenuCsv: false,
        enableGridMenu: true,
        enableRowSelection: true,
        allowCellFocus:true,
        i18n:'zh-cn',
        columnDefs: [
            {field: 'name', displayName: '名字',allowCellFocus:true},
            {field: 'min', displayName: '最小值',allowCellFocus:true},
            {field: 'max', displayName: '最大值',allowCellFocus:true}
        ],
        paginationPageSizes: paginationPageSizes,
        paginationPageSize: paginationPageSize
    };

    $scope.getPagedDataAsync = function () {
        var data={key:'errcoderange'};
        createAjax(null,data, function (data) {
            $timeout(function() {
                $scope.gridOptions.data = data;
            });
        });
    };
    $scope.getPagedDataAsync();

}]);
