// import DocApi from '../doc/docApi'
import type { DocApi } from 'doc-pre-data'
import type { ModelList, ApifoxConfig } from '../types/types'
export type DocListItem = { docApi: DocApi; moduleName?: string; origin: ModelList | ApifoxConfig }
