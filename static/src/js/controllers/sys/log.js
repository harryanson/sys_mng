/**
 * Created by Harry on 2017/8/25.
 */
app.controller('SysLogCtrl', ['$scope', '$timeout', 'createAjax', function ($scope, $timeout, createAjax) {
  $scope.gridOptions =angular.extend(angular.copy(gridOptions,{}),{
    columnDefs: [
      { field: 'logid', displayName: '日志id', visible: false},
      {
        field: 'type',
        displayName: '操作类型',
        minWidth: 100,
        width: '10%',
        enableHiding: false,
        cellFilter: 'logTypeFilter'
      },
      {field: 'content', displayName: '操作内容', minWidth: 200, width: '15%', enableHiding: false},
      {field: 'relatedTable', displayName: '关联表', minWidth: 100, width: '10%', enableHiding: false},
      {field: 'relatedNo', displayName: '关联编号', minWidth: 100, width: '10%', enableHiding: false},
      {field: 'sysuser', displayName: '操作者', minWidth: 100, width: '10%', enableHiding: false},
      {field: 'operIp', displayName: '操作者ip', minWidth: 100, width: '10%', enableHiding: false},
      {field: 'createtime', displayName: '创建时间', minWidth: 150, width: '20%', enableHiding: false,
        type : 'date',
        cellFilter : 'date:"yyyy-MM-dd HH:mm"',
        filterCellFiltered : 'true'},
    ]
  });
  $scope.search = function () {
    var data = {
      key: 'loglist', pageNumber: 1,
      pageSize: gridOptions.paginationPageSize,
      content: $scope.content
    };
    if ($scope.app) {
      $scope.app.promise = createAjax(null, data, function (data) {
        reload(data);
      });
    }
  };
  $scope.search();
  /**
   * 刷新页面
   * @param data
   */
  function reload(data) {
    $timeout(function () {
      $scope.gridOptions.totalItems = parseInt(data.total);
      $scope.gridOptions.data = data.list;
    });
  }
}])
