import { encodeParams, decodeParams } from './common';
/**
 * 
 * 解析参数，
 * 将对象转换成obj[a]的形式
 * 将数组转换成obj[]的形式
 */
function stringifyParams(_data: { [key: string]: any }, prefix: string = '') {
  let data: Array<Array<any>> = [];
  for (let key in _data) {
    if (_data[key] == undefined || _data[key] == null) {
      continue;
    }
    let _key = prefix == '' ? key : `${prefix}[${key}]`;
    //object
    if (Object.prototype.toString.call(_data[key]) == '[object Object]') {
      data.push(...stringifyParams(_data[key], _key));
    } else if (Object.prototype.toString.call(_data[key]) == '[object Array]') {
      for (let i in _data[key]) {
        let v = _data[key][i];
        if (typeof v == 'object') {
          data.push(...stringifyParams(v, `${_key}[${i}]`));
        } else {
          data.push([`${_key}[${i}]`, encodeParams(v)]);
        }
      }
    } else {
      data.push([_key, encodeParams(_data[key])]);
    }
  }
  return data;
}

/**
 * 转换对象为字符串
 */

function stringify(obj: { [index: string]: any }) {
  let data: Array<Array<any>> = stringifyParams(obj);
  return data.map(item => item.join('=')).join('&');
}


/**
 * 将querystring转换为对象
 */
function parse(querystring: string) {
  // key 正则匹配
  const reg = /^([a-zA-Z_][0-9a-zA-Z_]*)|(\[(?:[a-zA-Z_][0-9a-zA-Z_]*)?\])/ig;
  const _arr: { [index: string]: any } = {};

  //去掉最前的？和最后的&
  querystring = querystring.replace(/(^\?|\&$)/g, '');
  //对querystring 进行分割
  querystring.split('&').map(item => {

    let [name, value] = item.split('=');
    value = decodeParams(value);
    let [key, ...other] = name.split(reg).filter((value) => value != '' && value != undefined);
    if (key in _arr) {
      _arr[key].push([other, value])
    } else {
      _arr[key] = [[other, value]];
    }
  });

  let query: { [index: string]: any } = {};
  //iterable object
  for (let key in _arr) {
    for (let [keys, value] of _arr[key]) {
      let temp = value;
      for (let i = keys.length - 1; i >= 0; i--) {

        let [, k = null] = /\[(\S+)\]/.exec(keys[i]) || [];
        //keys[i]==[]
        if (k == null) {
          temp = [temp];
        } else {
          temp = {
            [k]: temp
          }
        }
      }
      if (Object.prototype.toString.call(query[key]) === '[object Object]' && Object.prototype.toString.call(temp) === '[object Object]') {
        query[key] = deepObjMerge(query[key], temp);
      } else if (Object.prototype.toString.call(query[key]) === '[object Array]' && Object.prototype.toString.call(temp) === '[object Array]') {
        query[key] = deepArrMerge(query[key], temp);
      } else {
        query[key] = temp;
      }
    }
  }

  for (let key in query) {
    if (Object.prototype.toString.call(query[key]) === '[object Object]') {

      query[key] = objectToArray(query[key]);
    }
  }
  //将如果object转换位array
  return query;
}
function objectToArray(obj: { [index: string]: any }) {
  let flag = true;
  for (let key in obj) {
    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      obj[key] = objectToArray(obj[key]);
    }
  }
  let keys = Object.keys(obj);
  let values: Array<any> = [];
  keys.forEach((item, index) => {
    if (keys.indexOf(index + '') == -1) {
      flag = false;
      return false;
    }
    values.push(obj[item]);
  });
  return flag ? values : obj;
}
function deepObjMerge(obj1: { [index: string]: any }, obj2: { [index: string]: any }) {
  for (let key in obj2) {
    obj1[key] = (
      obj1[key]
      && Object.prototype.toString.call(obj1[key]) === '[object Object]'
      && Object.prototype.toString.call(obj2[key]) == '[object Object]')
      ? deepObjMerge(obj1[key], obj2[key]
      ) : obj2[key];
  }
  return obj1;
}
function deepArrMerge(arr1: Array<any>, arr2: Array<any>) {
  for (let key in arr2) {
    arr1[key] = (arr1[key] && Object.prototype.toString.call(arr1[key]) === '[object Array]' && Object.prototype.toString.call(arr1[key]) == '[object Object]') ? deepArrMerge(arr1[key], arr2[key]) : arr2[key];
  }
  return arr1;
}

export default {
  stringify, parse,
}