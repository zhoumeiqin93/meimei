import request from '@/utils/request'

export function getDepartMentInfo(query) {
  return request({
    url: '/department/-1/children/list',
    method: 'get',
    params: query
  })
}

export function getDepartmentDetail(query) {
  return request({
    url: '/department/' + query,
    method: 'get',
  })
}

export function editCompany(data) {
  return request({
    url: '/department',
    method: 'post',
    data
  })
}

export function getDepartmentOperators(query) {
  return request({
    url: '/department/operators/' + query,
    method: 'get',
  })
}

export function getOperatorsList() {
  return request({
    url: '/operator/lists',
    method: 'get',
  })
}

export function addDepartmentOperators(data) {
  return request({
    url: '/department/operators',
    method: 'POST',
    data
  })
}
