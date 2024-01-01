# tiny-compress
一款自动压缩图片的插件
## 介绍
`tiny-compress`能够在图片资源提交到代码库之前自动将资源进行压缩，配合lint-stage，将压缩融入到工作流程中
## 安装
```
npm i tiny-compress -D
```
## 使用
需要先安装`lint-staged`，然后在`lint-staged.config.js`添加一条：
``` js
module.exports = {
  '*.{png,jpg,jpeg}': 'tiny-compress',
}
```
或在package.json中配置：
```json
{
  "lint-staged": {
    "*.{png,jpg,jpeg}": "tiny-compress"
  }
}
```
或直接通过命令行进行压缩：
```
npx tiny-compress --key yourKey imagePath1 imagePath2
```
## 在.tinycompress.cjs中配置
`tiny-compress`可以读取.tinycompress.cjs中的配置，获取tiny的key数组，这些key数组在每个月内都会循环调用这些key，比如配置31个key，在这31天内，每天都会调用不同的key
```
module.exports = {
  compress: false, // 是否压缩
  keys: [
    'fdMSDT5tHW44GLybS57DJ402pKZ4XfVL',
    'FynyQQ2xmHnKMCw2Dqc8jDbw1JtXBwqy',
    'JJD4CDBGdCDtppxk3H9gHp8Gcg2g35zw',
    'kk8Dy5v2DvRflztpGcl1Rj6VvwYxgqQM',
    'kP2LVxql6Ny0jzsSlFFckd9GSYW0fVnS',
  ],
  ignore: ['1.jpg', '2.jpg'],
};
```
## 申请key
可在[tinypng官网](https://tinypng.com/developers)申请key，每月可免费压缩500个图片
# tiny-compress
