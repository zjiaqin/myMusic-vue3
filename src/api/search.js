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

// 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export const cloudsearch = ({
  keywords = '',
  limit = 30,
  offset = 0,
  type = '1'
}) => {
  return request('/cloudsearch', 'get', { keywords, limit, offset, type })
}
