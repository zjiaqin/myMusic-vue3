import aixos from 'axios'

const baseURL = 'http://localhost:3000/'
const instance = aixos.create({
  baseURL,
  timeout: 1000 * 60,
  withCredentials: true
})

// 向外传出请求工具函数
//  submitData要求为一个对象
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
