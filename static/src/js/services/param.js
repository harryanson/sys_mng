/**
 * Created by Harry on 2016/10/17.
 */
app.service('shareParam', [function () {
    var self = this, ret;
    self.setParam = function (json) {
        ret = json;
    }
    self.getParam = function () {
        return ret;
    }
}]);