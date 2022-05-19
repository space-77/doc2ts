const path = require('path')
const fs = require('fs-extra')

const source = path.join(__dirname, '../src/temp')
const destination = path.join(__dirname, '../dist/temp')

// 将源文件夹复制到目标
fs.copy(source, destination, function (err) {
  if (err) {
    console.log('An error occured while copying the folder.')
    return console.error(err)
  }
  console.log('Copy completed!')
})
