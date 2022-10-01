#!/usr/bin/env node

const path = require('path');
const { program } = require('commander')
const { version } = require(path.resolve(__dirname, '../package.json'))

const shell = require('../utils/shelljs')

require('./git/index.js')
require('./temp/index.js')
// require('./others/gbc-remote');
require('./others2/gbc-publish');

program.command('npm <originName>')
.description('修改npm仓库源地址')
.action((originName = 'npm') => {
  const originMap = {
    'npm': 'registry https://registry.npmjs.org',
    'taobao': 'registry https://registry.npm.taobao.org',
  }

  const origin = originMap[originName]

  if (origin) {
    shell.exec(`npm config set ${origin} --global`)
  }
})




program.version(version)
program.parse(process.argv)