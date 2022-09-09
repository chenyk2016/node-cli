#!/usr/bin/env node
const path = require('path')
const { version } = require(path.resolve('./package.json'))
const { program } = require('commander')
const shell = require('../utils/shelljs')
const chalk = require('chalk')

program.version(version)



program.parse(process.argv)
