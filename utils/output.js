const chalk = require('chalk')


function log(msg) {
  console.log(msg)
}

module.exports = {
  info(msg) {
    log( chalk.bgCyan(msg) )
  },
  success(msg) {
    log( chalk.bgGreen(msg) )
  },
  warn(msg) {
    log( chalk.bgYellow(msg) );
  },
  fail(msg) {
    log( chalk.bgRed(msg) );
  },
  error(msg) {
    log( chalk.bgRed(msg) );
  },
}