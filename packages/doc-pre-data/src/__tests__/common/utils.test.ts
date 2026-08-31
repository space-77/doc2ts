import { firstToUpper, getMaxSamePath, sanitizeIdentifier } from '../../common/utils'

describe('firstToUpper', () => {
  it('should capitalize the first character of a string', () => {
    expect(firstToUpper('hello')).toBe('Hello')
    expect(firstToUpper('world')).toBe('World')
  })

  it('should handle empty string', () => {
    expect(firstToUpper('')).toBe('')
  })

  it('should handle single character strings', () => {
    expect(firstToUpper('a')).toBe('A')
    expect(firstToUpper('z')).toBe('Z')
  })

  it('should handle strings with leading whitespace', () => {
    expect(firstToUpper(' hello')).toBe(' hello')
    expect(firstToUpper('  world')).toBe('  world')
  })

  it('should handle already capitalized strings', () => {
    expect(firstToUpper('Hello')).toBe('Hello')
    expect(firstToUpper('WORLD')).toBe('WORLD')
  })
})

describe('getMaxSamePath', () => {
  it('should return empty string when paths array is empty', () => {
    expect(getMaxSamePath([])).toBe('')
  })

  it('should return samePath when some path does not contain slash', () => {
    expect(getMaxSamePath(['a/b/c', 'abc'])).toBe('')
    expect(getMaxSamePath(['a/b/c', 'abc'], '/prefix')).toBe('/prefix')
  })

  it('should find common path segments', () => {
    expect(getMaxSamePath(['a/b/c', 'a/b/d'])).toBe('/a/b')
    expect(getMaxSamePath(['x/y/z', 'x/y/w'])).toBe('/x/y')
  })

  it('should handle paths with different first segments', () => {
    expect(getMaxSamePath(['a/b/c', 'd/b/c'])).toBe('')
    expect(getMaxSamePath(['a/b/c', 'd/b/c'], '/prefix')).toBe('/prefix')
  })

  it('should handle nested paths', () => {
    expect(getMaxSamePath(['a/b/c/d', 'a/b/c/e/f'])).toBe('/a/b/c')
    expect(getMaxSamePath(['x/y/z/1', 'x/y/z/2/3'])).toBe('/x/y/z')
  })

  it('should respect initial samePath value', () => {
    expect(getMaxSamePath(['a/b/c', 'a/b/d'], '/prefix')).toBe('/prefix/a/b')
    expect(getMaxSamePath(['x/y/z', 'x/y/w'], '/base')).toBe('/base/x/y')
  })

  it('should return full path when all paths are identical', () => {
    expect(getMaxSamePath(['a/b/c', 'a/b/c'])).toBe('/a/b/c')
    expect(getMaxSamePath(['x/y/z', 'x/y/z'])).toBe('/x/y/z')
  })

  it('should return full path when all paths are identical', () => {
    expect(getMaxSamePath(['a/b/c', '/a/b/c'])).toBe('/a/b/c')
    expect(getMaxSamePath(['x/y/z', '/x/y/z'])).toBe('/x/y/z')
  })
})

describe('sanitizeIdentifier', () => {
  it('should replace dots with underscores', () => {
    expect(sanitizeIdentifier('Internal_server.Envelope')).toBe('Internal_server_Envelope')
    expect(sanitizeIdentifier('Workbuddy2api_internal_store.CreditBucket')).toBe(
      'Workbuddy2api_internal_store_CreditBucket'
    )
  })

  it('should replace hyphens with underscores', () => {
    expect(sanitizeIdentifier('Internal_server-Envelope')).toBe('Internal_server_Envelope')
    expect(sanitizeIdentifier('X-Account-UID')).toBe('X_Account_UID')
  })

  it('should replace spaces with underscores', () => {
    expect(sanitizeIdentifier('hello world')).toBe('hello_world')
  })

  it('should keep valid identifier characters unchanged', () => {
    expect(sanitizeIdentifier('WorkbuddyAccount')).toBe('WorkbuddyAccount')
    expect(sanitizeIdentifier('_private$name')).toBe('_private$name')
  })

  it('should prefix underscore when name starts with a digit', () => {
    expect(sanitizeIdentifier('123abc')).toBe('_123abc')
  })

  it('should sanitize leading dot to underscore', () => {
    expect(sanitizeIdentifier('.leading')).toBe('_leading')
  })
})

