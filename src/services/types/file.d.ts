import type * as defs from './type'
export interface FileUploadParam {
  /** @description file */
  file: File
}
export type FileUploadBody = defs.GeneralResponseBody<defs.JSONObject>
export type FileUpload = (file: FileUploadParam['file']) => Promise<[any, FileUploadBody['data'], FileUploadBody]>
