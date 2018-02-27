import request from '@/utils/request'

export function getCustomerInfo(query) {
  return request({
    url: '/enterprise/customer/list',
    method: 'get',
    params: query
  })
}

export function getCustomerDetail(query) {
  return request({
    url: '/enterprise/customer/' + query,
    method: 'get',
  })
}

export function getPropertyList() {
  return request({
    url: '/enums/enterprise/property',
    method: 'get',
  })
}

export function getCustomerLevelList() {
  return request({
    url: '/enums/customer/level',
    method: 'get',
  })
}

export function getCustomerTypeList() {
  return request({
    url: '/enums/customer/type',
    method: 'get',
  })
}


export function modifyCustomerInfo(data) {
  return request({
    url: '/enterprise/customer',
    method: 'post',
    data
  })
}

export function deleteCustomerInfo(data) {
  return request({
    url: '/enterprise/customer',
    method: 'delete',
    data
  })
}

export function addCustomerInfo(data) {
  return request({
    url: '/enterprise/customer',
    method: 'put',
    data
  })
}

export function getLinkManList(query) {
  return request({
    url: '/enterprise/customer/linkmans/' + query,
    method: 'get',
  })
}

export function addLinkMan(data) {
  return request({
    url: '/enterprise/customer/linkmans',
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
