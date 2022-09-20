import request from '@/utils/request'
// 登录
export const login = ({ phone = '', password = '' }) => {
  return request('/login/cellphone', 'post', { phone, password })
}
// 退出登录

export const logout = () => {
  return request('/logout', 'get', {})
}

// 获取用户详细信息
export const getUserInfo = (uid) => {
  return request('/user/detail', 'get', { uid })
}

// 获取用户详情
// const getUserInfo = ({ uid = '' }) => { return api.get(`/user/detail?uid=${uid}`, {}) }
