import BaseClass from './baseClass'
import type * as mT from '../types/file'

/**
 * @description File Controller
 */
export default class File extends BaseClass {
  /**
   * @name fileUploadUsingPOST
   * @description fileUpload
   */
  fileUpload: mT.FileUpload = file => {
    const formData = this.formData({ file })
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    const url = '/fileUpload'
    const config = { url, headers, formData, method: 'post' }
    return this.request(config)
  }
}

export const file = new File()
