const path = require('path')
const fs = require('fs-extra')

fs.emptyDirSync(path.join(__dirname, '../lib'))

const sourceTemp = path.join(__dirname, '../src/temp')
const destinationTemp = path.join(__dirname, '../lib/temp')


// 将源文件夹复制到目标
fs.copy(sourceTemp, destinationTemp, function (err) {
  if (err) console.log('An error occured while copying the folder.')
})

const sourceType = path.join(__dirname, '../src/types')
const destinationType = path.join(__dirname, '../lib/types')

// 将源文件夹复制到目标
fs.copy(sourceType, destinationType, function (err) {
  if (err) console.log('An error occured while copying the folder.')
})
