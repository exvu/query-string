"use strict";
exports.__esModule = true;
var common_1 = require("./common");
/**
 *
 * 解析参数，
 * 将对象转换成obj[a]的形式
 * 将数组转换成obj[]的形式
 */
function stringifyParams(_data, prefix) {
    if (prefix === void 0) { prefix = ''; }
    var data = [];
    for (var key in _data) {
        if (_data[key] == undefined || _data[key] == null) {
            continue;
        }
        var _key = prefix == '' ? key : prefix + "[" + key + "]";
        //object
        if (Object.prototype.toString.call(_data[key]) == '[object Object]') {
            data.push.apply(data, stringifyParams(_data[key], _key));
        }
        else if (Object.prototype.toString.call(_data[key]) == '[object Array]') {
            for (var i in _data[key]) {
                var v = _data[key][i];
                if (typeof v == 'object') {
                    data.push.apply(data, stringifyParams(v, _key + "[" + i + "]"));
                }
                else {
                    data.push([_key + "[" + i + "]", common_1.encodeParams(v)]);
                }
            }
        }
        else {
            data.push([_key, common_1.encodeParams(_data[key])]);
        }
    }
    return data;
}
/**
 * 转换对象为字符串
 */
function stringify(obj) {
    var data = stringifyParams(obj);
    return data.map(function (item) { return item.join('='); }).join('&');
}
/**
 * 将querystring转换为对象
 */
function parse(querystring) {
    var _a;
    // key 正则匹配
    var reg = /^([a-zA-Z_][0-9a-zA-Z_]*)|(\[(?:[a-zA-Z_][0-9a-zA-Z_]*)?\])/ig;
    var _arr = {};
    //去掉最前的？和最后的&
    querystring = querystring.replace(/(^\?|\&$)/g, '');
    //对querystring 进行分割
    querystring.split('&').map(function (item) {
        var _a = item.split('='), name = _a[0], value = _a[1];
        value = common_1.decodeParams(value);
        var _b = name.split(reg).filter(function (value) { return value != '' && value != undefined; }), key = _b[0], other = _b.slice(1);
        if (key in _arr) {
            _arr[key].push([other, value]);
        }
        else {
            _arr[key] = [[other, value]];
        }
    });
    var query = {};
    //iterable object
    for (var key in _arr) {
        for (var _i = 0, _b = _arr[key]; _i < _b.length; _i++) {
            var _c = _b[_i], keys = _c[0], value = _c[1];
            var temp = value;
            for (var i = keys.length - 1; i >= 0; i--) {
                var _d = /\[(\S+)\]/.exec(keys[i]) || [], _e = _d[1], k = _e === void 0 ? null : _e;
                //keys[i]==[]
                if (k == null) {
                    temp = [temp];
                }
                else {
                    temp = (_a = {},
                        _a[k] = temp,
                        _a);
                }
            }
            if (Object.prototype.toString.call(query[key]) === '[object Object]' && Object.prototype.toString.call(temp) === '[object Object]') {
                query[key] = deepObjMerge(query[key], temp);
            }
            else if (Object.prototype.toString.call(query[key]) === '[object Array]' && Object.prototype.toString.call(temp) === '[object Array]') {
                query[key] = deepArrMerge(query[key], temp);
            }
            else {
                query[key] = temp;
            }
        }
    }
    for (var key in query) {
        if (Object.prototype.toString.call(query[key]) === '[object Object]') {
            query[key] = objectToArray(query[key]);
        }
    }
    //将如果object转换位array
    return query;
}
function objectToArray(obj) {
    var flag = true;
    for (var key in obj) {
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
            obj[key] = objectToArray(obj[key]);
        }
    }
    var keys = Object.keys(obj);
    var values = [];
    keys.forEach(function (item, index) {
        if (keys.indexOf(index + '') == -1) {
            flag = false;
            return false;
        }
        values.push(obj[item]);
    });
    return flag ? values : obj;
}
function deepObjMerge(obj1, obj2) {
    for (var key in obj2) {
        obj1[key] = (obj1[key]
            && Object.prototype.toString.call(obj1[key]) === '[object Object]'
            && Object.prototype.toString.call(obj2[key]) == '[object Object]')
            ? deepObjMerge(obj1[key], obj2[key]) : obj2[key];
    }
    return obj1;
}
function deepArrMerge(arr1, arr2) {
    for (var key in arr2) {
        arr1[key] = (arr1[key] && Object.prototype.toString.call(arr1[key]) === '[object Array]' && Object.prototype.toString.call(arr1[key]) == '[object Object]') ? deepArrMerge(arr1[key], arr2[key]) : arr2[key];
    }
    return arr1;
}
exports["default"] = {
    stringify: stringify, parse: parse
};
