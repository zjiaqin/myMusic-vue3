import request from '@/utils/request'

// 歌单分类
export const catlist = () => {
  return request('/playlist/catlist', 'get', {})
}

export const playList = ({ cat, limit, offset, order }) => {
  return request('/top/playlist', 'get', { order, cat, limit, offset })
}
// 获取歌单的歌曲列表 data={ id = '', s = 8 }
export const playlistdetail = (data) => {
  return request('/playlist/detail', 'get', data)
}

// 歌单收藏用户 data={ id = '', limit = 20, offset = 0 }
export const playlistSCollect = (data) => {
  return request('/playlist/subscribers', 'get', data)
}
// 相关歌单推荐data = { id = '' }
export const playlistRelated = (data) => {
  return request('/related/playlist', 'get', data)
}

// 歌单评论 data={ id = '', limit = 20, offset = 0, before = 0 }
export const playlistComment = (data) => {
  return request('/comment/playlist', 'get', data)
}

// 歌曲详情 多个id , 隔开 { ids = '', timestamp = 0 }
export const songDetail = (data) => {
  return request('/song/detail', 'get', data)
}
