#!/usr/bin/env node

/**
 * 通过方法直接注入文件到本地
 *
 */
const path = require('path')
const { program } = require('commander')
const { version } = require(path.resolve('./package.json'))
const shell = require('../utils/shelljs')
const chalk = require('chalk')
program.version(version)

program
  .command('list')
  .description('列出可注入的所有文件')
  .action(() => {

  })