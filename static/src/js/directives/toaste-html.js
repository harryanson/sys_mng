angular.module('app').directive('toasteHtml',['shareParam', function(shareParam) {
    var new_orders = shareParam.getParam()['new_orders'],template='';
    switch(new_orders[new_orders.length-1]['categoryKey'] ){

        case 'refund':
            template="<div><a>有{{directiveData.counts}}条{{directiveData.category}}的订单需要处理</a></div>";
            break;
        case 'locationWrong':
            template="<div><a>有{{directiveData.counts}}条异常订单需要处理</a></div>";
            break;
        default:
            template="<div><a>有{{directiveData.counts}}条付款已确认的{{directiveData.category}}订单需要处理</a></div>";
    }
    return {
        template:template,
        link: function(scope, element, attr, controller) {
            element.bind('click', function() {
                var param = shareParam.getParam();
                for (var i=0,len=param.new_orders.length; i<len; ++i) {
                    if (param.new_orders[i].categoryKey == scope.directiveData.categoryKey) {
                        param.currentCategoryKey = param.new_orders[i].categoryKey;
                        break;
                    }
                }
                shareParam.setParam(param);
                scope.$parent.clearAllToaste();
            });
        }
    };
  }]);