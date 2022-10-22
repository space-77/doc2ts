import Puppeteer from './puppeteer'

const url = 'http://114.115.202.183:8088/doc.html'
const p = new Puppeteer(url)

!(async () => {
  try {
    await p.init()
    p.getConfigFileAst()
    // const res = await p.start()
    // console.log(res)
  } catch (error) {
    console.error(error)
  }
})()
