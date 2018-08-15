import { hostname } from "os";
import Query from "./query";

// /**
//  * 规范参数
//  */
// interface NormalizeOptions {
//     //是否显示协议
//     protocol?: boolean,
//     //是否添加https
//     https?: boolean,
//     //是否添加http
//     http?: boolean,
//     //是否去掉末尾片段
//     stripFragment: boolean,
//     //移除某个query参数
//     removeQueryParameters: Array<string> | string,
//     //移除路劲末尾的/
//     removeTrailingSlash: boolean
// }
/**
 * url参数
 */
interface UrlOption {
    protocol?: string,
    host?: string,
    hostname?: string,
    port?: number,
    pathname?: string,
    query?: { [index: string]: any },
    hash?: string,

}
function stringify({ protocol, hostname = '', port = 80, pathname = '', query, hash = '' }: UrlOption): string {
    let url = (protocol ? (protocol + ':') : '') + '//' + hostname + (port == 80 ? '' : (':' + port)) + '/' + pathname + '/';
    let queryString = Query.stringify(query || {})
    if (queryString !== '') {
        url += '?' + queryString + (hash !== '' ? ('#' + hash) : '');
    }
    return normalize(url);
}
/**
 * 解析url
 * @param url 解析url各部分
 */
function parse(url: string): UrlOption {

    let match = url.match(/^((\S+?):)?\/\/(([0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)+)(:(\d{2,10}))?)((\/+[0-9a-zA-Z_-]+)*(\/+)?)(\??[^#]+)(#\S+)/);
    if (!match) {
        throw new Error('不合法的url');
    }
    const {
        '2': protocol,
        '3': host,
        '4': hostname,
        '7': port,
        '8': pathname,
        '11': query,
        '12': hash,
    } = match;
    return {
        protocol,
        host: port ? host : (host + ':' + 80),
        hostname,
        port: Number(port) || 80,
        pathname,
        query: Query.parse(query),
        hash: hash,
    }
}
/**
 * 规范url
 * @param url 
 */
function normalize(url: string) {
    return url.replace(/[^(\S+:)](\/{2,})/ig, 'z');
}


export default {
    stringify, parse, normalize,
}