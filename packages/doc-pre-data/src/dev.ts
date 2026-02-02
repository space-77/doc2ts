import fs from 'fs'
import path from 'path'
import { TranslateType } from './common/translate'
import docInit from './index'
// // import api from '../output'
// import axios from 'axios'
// import cheerio from 'cheerio'
// import { bingTranslator } from 'node-translates'

// ~(async () => {
//   const text = await bingTranslator(['唧唧复唧唧', '木兰当户织'])
//   console.log(text)
// })()

// import fs from 'fs'
// import path from 'path'
// import balanced from 'balanced-match'

// // openapi3 说明文档 https://www.cnblogs.com/yaohl0911/p/14567915.html
// // openapi3 中文文档 https://fishead.gitbook.io/openapi-specification-zhcn-translation/3.0.0.zhcn#jie-shao

// // console.log(balanced("«", "»", "通用响应体«List«MyBatisDemo响应体»»"));

// // const str = '我#获取我一#特殊符号#获取我二#之间#获取我三#的内容'
// // const pattern = /#(.+?)#/g
// // const text = str.match(pattern) ?? ''
// // console.log(text.toString().replace(/(#)/g, ''))

// // https://generator3.swagger.io/index.html
// const url = 'http://localhost:9528/api.json'
// const url = 'https://omtest.gtcloud.cn/v2/api-docs'
// const url = 'http://tlfete.cfldcn.com:8088/v2/api-docs'
const url = 'http://8.130.142.178:9095/openapi.json'

// const url = 'http://124.70.8.166/manage/v2/api-docs'
// const url = 'http://tlfete.cfldcn.com:9100/v2/api-docs'
// const url = 'http://114.115.202.183:8088/v2/api-docs'
// const url = 'https://petstore.swagger.io/v2/swagger.json'
// const url = 'https://generator3.swagger.io/openapi.json'
// const url = 'https://mock.mengxuegu.com/mock/6384cdec9433403d6c06894e/openapi3/mock'

// const json = require(path.join(__dirname, '../mock/api1.json'))
const json = require(path.join(__dirname, '../mock/test123456.json'))
// // const openapi = new OpenApi(url)
const dictPath = path.join(__dirname, '../mock/dict.json')
// var traverse = require('traverse')
import traverse from 'traverse'

~(async () => {
  // var obj = {
  //   a: [1, 2, 3],
  //   b: 4,
  //   c: [5, 6],
  //   d: { e: [7, 8], f: 9 }
  // }

  // const leaves = []

  // try {
  //   console.log(typeof json)
  // } catch (error) {
  //   console.error(error)
  // }

  // traverse(json).map(async function (acc) {
  //   const { key, parent, isRoot } = this
  //   console.log({ isRoot })
  //   if (isRoot) return this
  //   return this
  //   // console.log(this)
  //   // if (this.isLeaf) acc.push(x)
  //   // return acc
  // })

  // console.log(leaves)
  try {
    // console.log();
    // Object.values(json.paths).forEach((path: any) => {
    //   Object.values(path).forEach((method: any) => {
    //     console.log(method.tags)
    //   })
    // })

    const dict = require(dictPath) ?? []
    // const res = await docInit(url , dict, { translateType: TranslateType.none })
    const res = await docInit(json , dict, { translateType: TranslateType.ai, aiConfig: {
      apiKey: 'ms-76ebb4fb-0fcd-4e03-98f6-22e3f97365bf',
      baseURL: 'https://api-inference.modelscope.cn/v1',
      model: 'deepseek-ai/DeepSeek-V3.2',
      maxTokens: 2000,
      temperature: 0.3,
      enableThinking: true
    } })
    fs.writeFileSync(dictPath, JSON.stringify(res.dictList, null, 2))
    fs.writeFileSync(path.join(__dirname, '../mock/ai翻译.json'), JSON.stringify(res.docApi.json, null, 2))
  } catch (error) {
    console.error(error)
  }
})()

// // openapi.start({})
// // openapi.

// // const isChinese = require('is-chinese')

// // console.log(isChinese('a中文'));

// // swagger 格式转 openapi
// // const converter = require('swagger2openapi')
// // ~(async () => {
// //   try {
// //     const url = 'http://114.115.202.183:8088/v2/api-docs'
// //     const { data } = await axios.get(url)
// //     converter.convertObj(data, { components: true }, function (err: any, options: any) {
// //       if (err) return
// //       fs.writeFileSync(path.join(__dirname, '../mock/swagger2openapi2.json'), JSON.stringify(options.openapi))
// //     })
// //   } catch (error) {
// //     console.error(error)
// //   }
// // })()

// const { baiduTranslator, googleTranslator, youdaoTranslator, bingTranslator } = require('translators')

// bingTranslator('“犯规”、“推土机”、“下班”、“面具”、“玩具”、“圣诞节”、“集团”、“空间”、“接口”', 'zh', 'en', {
// // bingTranslator('推土机', 'zh', 'en', {
//   // Foul. Stacker. Work. Mask. Toy. Christmas. Clique. Space. interface
//   if_use_cn_host: false
// }).then((value: string) => {
//   console.log(value)
// })

// const { youdao, baidu, google } = require('translation.js')

// // “犯规”“堆土机”“下班”“面具”“玩具”“圣诞节”“集团”“空间”“接口”
// youdao.translate('“犯规”、“推土机”、“下班”、“面具”、“玩具”、“圣诞节”、“集团”、“空间”、“接口”').then((t: string) => {
// // youdao.translate('推土机').then((t: string) => {
//   // Foul.Earth-moving machine.after workMask.Toys.ChristmasGroup.Space.interface
//   // A foul...Earth-moving machine...after workThe mask...Toy...ChristmasGroup...Space...interface
//   console.log(t)
// })

// ~(async () => {
//   // https://translate.google.com/?hl=zh-CN&sl=zh-CN&tl=en&text=检、测、语、言&op=translate // google
//   // https://translate.volcengine.com/translate?category=&glossary_list[]=ailab%2Ftechfirm&home_language=zh&source_language=detect&target_language=en&text=自、动、检、测
//   // const { data } = await axios.get('https://fanyi.baidu.com/translate#zh/en/%E4%BD%A0%E3%80%82%E5%A5%BD%E3%80%82%E7%BF%BB%E3%80%82%E8%AF%91')
//   const { data } = await axios.post('https://fanyi.baidu.com/v2transapi?from=zh&to=en')
//   // console.log(data);
//   // const $ = cheerio.load(data)
//   // const achor = $('.ryNqvb')

//   // console.log(achor.text())
//   // achor.map((i, ele) => {
//   //   // console.log(i, ele)
//   //   console.log(ele.attribs);
//   // })
// })()

