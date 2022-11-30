const dataStr = '\\{\\s*(dataKey)\\s*:\\s*(\\S+)\\s*\\}'
export const resTypeData = new RegExp(`\\s*\\[\\s*("|')${dataStr}("|')\\s*\\]`)
export const resTypeDataKey = new RegExp(dataStr)

const typeKeyStr = '\\[(\\S+)\\]'
const typeNameStr = '\\{typeName\\}'
export const TypeDataKey = new RegExp(`${typeNameStr}${typeKeyStr}`) // /\{typeName\}\[(\S+)\]/
export const resTypeNameKey = new RegExp(typeNameStr) // /\{typeName\}/
