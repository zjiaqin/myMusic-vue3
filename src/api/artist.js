import request from '@/utils/request'

// 获取歌手列表
/*
 * type: -1:全部; 1:男歌手; 2:女歌手; 3:乐队
 * area: -1:全部; 7华语; 96欧美; 8:日本; 16韩国; 0:其他
 * initial: 按首字母索引查找参数, 热门传-1, #传0
 * limit: 30
 * offset: 0
 */

export const artistList = ({
  type = -1,
  area = -1,
  initial = '',
  limit = 50,
  offset = 0
}) => {
  return request('/artist/list', 'get', { type, area, initial, limit, offset })
}

/****获取歌手详细信息 */
// 歌手介绍
export const artistDesc = ({ id = '' }) => {
  return request('/artist/desc', 'get', { id })
}

// 歌手热门歌曲
export const artists = ({ id = '' }) => {
  return request('/artists', 'get', { id })
}

// 获取歌手 mv
export const artistMv = ({ id = '', limit = 50, offset = 0 }) => {
  return request('/artist/mv', 'get', { id, limit, offset })
}

//获取歌手专辑
export const artistAlbum = ({ id = '', limit = 50, offset = 0 }) => {
  return request('/artist/album', 'get', { id, limit, offset })
}
