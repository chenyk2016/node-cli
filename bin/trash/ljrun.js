#!/usr/bin/env node

// lj项目启动脚本，使用lerna启动某个项目，项目
// use: `lerna run <project>`

const fs = require('fs')
const path = require('path');
const shell = require('shelljs')
const packageJsonPath = path.resolve(__dirname, './package.json')
const packageJson = require(packageJsonPath);

const foldName = process.argv[2]
packageJson.workspaces = [
  `${foldName}/*`
]
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson,null,2))

shell.exec('lerna run start');
