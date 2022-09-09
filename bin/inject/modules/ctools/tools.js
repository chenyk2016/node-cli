/**
 * 获取数据类型
 * @param {*} 数据
 * @returns
 */
export function getType (v) {
  return Object.prototype.toString
    .call(v)
    .replace(/\[object\s(\w+)\]/, '$1')
    .toLowerCase()
}