#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const tinify = require('tinify')
const { spawnSync, execSync } = require('child_process')

// 跳过合并
const status = execSync('git status', {
  encoding: 'utf-8'
})

if (/merge|合并/i.test(status.split('\n'))) {
  process.exit(0)
}

// 获取参数
const args = process.argv.slice(2)
const argsKeyIndex = args.findIndex((arg) => ['-k', '--key'].includes(arg))
const argsKeyValue = argsKeyIndex !== -1 ? args[argsKeyIndex + 1] : undefined

// 读取.tinycompress.cjs, 获取tiny-compress的配置
const tinyConfigPath = path.join(process.cwd(), '.tinycompress.cjs')
const tinyConfigContent = fs.readFileSync(tinyConfigPath).toString()

let tinyConfig = {}
eval(`tinyConfig = ${tinyConfigContent}`)

if(!tinyConfig || !tinyConfig.compress) {
  process.exit(0)
}

if ((!tinyConfig.keys || tinyConfig.keys.length === 0) && !argsKeyValue) {
  throw Error('tiny-compress缺少key')
}

const keys = []
const length = tinyConfig.keys.length || 0
for (let i = 0; i < 31; i++) {
  if(length === 0) {
    keys.push(argsKeyValue)
  }
  else {
    let index = i % length
    keys.push(tinyConfig.keys[index]);
  }
}
tinify.key = keys[new Date().getDate() - 1]

// 读取忽略的文件列表
let ignore = []
if (tinyConfig.ignore) {
  ignore = tinyConfig.ignore
}

// 过滤图片
const files = args.filter((file) => /\.(png|jpg|jpeg)$/.test(file))
if (files.length === 0) {
  process.exit(0)
}

const tasks = []
files.forEach((path) => {
  if (ignore.some((key) => path.includes(key))) return
  tasks.push(tinify.fromFile(path).toFile(path))
})

Promise.all(tasks).then(() => {
  const { status } = spawnSync('git', ['add', ...files])
  process.exit(status)
})
