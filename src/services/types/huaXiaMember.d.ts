import type * as defs from './type'
export interface SendSmsParam {
  /** @description smsRequestDTO */
  smsRequestDTO: defs.MessageAuthentication
}
export type SendSmsBody = defs.GeneralResponseBody<defs.JSONObject>
export type SendSms = (smsRequestDTO: SendSmsParam['smsRequestDTO']) => Promise<[any, SendSmsBody['data'], SendSmsBody]>
