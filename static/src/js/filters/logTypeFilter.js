app.filter('logTypeFilter', function() {
    return function (type) {
        var ret = '';
        switch (type + '') {
            case '1':
                ret = '登录';
                break;
            case '2':
                ret = '登出';
                break;
            case '3':
                ret = '增加';
                break;
            case '4':
                ret = '修改';
                break;
            case '5':
                ret = '删除';
                break;
            case '6':
                ret = '退款';
                break;
            case '7':
                ret = '补单';
                break;
            case '8':
                ret = '重置密码';
                break;
        }
        return ret;
    }
});