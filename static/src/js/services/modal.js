/**
 * Created by Harry on 2016/4/28.
 */
/**
 * 弹出框
 */
app.service('ModalService', ['$uibModal',function ($uibModal) {
    var self = this;
    self.baseModal=function (json,cb){
        var ret;
        /**
         * 打开弹出页
         */
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: json.htmlId,
            controller: json.openCtrl,
            size: json.size || 'lg',
            backdrop: 'static',
            resolve: {
                info: function () {
                    return json.param;
                }
            }
        });
        /**
         * 返回数据
         */
        modalInstance.result.then(function (val) {
          cb(val);
        },function () {
          // Cancel
        });
    }
}]);
