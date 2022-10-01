const Files = require("./files");
const shelljs = require('shelljs');

/**
 * 安全删除，将文件移动到回收站
 * @param {*} path
 */
function safeDelete(path) {
  const name = Files.getNameFormPath(path)
  shelljs.exec(`mv ${path} ~/.Trash/${name}_${Math.random()}`)
}
