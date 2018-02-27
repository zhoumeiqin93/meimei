import request from '@/utils/request'

export function getLogListInfo(query) {
  return request({
    url: '/system/log/list',
    method: 'get',
    params: query
  })
}


export function logTypeListInfo() {
  return request({
    url: '/enums/system/log',
    method: 'get',
  })
}
