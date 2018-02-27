import request from '@/utils/request'

export function getProjectInfo(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  })
}

export function getContractParty() {
  return request({
    url: '/enums/contract/party',
    method: 'get',
  })
}

export function getProjectStatus() {
  return request({
    url: '/enums/project/status',
    method: 'get',
  })
}

export function getCustomerType() {
  return request({
    url: '/enums/customer/flag',
    method: 'get',
  })
}

export function getServiceType() {
  return request({
    url: '/enums/service/type',
    method: 'get',
  })
}
export function getPaymentMethod() {
  return request({
    url: '/enums/payment/method',
    method: 'get',
  })
}

export function getProjectDetail(query) {
  return request({
    url: '/project/' + query,
    method: 'get',
  })
}

export function modifyInfo(data) {
  return request({
    url: '/project',
    method: 'post',
    data
  })
}

export function addProjectInfo(data) {
  return request({
    url: '/project',
    method: 'put',
    data
  })
}

export function deleteInfo(data) {
  return request({
    url: '/project',
    method: 'delete',
    data
  })
}

export function getLinkManList(query) {
  return request({
    url: '/project/linkmans/' + query,
    method: 'get',
  })
}

export function addLinkMan(data) {
  return request({
    url: '/project/linkmans',
    method: 'put',
    data
  })
}

export function getLinkManDetail(query) {
  return request({
    url: '/linkman/' + query,
    method: 'get',
  })
}

export function submitModifyLinkMan(data) {
  return request({
    url: '/linkman',
    method: 'post',
    data
  })
}

export function deleteLinkMan(query) {
  return request({
    url: '/linkman/' + query,
    method: 'delete',
  })
}
