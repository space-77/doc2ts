import axios from 'axios'

const $axios = axios.create({ baseURL: 'xxx', timeout: 1000 * 60 * 2 })

// 请求拦截器
$axios.interceptors.request.use(async config => {})
// 返回体拦截器
$axios.interceptors.response.use(
  async response => {},
  async error => {}
)

export default $axios
