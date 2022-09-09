const fs = require('fs')
const path = require('path')

module.exports = {
  /**
   *
   * @param {*} path
   * @param {*} rules 例如：‘a.b.c + 1’ 数学表达式 a:b:c 代表package.json重的版本号
   */
  changeVersion(ruleStr = 'a.b.c + 1') {
    const projRoot = process.env.PWD
    const filePath = path.resolve(projRoot, './package.json')

    const packageJSON = require(filePath)
    const versions = (packageJSON.version || ('0.0.0')).split('.')

    const _ruleStr = ruleStr.replace(/(a|b|c)/g, (match, p1) => {
      const index = p1.charCodeAt(0) - 97
      return versions[index]
    })


    const newVersion = _ruleStr
      .split('.')
      .map((expression) => {
        return eval(expression)
      })
      .join('.')

    packageJSON.version = newVersion
    fs.writeFileSync(filePath, JSON.stringify(packageJSON,null,2))

    console.log(`新版本号: ${newVersion}`)
    return packageJSON
  },
}
