import { IApiClient, IRequestParams } from "doc2ts";

export default class ApiClient implements IApiClient {
  request(config: IRequestParams): Promise<any> {
    // TODO 需自行实现请求逻辑
    return Promise.reject("需自行实现请求逻辑");
  }

  downloadFile(config: IRequestParams): Promise<any> {
    // TODO 需自行实现下载逻辑
    return Promise.reject("需自行实现请求逻辑");
  }
}
