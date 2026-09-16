import type { FileListItem } from '../types/types'

export const fileList: FileListItem[] = []

/**
 * @description 清空待写入文件列表，供每次 build 开始前重置模块级状态
 */
export function resetFileList() {
  fileList.length = 0
}
