import request from '@/utils/request'

/* ********* 专辑 ********* */
// 获取专辑内容

export const album = ({ id = '' }) => {
  return request(`/album`, 'get', { id })
}

export const albumDynamic = ({ id = '' }) => {
  return request('/album/detail/dynamic', 'get', { id })
}

export const albumSub = ({ id = '', t = 1 }) => {
  return request('/album/sub', 'get', { id, t })
}
//获取歌手专辑
export const artistAlbum = ({ id = '', limit = 50, offset = 0 }) => {
  return request('/artist/album', 'get', { id, limit, offset })
}
