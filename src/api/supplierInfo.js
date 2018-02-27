import request from '@/utils/request'

export function getSupplierInfo(query) {
  return request({
    url: '/supplier/message/list',
    method: 'get',
    params: query
  })
}


export function getSupplierDetails(query) {
  return request({
    url: '/supplier/message/' + query,
    method: 'get',
  })
}

export function getSupplierTypeList() {
  return request({
    url: '/enums/supplier/type',
    method: 'get',
  })
}

export function modifySupplierInfo(data) {
  return request({
    url: '/supplier/message',
    method: 'post',
    data
  })
}

export function getTaxTypeList() {
  return request({
    url: '/enums/tax/type',
    method: 'get',
  })
}

export function deleteSupplierInfo(data) {
  return request({
    url: '/supplier/message',
    method: 'delete',
    data
  })
}

export function addSupplierInfo(data) {
  return request({
    url: '/supplier/message',
    method: 'put',
    data
  })
}

export function getLinkManList(query) {
  return request({
    url: '/supplier/message/linkmans/' + query,
    method: 'get',
  })
}

export function addLinkMan(data) {
  return request({
    url: '/supplier/message/linkmans',
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
