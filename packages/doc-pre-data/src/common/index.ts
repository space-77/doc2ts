export const commonTypeKey = '__common__'
export type HttpMethods = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'
export const httpMethods: HttpMethods[] = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']
export const httpMethodsReg = new RegExp(httpMethods.join('|'), 'i')

