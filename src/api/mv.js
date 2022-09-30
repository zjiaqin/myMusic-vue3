import request from '@/utils/request'
// 获取 mv
export const mv = ({
  area = '',
  type = '',
  order = '',
  limit = 50,
  offset = 0
}) => {
  return request('/mv/all', 'get', {
    area,
    type,
    order,
    limit,
    offset
  })
}
// 获取 mv详情
export const mvDetail = (mvid) => {
  return request('/mv/detail', 'get', { mvid })
}

// 获取MV地址
export const mvUrl = (id) => {
  return request('/mv/url', 'get', { id, r: 1080 })
}

/* ********* MV ********* */
// // 获取 mv
// const mv = ({ area = '', type = '', order = '', limit = 50, offset = 0 }) => { return api.get(`/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`, {}) }
// // 获取 mv详情
// const mvDetail = ({ id = '' }) => { return api.get(`/mv/detail?mvid=${id}`, {}) }
// // 获取 地址
// const mvUrl = ({ id = '', r = 1080 }) => { return api.get(`/mv/url?id=${id}&r=${r}`, {}) }
// // 获取mv评论
// const commentMv = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return api.get(`/comment/mv?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }
// // 相似mv
// const simiMv = ({ id = '' }) => { return api.get(`/simi/mv?mvid=${id}`, {}) }
