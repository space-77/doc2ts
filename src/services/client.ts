import type { IApiClient, DocReqConfig } from "doc2ts";

export default class ApiClient implements IApiClient {
  request(config: DocReqConfig): Promise<any> {
    // TODO 需自行实现请求逻辑
    return Promise.reject("需自行实现请求逻辑");
  }
}
