import { url, } from '../lib';

console.log(url.parse('//www.baidufaf.112.com///1/sf///?a=bdfbsf&b=2#fff'))
console.log(url.stringify({
    protocol: 'http',
    hostname: 'www.baidu.com',
    port: 9900,
    pathname: '/af/f/f/fa/faf',
    query: {
        a: 1,
        b: 3,
        c: [1, 3]
    },
    hash: '1'
}))
console.log(url.normalize("//www.baodu.com//ad///dad/"))