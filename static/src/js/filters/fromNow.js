/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    };
  })
    .filter("shoppingCart",function(){
        return function (data){
            var result=[],parant = [];
            data.forEach(function(obj){
               var index = parant.indexOf(obj.parent);
                if(index<0){
                    parant.push(obj.parent);
                    var arr = [];
                    arr.push(obj);
                    result.push(arr);
                }else {
                    result[index].push(obj);
                }
            });
            return result;
        }
    })
    .filter("totalProperty",function(){
        return function (data){
            var result=[];
            data.forEach(function(obj){
                result.push(obj["propertyno"]);
            });
            return result;
        }
    });