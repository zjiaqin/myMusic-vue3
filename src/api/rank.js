import request from '@/utils/request'

// 排行榜歌单列表
// const topRankList = ({ id = '', s = 8 }) => {
//   return api.get(`/playlist/detail?id=${id}&s=${s}`, {})
// }
// 所有榜单内容摘要
// const topListDetail = () => {
//   return api.get('/toplist/detail', {})
// }
// 歌单详情
// const listDetail = ({ id = '', s = 8 }) => {
//   return api.get(`/playlist/detail?id=${id}&s=${s}`, {})
// }

// 所有榜单内容摘要
export const topListDetail = () => {
  return request('/toplist/detail', 'get', {})
}

export const listDetail = ({ id = '', s = 8 }) => {
  return request('/playlist/detail', 'get', { s, id })
}
