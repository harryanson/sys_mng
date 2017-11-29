angular.module('app')
  .directive('setNgAnimate', ['$animate', function ($animate) {
    return {
        link: function ($scope, $element, $attrs) {
            $scope.$watch( function() {
                return $scope.$eval($attrs.setNgAnimate, $scope);
            }, function(valnew, valold){
                $animate.enabled(!!valnew, $element);
            });
        }
    };
  }])
    .directive("readImg",function(){
        return{
            link:function(scope,element,attrs){
                var input = element.find("input");
                function readURl(element){
                    if(input.files && input.files[0]){
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            console.log(element.find("img").attrs('src'));
                            element.find("img").attrs('src', e.target.result);
                        }
                    }
                }
                input.on("change",function(){
                   readURl(this);
                });
            },
            restrict:"AE",
            template:"<form runat='server'>"
            +"<input type='file' />"
            +"<img  src='#' alt='your image' />"
            +"</form>"
        }
    })
    .directive("teachEnable",function(){
        return {
            restrict:"AE",
            scope:{teaching:"=teaching"},
            link:function ($scope,$element,$atrrs){
                $scope.$watch("teaching",function(newValue){
                    var data = newValue.trim();
                    if(data.indexOf("课时") ==-1 && data.indexOf("季度套餐") !=0 && data.indexOf("年度套餐")!=0){
                        console.log(data);
                        $element.css("color","red");
                    }else {
                        $element.css("color","green");
                    }
                });
            }
        }
    });