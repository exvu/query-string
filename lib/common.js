"use strict";
exports.__esModule = true;
/**
 * 解码url
 * @param str
 */
function decodeURL(str) {
    return decodeURI(str);
}
exports.decodeURL = decodeURL;
/**
 * 编码url
 * @param str
 */
function encodeURL(str) {
    return encodeURI(str);
}
exports.encodeURL = encodeURL;
/**
 * 编码参数值
 * @param str
 */
function encodeParams(str) {
    return encodeURIComponent(str);
}
exports.encodeParams = encodeParams;
/**
 * 解码参数值
 * @param str
 */
function decodeParams(str) {
    return decodeURIComponent(str);
}
exports.decodeParams = decodeParams;
