const os = require('os')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const boxen = require('boxen')
const cmd = require('../lib/utils/cmd').default
const { compare, compareVersions } = require('compare-versions')

const homeDirectory = os.homedir()
const homeDir = path.join(homeDirectory, '.doc2ts')
const cachePath = path.join(homeDir, 'cache.json')
const package = require(path.join(__dirname, '../package.json'))

async function getVersion() {
  try {
    const cache = getCache()
    const { time } = cache
    if (time && Date.now() - new Date(time).getTime() < 1000 * 60 * 60 * 4) return

    const versions = (await cmd(`npm view ${package.name} versions`)).replace(/'/g, '"')
    const [version] = JSON.parse(versions)
      .filter(i => /^(\d+\.){2}\d+$/.test(i))
      .sort(compareVersions)
      .reverse()

    cache.lineVersion = version
    cache.time = new Date()
    fs.writeFileSync(cachePath, JSON.stringify(cache))
  } catch (error) {}
}

function getCache() {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(homeDir, { recursive: true })
    fs.writeFileSync(cachePath, '{}')
  }
  return require(cachePath)
}

function showTips(version, newVersion) {
  console.log(
    boxen(
      `\
Update available! ${chalk.red(version)} → ${chalk.green(newVersion)}.
${chalk.magenta('Homepage:')} ${package.homepage}
Run "${chalk.magenta('npm install -g doc2ts')}" to update.`,
      {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round'
      }
    )
  )
}

function compareVersion() {
  const version = package.version

  const { lineVersion } = getCache()
  if (!lineVersion) return
  if (compare(lineVersion, version, '>')) showTips(version, lineVersion)
}

module.exports = {
  showTips,
  getCache,
  getVersion,
  compare: compareVersion
}
