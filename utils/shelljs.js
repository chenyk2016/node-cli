const shell = require('shelljs')
const chalk = require('chalk')

const exec = shell.exec
shell.exec = function (commend, opt, cb) {
  shell.echo(chalk.blue(`${commend}`))
  return exec(commend, opt, cb)
}

module.exports = shell