import request from '@/utils/request'
// 获取轮播图
export const getBanner = () => {
  return request('/banner', 'get')
}

// 获取热门歌单标签
export const hotList = () => {
  return request('/playlist/hot', 'get')
}

// 获取歌单列表
export const playList = ({ cat, limit, offset }) => {
  return request('/top/playlist', 'get', { order: 'hot', cat, limit, offset })
}
// 新碟上架
export const topAlbum = ({ area, limit }) => {
  return request('/top/album', 'get', {
    limit,
    area,
    typ: 'new',
    year: '',
    month: '',
    offset: 0
  })
}
/* ********* 排行榜 ********* */

// 排行榜
export const toplist = () => {
  return request('/toplist', 'get', {})
}
// 排行榜歌单列表
export const topRankList = (id) => {
  return request('/playlist/detail', 'get', { id, s: 8 })
}

// /* ********* video ********* */
// 视频播放地址
export const videoUrl = (data) => {
  return request('/video/url', 'get', data)
}

// 获取最新MV
export const getNewMv = (data) => {
  return request('/mv/first', 'get', data)
}

// /* ********* 电台********* */

// 获取热门电台
export const getHotDj = (data) => {
  return request('/dj/hot', 'get', data)
}

// 获取热门歌手
/**
 *
 * @param {limit,offset}
 *
 */
export const topArtists = (data) => {
  return request('/top/artists', 'get', data)
}

// const topArtists = ({ limit = 30, offset = 0 }) => { return api.get(`/top/artists?limit=${limit}&offset=${offset}`, {}) }
