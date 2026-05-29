import { describe, it } from 'node:test'
import assert from 'node:assert'
import { camel2Kebab, firstToUpper, firstToLower, isKeyword } from '../src/utils/index'

describe('Utils 工具函数单元测试', () => {
  it('camel2Kebab 应当成功将烤串命名转为小驼峰', () => {
    assert.strictEqual(camel2Kebab('api-user-info'), 'apiUserInfo')
    assert.strictEqual(camel2Kebab('user-list'), 'userList')
    assert.strictEqual(camel2Kebab('some-very-long-dashed-name'), 'someVeryLongDashedName')
  })

  it('firstToUpper 应当成功使首字母大写', () => {
    assert.strictEqual(firstToUpper('hello'), 'Hello')
    assert.strictEqual(firstToUpper('World'), 'World')
    assert.strictEqual(firstToUpper('a'), 'A')
  })

  it('firstToLower 应当成功使首字母小写', () => {
    assert.strictEqual(firstToLower('Hello'), 'hello')
    assert.strictEqual(firstToLower('world'), 'world')
    assert.strictEqual(firstToLower('A'), 'a')
  })

  it('isKeyword 应当正确判断JS关键字及核心内部保留词', () => {
    assert.strictEqual(isKeyword('body'), true)
    assert.strictEqual(isKeyword('url'), true)
    assert.strictEqual(isKeyword('headers'), true)
    assert.strictEqual(isKeyword('class'), true) // JS 语言级别保留词
    assert.strictEqual(isKeyword('const'), true) // JS 语言级别保留词

    assert.strictEqual(isKeyword('userName'), false)
    assert.strictEqual(isKeyword('fetchData'), false)
  })
})
