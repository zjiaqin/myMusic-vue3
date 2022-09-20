import request from '@/utils/request'
// 搜索
export const search = (keywords) => {
  return request(`/search`, 'get', { keywords })
}
// 热门搜索
export const searchHot = () => {
  return request('/search/hot', 'get', {})
}
// 搜索建议
export const searchSuggest = (keywords) => {
  return request(`/search/suggest`, 'get', { keywords })
}
