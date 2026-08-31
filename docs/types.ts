/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA DOC2TS                        ##
 * ##                                                           ##
 * ## AUTHOR: space-77                                          ##
 * ## SOURCE: https://github.com/space-77/doc2ts                ##
 * ---------------------------------------------------------------
 */

export namespace EnumLists {}

export namespace __common__ {
  export interface Internal_server_Envelope {
    code?: number;
    data?: any;
    message?: string;
  }

  export interface Workbuddy2api_internal_store_CreditBucket {
    /**
     * @description 该时间桶内消耗的积分（= RemainStart - RemainEnd）
     */
    consumed?: number;
    /**
     * @description 时间桶结束时间
     */
    end?: string;
    /**
     * @description 桶内最晚快照的剩余积分
     */
    remain_end?: number;
    /**
     * @description 桶内最早快照的剩余积分
     */
    remain_start?: number;
    /**
     * @description 时间桶起始时间
     */
    start?: string;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_AccountsSelectionData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 按积分到期时间升序排列的候选账号列表
       */
      accounts?: Array<__common__.Workbuddy2api_internal_poolStatus>;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_AuditListData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 当前页的审计记录列表（不含 request_body/response_body）
       */
      items?: Array<__common__.Workbuddy2api_internal_storeChatAudit>;
      /**
       * @description 当前页码
       */
      page?: number;
      /**
       * @description 每页返回的数量
       */
      page_size?: number;
      /**
       * @description 符合筛选条件的审计记录总数
       */
      total?: number;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeworkbuddy2api_internal_store_ChatAudit {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 请求时间
       */
      created_at?: string;
      /**
       * @description 本次请求消耗积分（上游 usage.credit）
       */
      credit?: number;
      /**
       * @description 请求后账号剩余积分
       */
      credits_after?: number;
      /**
       * @description 请求时账号剩余积分
       */
      credits_before?: number;
      /**
       * @description 请求总耗时（毫秒）
       */
      duration_ms?: number;
      /**
       * @description 错误信息（成功为空）
       */
      error?: string;
      /**
       * @description 审计记录自增 ID
       */
      id?: number;
      /**
       * @description 请求的模型名称
       */
      model?: string;
      /**
       * @description 完整请求体（jsonb 文本）
       */
      request_body?: string;
      /**
       * @description 请求唯一标识（来自请求头 X-Request-ID）
       */
      request_id?: string;
      /**
       * @description 响应内容（非流式存完整 body，流式存聚合 content）
       */
      response_body?: string;
      /**
       * @description 响应 HTTP 状态码
       */
      status_code?: number;
      /**
       * @description 是否流式请求
       */
      stream?: boolean;
      /**
       * @description 首字响应时间（毫秒）
       */
      ttft_ms?: number;
      /**
       * @description 本次请求使用的账号唯一标识
       */
      uid?: string;
      /**
       * @description 上游返回的完整 token 用量（含 credit 等扩展字段，JSONB）
       */
      usage?: object;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeany {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: any;
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverSigninRequest {
    /**
     * @description 需要签到的账号 UID 列表；为空表示签到全部非禁用账号
     */
    uids?: Array<string>;
  }

  export interface Internal_serverEnvelopeinternal_server_SigninData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 每个账号的签到结果
       */
      results?: Array<__common__.Internal_serversigninResult>;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_StatsCreditsData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 每个时间桶内所有账号的最新快照信息与消费聚合
       */
      buckets?: Array<__common__.Workbuddy2api_internal_storeStatsBucket>;
      /**
       * @description 聚合维度：day/week/month
       */
      dimension?: string;
      /**
       * @description 查询起始时间
       */
      from?: string;
      /**
       * @description 查询区间内所有消费记录的聚合
       */
      summary?: {
        /**
         * @description 消费记录条数
         */
        request_count?: number;
        /**
         * @description 生成 token 总和
         */
        total_completion_tokens?: number;
        /**
         * @description 消耗积分总和（精确小数求和）
         */
        total_credit?: number;
        /**
         * @description 提示 token 总和
         */
        total_prompt_tokens?: number;
        /**
         * @description 总 token 总和
         */
        total_tokens?: number;
      };
      /**
       * @description 查询结束时间
       */
      to?: string;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_StatsCreditsSnapshotData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 每个账号的快照结果
       */
      results?: Array<__common__.Internal_serverStatsSnapshotResult>;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_StatsCreditConsumptionData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 聚合维度：day/week/month
       */
      dimension?: string;
      /**
       * @description 查询起始时间
       */
      from?: string;
      /**
       * @description 按账号聚合的消费明细（credit 降序）
       */
      items?: Array<__common__.Workbuddy2api_internal_storeConsumptionItem>;
      /**
       * @description 查询区间内所有消费记录的聚合
       */
      summary?: {
        /**
         * @description 消费记录条数
         */
        request_count?: number;
        /**
         * @description 生成 token 总和
         */
        total_completion_tokens?: number;
        /**
         * @description 消耗积分总和（精确小数求和）
         */
        total_credit?: number;
        /**
         * @description 提示 token 总和
         */
        total_prompt_tokens?: number;
        /**
         * @description 总 token 总和
         */
        total_tokens?: number;
      };
      /**
       * @description 查询结束时间
       */
      to?: string;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_StatsCreditConsumptionSeriesData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 查询起始时间
       */
      from?: string;
      /**
       * @description 实际生效的分桶粒度（minute/hour/day/week/month）
       */
      interval?: string;
      /**
       * @description 按时间升序的消费数据点（空桶已补零，可直接作为图表 X/Y 轴数据）
       */
      points?: Array<__common__.Workbuddy2api_internal_storeConsumptionPoint>;
      /**
       * @description 查询结束时间
       */
      to?: string;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_UserListData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 当前页的账号列表
       */
      items?: Array<__common__.Internal_serverUserListItem>;
      /**
       * @description 当前页码（从 1 开始）
       */
      page?: number;
      /**
       * @description 每页返回的数量
       */
      page_size?: number;
      /**
       * @description 符合筛选条件的账号总数
       */
      total?: number;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverCreateUserRequest {
    /**
     * @description access token（必填）
     */
    access_token?: string;
    /**
     * @description 账号所属域名
     */
    domain?: string;
    /**
     * @description 企业/租户 ID
     */
    enterprise_id?: string;
    /**
     * @description token 有效期（秒），默认从当前时间起算
     */
    expires_in?: number;
    /**
     * @description 账号昵称
     */
    nickname?: string;
    /**
     * @description refresh token（可选，用于续期）
     */
    refresh_token?: string;
    /**
     * @description 账号唯一标识（必填）
     */
    uid?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_UserCreateData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 是否新建成功
       */
      created?: boolean;
      /**
       * @description 创建的账号唯一标识
       */
      uid?: string;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverLoginFinishRequest {
    /**
     * @description login/start 返回的 OAuth state
     */
    state?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_LoginFinishData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 是否为新建账号（false 表示已存在并更新）
       */
      created?: boolean;
      /**
       * @description 登录并签到后的剩余积分
       */
      credits?: number;
      /**
       * @description 企业/租户 ID
       */
      enterprise_id?: string;
      /**
       * @description 账号昵称
       */
      nickname?: string;
      /**
       * @description 登录成功的账号唯一标识
       */
      uid?: string;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_LoginStartData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 用户需在浏览器访问的授权登录 URL
       */
      auth_url?: string;
      /**
       * @description state，完成登录后传给 login/finish
       */
      state?: string;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_UserDetailData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 账号凭据摘要（不含明文 token）
       */
      account?: {
        /**
         * @description 账号所属域名
         */
        domain?: string;
        /**
         * @description 企业/租户 ID
         */
        enterprise_id?: string;
        /**
         * @description 账号昵称
         */
        nickname?: string;
        /**
         * @description access token 过期时间（Unix 秒）
         */
        token_expires_at?: number;
        /**
         * @description 账号唯一标识
         */
        uid?: string;
      };
      /**
       * @description 最新一条积分快照（可为空）
       */
      latest_snapshot?: {
        /**
         * @description 当前积分周期结束时间
         */
        cycle_end?: string;
        /**
         * @description 套餐扣费到期时间
         */
        deduction_end?: string;
        /**
         * @description 快照是否失败（失败时 Remain 为上次兜底值）
         */
        failed?: boolean;
        /**
         * @description 快照自增 ID
         */
        id?: number;
        /**
         * @description 快照时剩余积分
         */
        remain?: number;
        /**
         * @description 快照时间
         */
        snapshot_at?: string;
        /**
         * @description 账号唯一标识
         */
        uid?: string;
      };
      /**
       * @description 最近 10 条签到记录
       */
      recent_checkins?: Array<__common__.Workbuddy2api_internal_storeCheckinLog>;
      /**
       * @description 账号池运行时状态
       */
      state?: {
        /**
         * @description 是否处于冷却状态
         */
        cooling?: boolean;
        /**
         * @description 当前剩余积分
         */
        credits?: number;
        /**
         * @description 当前积分周期结束时间（最近到期），未签到为空
         */
        cycle_end?: string;
        /**
         * @description 套餐扣费到期时间（最近到期），未签到为空
         */
        deduction_end?: string;
        /**
         * @description 是否被禁用
         */
        disabled?: boolean;
        /**
         * @description 连续错误计数
         */
        err_count?: number;
        /**
         * @description 账号昵称
         */
        nickname?: string;
        /**
         * @description 冷却/禁用原因
         */
        reason?: string;
        /**
         * @description 账号唯一标识
         */
        uid?: string;
        /**
         * @description 冷却解除时间（未冷却为空）
         */
        until?: string;
      };
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_UserDeleteData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 是否删除成功
       */
      deleted?: boolean;
      /**
       * @description 被删除的账号唯一标识
       */
      uid?: string;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverPatchUserRequest {
    /**
     * @description 设为 true 禁用账号，false 启用账号
     */
    disabled?: boolean;
    /**
     * @description 修改账号昵称
     */
    nickname?: string;
  }

  export interface Internal_serverEnvelopeinternal_server_UserPatchData {
    /**
     * @description 业务状态码：200 成功，400 参数错误，401 未授权，404 不存在，409 冲突，500 内部错误，503 上游不可用
     */
    code?: number;
    /**
     * @description 业务数据（失败时为 null）
     */
    data?: {
      /**
       * @description 更新后的禁用状态
       */
      disabled?: boolean;
      /**
       * @description 更新后的昵称
       */
      nickname?: string;
      /**
       * @description 账号唯一标识
       */
      uid?: string;
    };
    /**
     * @description 错误信息（成功时为 "ok"）
     */
    message?: string;
  }

  export interface Internal_serverPoolStatusResponse {
    /**
     * @description 账号状态列表
     */
    accounts?: Array<__common__.Workbuddy2api_internal_poolStatus>;
  }

  export interface Internal_serverChatCompletionRequest {
    /**
     * @description 最大生成 token 数
     */
    max_tokens?: number;
    /**
     * @description 消息列表
     */
    messages?: Array<__common__.Internal_serverChatCompletionMessage>;
    /**
     * @description 模型名称
     */
    model?: string;
    /**
     * @description 是否流式返回（SSE）
     */
    stream?: boolean;
    /**
     * @description 采样温度（0-2）
     */
    temperature?: number;
    /**
     * @description 工具选择策略
     */
    tool_choice?: any;
    /**
     * @description 工具调用配置
     */
    tools?: Array<any>;
  }

  export interface Internal_serverChatCompletionResponse {
    /**
     * @description 生成结果列表
     */
    choices?: Array<__common__.Internal_serverChatCompletionChoice>;
    /**
     * @description 创建时间（Unix 秒）
     */
    created?: number;
    /**
     * @description 请求 ID
     */
    id?: string;
    /**
     * @description 使用的模型
     */
    model?: string;
    /**
     * @description 对象类型，恒为 "chat.completion"
     */
    object?: string;
    /**
     * @description token 用量统计
     */
    usage?: {
      /**
       * @description 生成 token 数
       */
      completion_tokens?: number;
      /**
       * @description 提示 token 数
       */
      prompt_tokens?: number;
      /**
       * @description 总 token 数
       */
      total_tokens?: number;
    };
  }

  export interface Internal_serverModelsListResponse {
    /**
     * @description 模型列表
     */
    data?: Array<__common__.Internal_serverModelInfo>;
    /**
     * @description 对象类型，恒为 "list"
     */
    object?: string;
  }

  export interface Workbuddy2api_internal_poolStatus {
    /**
     * @description 是否处于冷却状态
     */
    cooling?: boolean;
    /**
     * @description 当前剩余积分
     */
    credits?: number;
    /**
     * @description 当前积分周期结束时间（最近到期），未签到为空
     */
    cycle_end?: string;
    /**
     * @description 套餐扣费到期时间（最近到期），未签到为空
     */
    deduction_end?: string;
    /**
     * @description 是否被禁用
     */
    disabled?: boolean;
    /**
     * @description 连续错误计数
     */
    err_count?: number;
    /**
     * @description 账号昵称
     */
    nickname?: string;
    /**
     * @description 冷却/禁用原因
     */
    reason?: string;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
    /**
     * @description 冷却解除时间（未冷却为空）
     */
    until?: string;
  }

  export interface Workbuddy2api_internal_storeChatAudit {
    /**
     * @description 请求时间
     */
    created_at?: string;
    /**
     * @description 本次请求消耗积分（上游 usage.credit）
     */
    credit?: number;
    /**
     * @description 请求后账号剩余积分
     */
    credits_after?: number;
    /**
     * @description 请求时账号剩余积分
     */
    credits_before?: number;
    /**
     * @description 请求总耗时（毫秒）
     */
    duration_ms?: number;
    /**
     * @description 错误信息（成功为空）
     */
    error?: string;
    /**
     * @description 审计记录自增 ID
     */
    id?: number;
    /**
     * @description 请求的模型名称
     */
    model?: string;
    /**
     * @description 完整请求体（jsonb 文本）
     */
    request_body?: string;
    /**
     * @description 请求唯一标识（来自请求头 X-Request-ID）
     */
    request_id?: string;
    /**
     * @description 响应内容（非流式存完整 body，流式存聚合 content）
     */
    response_body?: string;
    /**
     * @description 响应 HTTP 状态码
     */
    status_code?: number;
    /**
     * @description 是否流式请求
     */
    stream?: boolean;
    /**
     * @description 首字响应时间（毫秒）
     */
    ttft_ms?: number;
    /**
     * @description 本次请求使用的账号唯一标识
     */
    uid?: string;
    /**
     * @description 上游返回的完整 token 用量（含 credit 等扩展字段，JSONB）
     */
    usage?: object;
  }

  export interface Internal_serverAccountsSelectionData {
    /**
     * @description 按积分到期时间升序排列的候选账号列表
     */
    accounts?: Array<__common__.Workbuddy2api_internal_poolStatus>;
  }

  export interface Internal_serverAuditListData {
    /**
     * @description 当前页的审计记录列表（不含 request_body/response_body）
     */
    items?: Array<__common__.Workbuddy2api_internal_storeChatAudit>;
    /**
     * @description 当前页码
     */
    page?: number;
    /**
     * @description 每页返回的数量
     */
    page_size?: number;
    /**
     * @description 符合筛选条件的审计记录总数
     */
    total?: number;
  }

  export interface Internal_serverLoginFinishData {
    /**
     * @description 是否为新建账号（false 表示已存在并更新）
     */
    created?: boolean;
    /**
     * @description 登录并签到后的剩余积分
     */
    credits?: number;
    /**
     * @description 企业/租户 ID
     */
    enterprise_id?: string;
    /**
     * @description 账号昵称
     */
    nickname?: string;
    /**
     * @description 登录成功的账号唯一标识
     */
    uid?: string;
  }

  export interface Internal_serverLoginStartData {
    /**
     * @description 用户需在浏览器访问的授权登录 URL
     */
    auth_url?: string;
    /**
     * @description state，完成登录后传给 login/finish
     */
    state?: string;
  }

  export interface Internal_serverSigninData {
    /**
     * @description 每个账号的签到结果
     */
    results?: Array<__common__.Internal_serversigninResult>;
  }

  export interface Internal_serverStatsCreditsData {
    /**
     * @description 每个时间桶内所有账号的最新快照信息与消费聚合
     */
    buckets?: Array<__common__.Workbuddy2api_internal_storeStatsBucket>;
    /**
     * @description 聚合维度：day/week/month
     */
    dimension?: string;
    /**
     * @description 查询起始时间
     */
    from?: string;
    /**
     * @description 查询区间内所有消费记录的聚合
     */
    summary?: {
      /**
       * @description 消费记录条数
       */
      request_count?: number;
      /**
       * @description 生成 token 总和
       */
      total_completion_tokens?: number;
      /**
       * @description 消耗积分总和（精确小数求和）
       */
      total_credit?: number;
      /**
       * @description 提示 token 总和
       */
      total_prompt_tokens?: number;
      /**
       * @description 总 token 总和
       */
      total_tokens?: number;
    };
    /**
     * @description 查询结束时间
     */
    to?: string;
  }

  export interface Internal_serverStatsCreditsSnapshotData {
    /**
     * @description 每个账号的快照结果
     */
    results?: Array<__common__.Internal_serverStatsSnapshotResult>;
  }

  export interface Internal_serverUserCreateData {
    /**
     * @description 是否新建成功
     */
    created?: boolean;
    /**
     * @description 创建的账号唯一标识
     */
    uid?: string;
  }

  export interface Internal_serverUserDeleteData {
    /**
     * @description 是否删除成功
     */
    deleted?: boolean;
    /**
     * @description 被删除的账号唯一标识
     */
    uid?: string;
  }

  export interface Internal_serverUserDetailData {
    /**
     * @description 账号凭据摘要（不含明文 token）
     */
    account?: {
      /**
       * @description 账号所属域名
       */
      domain?: string;
      /**
       * @description 企业/租户 ID
       */
      enterprise_id?: string;
      /**
       * @description 账号昵称
       */
      nickname?: string;
      /**
       * @description access token 过期时间（Unix 秒）
       */
      token_expires_at?: number;
      /**
       * @description 账号唯一标识
       */
      uid?: string;
    };
    /**
     * @description 最新一条积分快照（可为空）
     */
    latest_snapshot?: {
      /**
       * @description 当前积分周期结束时间
       */
      cycle_end?: string;
      /**
       * @description 套餐扣费到期时间
       */
      deduction_end?: string;
      /**
       * @description 快照是否失败（失败时 Remain 为上次兜底值）
       */
      failed?: boolean;
      /**
       * @description 快照自增 ID
       */
      id?: number;
      /**
       * @description 快照时剩余积分
       */
      remain?: number;
      /**
       * @description 快照时间
       */
      snapshot_at?: string;
      /**
       * @description 账号唯一标识
       */
      uid?: string;
    };
    /**
     * @description 最近 10 条签到记录
     */
    recent_checkins?: Array<__common__.Workbuddy2api_internal_storeCheckinLog>;
    /**
     * @description 账号池运行时状态
     */
    state?: {
      /**
       * @description 是否处于冷却状态
       */
      cooling?: boolean;
      /**
       * @description 当前剩余积分
       */
      credits?: number;
      /**
       * @description 当前积分周期结束时间（最近到期），未签到为空
       */
      cycle_end?: string;
      /**
       * @description 套餐扣费到期时间（最近到期），未签到为空
       */
      deduction_end?: string;
      /**
       * @description 是否被禁用
       */
      disabled?: boolean;
      /**
       * @description 连续错误计数
       */
      err_count?: number;
      /**
       * @description 账号昵称
       */
      nickname?: string;
      /**
       * @description 冷却/禁用原因
       */
      reason?: string;
      /**
       * @description 账号唯一标识
       */
      uid?: string;
      /**
       * @description 冷却解除时间（未冷却为空）
       */
      until?: string;
    };
  }

  export interface Internal_serverUserListData {
    /**
     * @description 当前页的账号列表
     */
    items?: Array<__common__.Internal_serverUserListItem>;
    /**
     * @description 当前页码（从 1 开始）
     */
    page?: number;
    /**
     * @description 每页返回的数量
     */
    page_size?: number;
    /**
     * @description 符合筛选条件的账号总数
     */
    total?: number;
  }

  export interface Internal_serverUserPatchData {
    /**
     * @description 更新后的禁用状态
     */
    disabled?: boolean;
    /**
     * @description 更新后的昵称
     */
    nickname?: string;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
  }

  export interface Internal_serversigninResult {
    /**
     * @description 签到后的剩余积分
     */
    credits?: number;
    /**
     * @description 失败或已签到时的原因描述
     */
    message?: string;
    /**
     * @description 签到状态：ok（成功）/already（已签过）/fail（失败）/not_found（不存在）
     */
    status?: string;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
  }

  export interface Workbuddy2api_internal_storeStatsBucket {
    /**
     * @description 该时间段内的消费聚合
     */
    credit_summary?: {
      /**
       * @description 消费记录条数
       */
      request_count?: number;
      /**
       * @description 生成 token 总和
       */
      total_completion_tokens?: number;
      /**
       * @description 消耗积分总和（精确小数求和）
       */
      total_credit?: number;
      /**
       * @description 提示 token 总和
       */
      total_prompt_tokens?: number;
      /**
       * @description 总 token 总和
       */
      total_tokens?: number;
    };
    /**
     * @description 桶的展示日期：day=2006-01-02、week=2006-W35（ISO）、month=2006-01
     */
    date?: string;
    /**
     * @description 该时间段内有快照的账号，每个账号取快照时间最新的一条（含 failed），按 uid 升序
     */
    snapshots?: Array<__common__.Workbuddy2api_internal_storeCreditSnapshot>;
  }

  export interface Workbuddy2api_internal_storeConsumptionSummary {
    /**
     * @description 消费记录条数
     */
    request_count?: number;
    /**
     * @description 生成 token 总和
     */
    total_completion_tokens?: number;
    /**
     * @description 消耗积分总和（精确小数求和）
     */
    total_credit?: number;
    /**
     * @description 提示 token 总和
     */
    total_prompt_tokens?: number;
    /**
     * @description 总 token 总和
     */
    total_tokens?: number;
  }

  export interface Internal_serverStatsSnapshotResult {
    /**
     * @description 快照失败原因（成功为空）
     */
    error?: string;
    /**
     * @description 快照是否失败（失败时 Remain 为上次兜底值）
     */
    failed?: boolean;
    /**
     * @description 快照时剩余积分
     */
    remain?: number;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
  }

  export interface Internal_serverAccountSummary {
    /**
     * @description 账号所属域名
     */
    domain?: string;
    /**
     * @description 企业/租户 ID
     */
    enterprise_id?: string;
    /**
     * @description 账号昵称
     */
    nickname?: string;
    /**
     * @description access token 过期时间（Unix 秒）
     */
    token_expires_at?: number;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
  }

  export interface Workbuddy2api_internal_storeCreditSnapshot {
    /**
     * @description 当前积分周期结束时间
     */
    cycle_end?: string;
    /**
     * @description 套餐扣费到期时间
     */
    deduction_end?: string;
    /**
     * @description 快照是否失败（失败时 Remain 为上次兜底值）
     */
    failed?: boolean;
    /**
     * @description 快照自增 ID
     */
    id?: number;
    /**
     * @description 快照时剩余积分
     */
    remain?: number;
    /**
     * @description 快照时间
     */
    snapshot_at?: string;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
  }

  export interface Workbuddy2api_internal_storeCheckinLog {
    /**
     * @description 签到后剩余积分
     */
    credits_after?: number;
    /**
     * @description 签到前剩余积分
     */
    credits_before?: number;
    /**
     * @description 记录自增 ID
     */
    id?: number;
    /**
     * @description 失败或已签到时的原因描述
     */
    message?: string;
    /**
     * @description 签到发生时间
     */
    occurred_at?: string;
    /**
     * @description 签到状态：ok/already/fail/auth_invalid
     */
    status?: string;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
  }

  export interface Internal_serverUserListItem {
    /**
     * @description 当天是否已签到
     */
    checked_in_today?: boolean;
    /**
     * @description 是否处于冷却状态
     */
    cooling?: boolean;
    /**
     * @description 当前剩余积分
     */
    credits?: number;
    /**
     * @description 当前积分周期结束时间（最近到期的套餐），未签到则为空
     */
    cycle_end?: string;
    /**
     * @description 套餐扣费到期时间（最近到期），未签到则为空
     */
    deduction_end?: string;
    /**
     * @description 是否被禁用
     */
    disabled?: boolean;
    /**
     * @description 企业/租户 ID（可为空）
     */
    enterprise_id?: string;
    /**
     * @description 连续错误计数
     */
    err_count?: number;
    /**
     * @description 最近一次签到时间（无签到记录则为 nil）
     */
    last_checkin_at?: string;
    /**
     * @description 账号昵称
     */
    nickname?: string;
    /**
     * @description 冷却/禁用原因
     */
    reason?: string;
    /**
     * @description 是否为当前会被 /v1/chat/completions 选中的账号（挑号策略：到期最近优先）
     */
    selected?: boolean;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
    /**
     * @description 冷却解除时间（未冷却为空）
     */
    until?: string;
  }

  export interface Internal_serverChatCompletionMessage {
    /**
     * @description 消息内容
     */
    content?: string;
    /**
     * @description 工具名（role=tool 时）
     */
    name?: string;
    /**
     * @description 消息角色：system/user/assistant/tool
     */
    role?: string;
  }

  export interface Internal_serverChatCompletionChoice {
    /**
     * @description 结束原因：stop/length/tool_calls
     */
    finish_reason?: string;
    /**
     * @description 选择索引
     */
    index?: number;
    /**
     * @description 完成消息
     */
    message?: {
      /**
       * @description 消息内容
       */
      content?: string;
      /**
       * @description 工具名（role=tool 时）
       */
      name?: string;
      /**
       * @description 消息角色：system/user/assistant/tool
       */
      role?: string;
    };
  }

  export interface Internal_serverChatCompletionUsage {
    /**
     * @description 生成 token 数
     */
    completion_tokens?: number;
    /**
     * @description 提示 token 数
     */
    prompt_tokens?: number;
    /**
     * @description 总 token 数
     */
    total_tokens?: number;
  }

  export interface Internal_serverModelInfo {
    /**
     * @description 上下文窗口长度
     */
    context_length?: number;
    /**
     * @description 创建时间（Unix 秒）
     */
    created?: number;
    /**
     * @description 模型 ID
     */
    id?: string;
    /**
     * @description 最大输出 token 数
     */
    max_output_tokens?: number;
    /**
     * @description 对象类型，恒为 "model"
     */
    object?: string;
    /**
     * @description 模型归属
     */
    owned_by?: string;
  }

  export interface Internal_serverStatsCreditConsumptionData {
    /**
     * @description 聚合维度：day/week/month
     */
    dimension?: string;
    /**
     * @description 查询起始时间
     */
    from?: string;
    /**
     * @description 按账号聚合的消费明细（credit 降序）
     */
    items?: Array<__common__.Workbuddy2api_internal_storeConsumptionItem>;
    /**
     * @description 查询区间内所有消费记录的聚合
     */
    summary?: {
      /**
       * @description 消费记录条数
       */
      request_count?: number;
      /**
       * @description 生成 token 总和
       */
      total_completion_tokens?: number;
      /**
       * @description 消耗积分总和（精确小数求和）
       */
      total_credit?: number;
      /**
       * @description 提示 token 总和
       */
      total_prompt_tokens?: number;
      /**
       * @description 总 token 总和
       */
      total_tokens?: number;
    };
    /**
     * @description 查询结束时间
     */
    to?: string;
  }

  export interface Workbuddy2api_internal_storeConsumptionItem {
    /**
     * @description 该账号生成 token 总和
     */
    completion_tokens?: number;
    /**
     * @description 该账号消耗积分总和
     */
    credit?: number;
    /**
     * @description 该账号最后一条消费时间
     */
    last_used_at?: string;
    /**
     * @description 账号昵称（当前昵称，无则空串）
     */
    nickname?: string;
    /**
     * @description 该账号提示 token 总和
     */
    prompt_tokens?: number;
    /**
     * @description 该账号消费记录条数
     */
    request_count?: number;
    /**
     * @description 该账号总 token 总和
     */
    total_tokens?: number;
    /**
     * @description 账号唯一标识
     */
    uid?: string;
  }

  export interface Internal_serverStatsCreditConsumptionSeriesData {
    /**
     * @description 查询起始时间
     */
    from?: string;
    /**
     * @description 实际生效的分桶粒度（minute/hour/day/week/month）
     */
    interval?: string;
    /**
     * @description 按时间升序的消费数据点（空桶已补零，可直接作为图表 X/Y 轴数据）
     */
    points?: Array<__common__.Workbuddy2api_internal_storeConsumptionPoint>;
    /**
     * @description 查询结束时间
     */
    to?: string;
  }

  export interface Workbuddy2api_internal_storeConsumptionPoint {
    /**
     * @description 该桶内生成 token 总和
     */
    completion_tokens?: number;
    /**
     * @description 该桶内消耗积分总和
     */
    credit?: number;
    /**
     * @description 该桶内提示 token 总和
     */
    prompt_tokens?: number;
    /**
     * @description 该桶内消费记录条数
     */
    request_count?: number;
    /**
     * @description 该点对应的桶起始时间（RFC3339）
     */
    time?: string;
    /**
     * @description 该桶内总 token 总和
     */
    total_tokens?: number;
  }
}

export namespace AccountSelection {
  export interface GetSelectionRes
    extends __common__.Internal_serverEnvelopeinternal_server_AccountsSelectionData {}

  export interface GetSelectionParams {}

  export type RGetSelection = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_AccountsSelectionData["data"],
      __common__.Internal_serverEnvelopeinternal_server_AccountsSelectionData,
    ]
  >;
}

export namespace Audit {
  export interface GetChatRes
    extends __common__.Internal_serverEnvelopeinternal_server_AuditListData {}

  export interface GetChatParams {
    /**
     * @description 页码
     */
    page?: number;
    /**
     * @description 每页数量
     */
    page_size?: number;
    /**
     * @description 按账号筛选
     */
    uid?: string;
    /**
     * @description 按模型筛选
     */
    model?: string;
    /**
     * @description 按状态筛选（success/fail）
     */
    status?: string;
    /**
     * @description 起始时间
     */
    from?: string;
    /**
     * @description 结束时间
     */
    to?: string;
  }

  export interface GetChatByIdRes
    extends __common__.Internal_serverEnvelopeworkbuddy2api_internal_store_ChatAudit {}

  export interface GetChatByIdParams {
    /**
     * @description 审计记录 ID
     */
    id: number;
  }

  export type RGetChat = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_AuditListData["data"],
      __common__.Internal_serverEnvelopeinternal_server_AuditListData,
    ]
  >;
  export type RGetChatById = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeworkbuddy2api_internal_store_ChatAudit["data"],
      __common__.Internal_serverEnvelopeworkbuddy2api_internal_store_ChatAudit,
    ]
  >;
}

export namespace SignIn {
  export interface PostSigninRes
    extends __common__.Internal_serverEnvelopeinternal_server_SigninData {}

  export interface PostSigninParams {}

  export interface PostSigninBody
    extends __common__.Internal_serverSigninRequest {}

  export type RPostSignin = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_SigninData["data"],
      __common__.Internal_serverEnvelopeinternal_server_SigninData,
    ]
  >;
}

export namespace Statistics {
  export interface GetCreditsRes
    extends __common__.Internal_serverEnvelopeinternal_server_StatsCreditsData {}

  export interface GetCreditsParams {
    /**
     * @description 维度（day/week/month，默认 day）
     */
    dimension?: string;
    /**
     * @description 起始时间（Unix 秒或 RFC3339）
     */
    from?: string;
    /**
     * @description 结束时间（Unix 秒或 RFC3339）
     */
    to?: string;
    /**
     * @description 按账号筛选
     */
    uid?: string;
  }

  export interface PostCreditsSnapshotRes
    extends __common__.Internal_serverEnvelopeinternal_server_StatsCreditsSnapshotData {}

  export interface PostCreditsSnapshotParams {}

  export interface GetCreditConsumptionRes
    extends __common__.Internal_serverEnvelopeinternal_server_StatsCreditConsumptionData {}

  export interface GetCreditConsumptionParams {
    /**
     * @description 维度（day/week/month，默认 day）
     */
    dimension?: string;
    /**
     * @description 起始时间（Unix 秒或 RFC3339）
     */
    from?: string;
    /**
     * @description 结束时间（Unix 秒或 RFC3339）
     */
    to?: string;
    /**
     * @description 按账号筛选
     */
    uid?: string;
  }

  export interface GetCreditConsumptionSeriesRes
    extends __common__.Internal_serverEnvelopeinternal_server_StatsCreditConsumptionSeriesData {}

  export interface GetCreditConsumptionSeriesParams {
    /**
     * @description 起始时间（Unix 秒或 RFC3339，精确到秒；默认当前时间前 24 小时）
     */
    from?: string;
    /**
     * @description 结束时间（Unix 秒或 RFC3339，精确到秒；默认当前时间）
     */
    to?: string;
    /**
     * @description 分桶粒度（minute/hour/day/week/month，不传自动推断）
     */
    interval?: string;
    /**
     * @description 按账号筛选（不传为全账号汇总）
     */
    uid?: string;
  }

  export type RGetCredits = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_StatsCreditsData["data"],
      __common__.Internal_serverEnvelopeinternal_server_StatsCreditsData,
    ]
  >;
  export type RPostCreditsSnapshot = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_StatsCreditsSnapshotData["data"],
      __common__.Internal_serverEnvelopeinternal_server_StatsCreditsSnapshotData,
    ]
  >;
  export type RGetCreditConsumption = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_StatsCreditConsumptionData["data"],
      __common__.Internal_serverEnvelopeinternal_server_StatsCreditConsumptionData,
    ]
  >;
  export type RGetCreditConsumptionSeries = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_StatsCreditConsumptionSeriesData["data"],
      __common__.Internal_serverEnvelopeinternal_server_StatsCreditConsumptionSeriesData,
    ]
  >;
}

export namespace UserManagement {
  export interface GetUsersRes
    extends __common__.Internal_serverEnvelopeinternal_server_UserListData {}

  export interface GetUsersParams {
    /**
     * @description 页码（默认 1）
     */
    page?: number;
    /**
     * @description 每页数量（默认 20）
     */
    page_size?: number;
    /**
     * @description 状态筛选（disabled/active）
     */
    status?: string;
  }

  export interface PostUsersRes
    extends __common__.Internal_serverEnvelopeinternal_server_UserCreateData {}

  export interface PostUsersParams {}

  export interface PostUsersBody
    extends __common__.Internal_serverCreateUserRequest {}

  export interface PostUsersLoginFinishRes
    extends __common__.Internal_serverEnvelopeinternal_server_LoginFinishData {}

  export interface PostUsersLoginFinishParams {}

  export interface PostUsersLoginFinishBody
    extends __common__.Internal_serverLoginFinishRequest {}

  export interface PostUsersLoginStartRes
    extends __common__.Internal_serverEnvelopeinternal_server_LoginStartData {}

  export interface PostUsersLoginStartParams {}

  export interface GetUsersByUidRes
    extends __common__.Internal_serverEnvelopeinternal_server_UserDetailData {}

  export interface GetUsersByUidParams {
    /**
     * @description 账号 UID
     */
    uid: string;
  }

  export interface DeleteUsersByUidRes
    extends __common__.Internal_serverEnvelopeinternal_server_UserDeleteData {}

  export interface DeleteUsersByUidParams {
    /**
     * @description 账号 UID
     */
    uid: string;
  }

  export interface PatchUsersByUidRes
    extends __common__.Internal_serverEnvelopeinternal_server_UserPatchData {}

  export interface PatchUsersByUidParams {
    /**
     * @description 账号 UID
     */
    uid: string;
  }

  export interface PatchUsersByUidBody
    extends __common__.Internal_serverPatchUserRequest {}

  export type RGetUsers = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_UserListData["data"],
      __common__.Internal_serverEnvelopeinternal_server_UserListData,
    ]
  >;
  export type RPostUsers = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_UserCreateData["data"],
      __common__.Internal_serverEnvelopeinternal_server_UserCreateData,
    ]
  >;
  export type RGetUsersByUid = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_UserDetailData["data"],
      __common__.Internal_serverEnvelopeinternal_server_UserDetailData,
    ]
  >;
  export type PatchUsersByUidParams1 = PatchUsersByUidParams &
    __common__.Internal_serverPatchUserRequest;

  export type RPatchUsersByUid = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_UserPatchData["data"],
      __common__.Internal_serverEnvelopeinternal_server_UserPatchData,
    ]
  >;
  export type RDeleteUsersByUid = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_UserDeleteData["data"],
      __common__.Internal_serverEnvelopeinternal_server_UserDeleteData,
    ]
  >;
  export type RPostUsersLoginStart = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_LoginStartData["data"],
      __common__.Internal_serverEnvelopeinternal_server_LoginStartData,
    ]
  >;
  export type RPostUsersLoginFinish = Promise<
    [
      any,
      __common__.Internal_serverEnvelopeinternal_server_LoginFinishData["data"],
      __common__.Internal_serverEnvelopeinternal_server_LoginFinishData,
    ]
  >;
}

export namespace System {
  export interface GetHealthzRes {}

  export interface GetHealthzParams {}

  export interface GetStatusRes
    extends __common__.Internal_serverPoolStatusResponse {}

  export interface GetStatusParams {}

  export type RGetStatus = Promise<
    [any, unknown, __common__.Internal_serverPoolStatusResponse]
  >;
  export type RGetHealthz = Promise<[any, unknown, System.GetHealthzRes]>;
}

export namespace OpenAICompatible {
  export interface PostChatCompletionsRes
    extends __common__.Internal_serverChatCompletionResponse {}

  export interface PostChatCompletionsParams {
    /**
     * @description 手动指定使用的账号 UID（可选，默认自动选择）
     */
    X_Account_UID?: string;
  }

  export interface PostChatCompletionsBody
    extends __common__.Internal_serverChatCompletionRequest {}

  export interface GetModelsRes
    extends __common__.Internal_serverModelsListResponse {}

  export interface GetModelsParams {}

  export type RGetModels = Promise<
    [
      any,
      __common__.Internal_serverModelsListResponse["data"],
      __common__.Internal_serverModelsListResponse,
    ]
  >;
  export type PostChatCompletionsParams1 = PostChatCompletionsParams &
    __common__.Internal_serverChatCompletionRequest;

  export type RPostChatCompletions = Promise<
    [any, unknown, __common__.Internal_serverChatCompletionResponse]
  >;
}
