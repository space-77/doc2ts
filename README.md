# doc2ts
## 功能
- 根据 swagger文档 生产 ts 接口请求工具

## 启动
在项目根目录新建 `doc2ts.config.ts` 文件，文件必须导出一个对象 ` export default  = {}`， 对象必须是 ` Doc2tsConfig ` 类型。

## Doc2tsConfig 配置说明
> 使用建议：不要修改自动生成文件里的内用，应该尽量通过修改配置文件方式重新生成新的文件内容，因为内生成一次文件，文件里的内容都是新的，不会保留就文件内容。

| 参数 | 必传 | 类型 | 默认 | 说明 | 
| :---: | :--- | :--- | :--- | :--- |
| `originUrl` | 是 | String |  | swagger 文档的 eg: http://xx:7001
| `outDir` | 否 | String | `./services` | 文件输出的位置
| `returnType` | 否 | String | `T` | 控制 `IApiClient` 的 `request` 方法返回Promise的类型
| `advanceKey` | 否 | String |  | 整理 returnType 的 默认类型, 根据返回数据的某个key的值做为新的返回类型，<br/>注意： 在 实现 IApiClient 接口的 request 方法，也需要做响应的处理
| `config` | 否 | Object | {} | 模块配置信息

