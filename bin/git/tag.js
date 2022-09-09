const packageJSON = require('../utils/packageJSON')
const shell = require('shelljs')
const argv = require('yargs')

module.exports = class Tag{
  constructor(commendName = '_default') {
    this.params = argv.argv;

    if(typeof this[commendName] !== 'function') {
      shell.echo(`git tag ${commendName} 命令不存在`)
    } else {
      this[commendName]()
    }
  }

  _echo () {
    shell.echo('cgit tag ')
  }

  _default () {
    argv.demand(['h'])
      .default({h: true})
      .describe({h: 'help'})
      .argv

    if(argv.h) {

      shell.echo('cgit tag 所有命令')
    }
  }


  ['new'] () {
    const version = packageJSON.changeVersion().version
    shell.exec(`git tag ${version}`)
    shell.exec(`git push origin ${version}`)
    shell.echo(`tag ${version} 提交成功`)
  }

  ['delete'] () {

  }
}