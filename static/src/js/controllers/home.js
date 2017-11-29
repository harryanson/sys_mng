/* Controllers */
app.controller('HomeCtrl', ['$scope', '$timeout', '$localStorage','i18nService', function ($scope, $timeout, $localStorage,i18nService) {
    i18nService.setCurrentLang('zh-cn');
    $timeout(function () {
        async.waterfall([function (cb) {
            if (!!$localStorage.currentUser) {
                currentUser = $localStorage.currentUser;
                $scope.app.loginname=currentUser.loginname;
                $scope.app.menus = currentUser.menus;
            } else {
                location.href = '#/access/signin';
            }
            cb(null, null);
        }], function (err) {
            if (err) {
                console.log(err);
                showNotice(errors.internal_server_error);
            }
        });
    });
    $timeout(function () {
        $.when(
            $.getScript( root_dir+"bower_components/moment/min/moment.min.js" ),
            $.getScript(root_dir+"plugins/echarts.min.js" ),
            $.Deferred(function( deferred ){
                $( deferred.resolve );
            })
        ).done(function(){
            console.log('==========load [moment,echarts]     ok==========')
        });
    });
  $('#waitingModal').on('shown.bs.modal', function () {

    var progress = setInterval(function() {
      var $bar = $('.progress-bar');
      if ($bar.width()==500) {

        // complete

        clearInterval(progress);
        $('.progress').removeClass('active');
        $('#waitingModal').modal('hide');
        $bar.width(0);

      } else {

        // perform processing logic here

        $bar.width($bar.width()+50);
      }

      $bar.text($bar.width()/5 + "%");
    }, 800);
  });
}]);