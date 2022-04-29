import path from 'path'
import chalk from 'chalk'
// const path = require('path')
// const chalk = require('chalk')

// export function getPaht(url) {
//   const newUrl = /\/$/.test(url) ? `${url}index` : `${url}/index`
//   const { dir } = path.parse(path.resolve(__dirname, '../', newUrl))
//   return dir
// }

class Log {
  info(text: string) {
    console.log(chalk.blue('[doc2ts] '), text)
  }

  error(text: string) {
    console.log(chalk.red('[doc2ts] '), text)
    // return chalk.red(text)
  }

  warning(text: string) {
    return chalk.yellow(text)
  }

  log(text: string) {
    console.log(text)
  }

  done(text: string) {
    return chalk.bgHex('#0DBC79')(text)
  }

  success(text: string) {
    console.log(chalk.hex('#0DBC79')('[doc2ts] '), text)
    // return chalk.hex('#0DBC79')('[doc2ts] ')
  }

  link(text: string) {
    return chalk.hex('#42a5f5').underline(text)
  }

  ok() {
    this.success(this.done(' DONE '))
  }

  clear() {
    const lines = process.stdout.getWindowSize()[1]
    for (let i = 0; i < lines; i++) {
      console.log('\r\n')
    }
    console.clear()
  }
}

export default new Log()
