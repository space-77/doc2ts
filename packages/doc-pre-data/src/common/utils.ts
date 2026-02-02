import _ from 'lodash'
import checkChinese from 'is-chinese'
import TypeItem from 'src/docApi/typeItem'
import TypeInfoBase from 'src/docApi/components/base'

/**
 * @param str
 * @description 首字母大写
 */
export function firstToUpper(str: string) {
  return str.replace(/^(\S)/g, val => val.toUpperCase())
}

/**
 * 获取路径数组中所有路径的最大公共路径
 * @param paths 路径数组，如 ['a/b/c', 'a/b/d']
 * @param samePath 当前已匹配的公共路径，默认为空字符串
 * @returns 最大公共路径字符串，如 '/a/b'
 */
export function getMaxSamePath(paths: string[], samePath = ''): string {
  // ['a/b/c', 'a/b/c']
  // if (!paths.length || paths.some(path => path === '')) return samePath
  if (!paths.length || paths.some(path => !path.includes('/'))) return samePath

  const segs = paths.map(path => {
    const [firstSeg, ...restSegs] = path.split('/')
    return { firstSeg, restSegs }
  })

  if (segs.every((seg, index) => index === 0 || seg.firstSeg === segs[index - 1].firstSeg)) {
    return getMaxSamePath(
      segs.map(seg => seg.restSegs.join('/')),
      samePath + '/' + segs[0].firstSeg
    )
  }

  return samePath
}

export function getSameName(names: string[]) {
  let sameNames: string[] = []
  const nameItems = names.map(name => _.startCase(name).split(' '))

  const minLength = Math.min(...nameItems.map(i => i.length))
  if (minLength <= 0) return sameNames.join('/')

  for (let i = 0; i < minLength; i++) {
    const consult = nameItems[0][i]
    const equal = nameItems.every(nameList => nameList[i] === consult)
    if (equal) {
      sameNames.push(consult)
    } else {
      break
    }
  }

  let sameName = sameNames.join('')

  if (names.some(name => sameName === name)) {
    // 存在某个名字都是最下名字，需要保留一个单词
    sameNames.pop()
    sameName = sameNames.join('')
  }

  return sameName
}

/**
 * 获取字符串数组的公共前缀
 * @param strs 字符串数组
 * @returns 公共前缀字符串
 */
export function getCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return ''

  // 以第一个字符串作为基准
  let prefix = strs[0]

  for (let i = 1; i < strs.length; i++) {
    // 逐个字符比较
    while (strs[i].indexOf(prefix) !== 0) {
      // 如果不匹配，缩短前缀
      prefix = prefix.substring(0, prefix.length - 1)
      // 如果前缀为空，直接返回
      if (prefix === '') return ''
    }
  }

  return prefix
}

export function toUpperFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function getIdentifierFromUrl(url: string, requestType: string, samePath = '') {
  const currUrl = url.slice(samePath.length)?.match(/([^\.]+)/)?.[0] as string

  return (
    requestType +
    currUrl
      .split('/')
      .map(str => {
        if (str.includes('-')) {
          str = str.replace(/(\-\w)+/g, (_match, p1) => {
            if (p1) return p1.slice(1).toUpperCase()
          })
        }

        if (str.match(/^{.+}$/gim)) {
          return 'By' + toUpperFirstLetter(str.slice(1, str.length - 1))
        }
        return toUpperFirstLetter(str)
      })
      .join('')
  )
}

export function isWordCharacter(character: string | number) {
  return /\w/.test(typeof character === 'number' ? String.fromCharCode(character) : character.charAt(0))
}

// export function formatRefTag(ref: string) {
//   const startTag = '«'
//   const endTag = '»'
//   const reg = new RegExp(`${startTag}.+${endTag}`)
//   if (!reg.test(ref)) return ref
//   const { body } = balanced(startTag, endTag, ref) ?? {}
// }

export function isObject(obj: any) {
  return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}

export function getEnumType(type: string, enumTypes: any[] = []) {
  if (enumTypes.length > 0) {
    if (type === 'string') return enumTypes.map(i => `"${i}"`).join(' | ')
    return enumTypes.join(' | ')
  }
  return type
}

/**
 * @param name
 * @param checkFun 不成立条件【继续改名的条件】
 */
export function checkName(name: string, checkFun: (name: string) => boolean): string {
  const hasName = checkFun(name)
  const lastNumReg = /((?!0)\d+)$/

  if (hasName) {
    let newName = ''
    if (!lastNumReg.test(name)) {
      newName = `${name}1`
    } else {
      newName = name.replace(lastNumReg, $1 => `${Number($1) + 1}`)
    }
    return checkName(newName, checkFun)
  }
  return name
}

export const tsKeyword = new Set([
  'URL',
  'File',
  'Blob',
  'JSON',
  'Date',
  'Array',
  'String',
  'RegExp',
  'Object',
  'Number',
  'Boolean',
  'Promise',
  'Function',
  'ArrayBuffer',
  'URLSearchParams',

  // ts 映射类型  https://www.typescriptlang.org/docs/handbook/utility-types.html
  'Omit',
  'Pick',
  'Record',
  'Awaited',
  'Partial',
  'Exclude',
  'Extract',
  'Required',
  'ThisType',
  'Readonly',
  'Parameters',
  'ReturnType',
  'NonNullable',
  'InstanceType',
  'ThisParameterType',
  'OmitThisParameter',
  'ConstructorParameters'
])

/**
 * @description 监测需要定义的类型名字是不是Ts已经使用的名称，如 File, URL, URLSearchParams 等等
 */
export function checkTsTypeKeyword(typeName: string): string {
  if (tsKeyword.has(typeName)) return `My${typeName}`
  return typeName
}

export function transformCamelCase(name: string) {
  let words: string[] = []
  let result = ''

  if (name.includes('-')) words = name.split('-')
  else if (name.includes(' ')) words = name.split(' ')
  else {
    if (typeof name === 'string') result = name
    else throw new Error('mod name is not a string: ' + name)
  }

  if (words && words.length) {
    result = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')
  }

  result = result.charAt(0).toLowerCase() + result.slice(1)

  if (result.endsWith('Controller')) {
    result = result.slice(0, result.length - 'Controller'.length)
  }

  return result
}

export function isChinese(text: string) {
  return checkChinese(text, { includePunctuation: false })
}

export function isWord(text: string): boolean {
  if (isWordCharacter(text)) return true
  return isChinese(text)
}

export function fixStartNum(text: string) {
  return text.replace(/^\d+\S+/, $1 => `n${$1}`)
}

// 处理 anyOf 和 oneOf 的通用函数 - 直接修改原有 item 属性
const processCompositeType = (typeList: TypeItem[][], typeName: 'anyOf' | 'oneOf'): TypeItem[] => {
  return typeList.flatMap((typeItems, index) =>
    typeItems.map(item => {
      // 直接在原有 item 上修改属性，避免重新创建对象
      item.required = false // 复合类型的属性应该是可选的
      item.description = `${item.description || ''} (${typeName} option ${index + 1})`.trim()
      return item
    })
  )
}

// 合并 allOf 类型
export function mergeTypeOf(data: TypeInfoBase | TypeItem, types: TypeItem[], startNum = 0) {
  const { allOf, anyOf, oneOf } = data

  // allOf ,所有类型结合在一起
  if (allOf.length > startNum) {
    const [first = [], ...rest] = allOf
    types.push(...first)
    for (let i = 0; i < rest.length; i++) {
      const typeList = rest[i]
      for (let j = 0; j < typeList.length; j++) {
        const item = typeList[j]
        const fIndex = types.findIndex(i => i.name === item.name)
        if (fIndex !== -1) types[fIndex] = item
        else types.push(item)
      }
    }
  }

  // anyOf, 任意一个类型满足即可 - 使用联合类型表示
  if (anyOf.length > 0) {
    types.push(...processCompositeType(anyOf, 'anyOf'))
  }

  // oneOf, 其中一个类型满足 - 使用 discriminated union 或可选属性
  if (oneOf.length > 0) {
    types.push(...processCompositeType(oneOf, 'oneOf'))
  }
}

