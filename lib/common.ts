
/**
 * 解码url
 * @param str 
 */
export function decodeURL(str: string): string {

  return decodeURI(str);
}
/**
 * 编码url
 * @param str 
 */
export function encodeURL(str: string): string {
  return encodeURI(str);
}
/**
 * 编码参数值
 * @param str 
 */
export function encodeParams(str: string): string {
  return encodeURIComponent(str);
}
/**
 * 解码参数值
 * @param str 
 */
export function decodeParams(str: string): string {
  return decodeURIComponent(str);
}
