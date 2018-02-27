import request from '@/utils/request'

export function getHutInfo(query) {
  return request({
    url: '/uhealth/room/list',
    method: 'get',
    params: query
  })
}

export function getHutType() {
  return request({
    url: '/enums/uhealthRoomType',
    method: 'get',
  })
}

export function getHutDetail(query) {
  return request({
    url: '/uhealth/room/' + query,
    method: 'get',
  })
}

export function getCompanyAssets() {
  return request({
    url: '/enums/company/assets',
    method: 'get'
  })
}

export function getRoomOperators(query) {
  return request({
    url: '/uhealth/room/operators/' + query,
    method: 'get',
  })
}

export function getOperatorsList() {
  return request({
    url: '/operator/lists',
    method: 'get',
  })
}

export function addRoomOperators(data) {
  return request({
    url: '/uhealth/room/operators',
    method: 'POST',
    data
  })
}


export function getCustomersList() {
  return request({
    url: '/enterprise/customer/vo',
    method: 'get',
  })
}

export function addRoomCustomers(data) {
  return request({
    url: '/uhealth/room/customers',
    method: 'POST',
    data
  })
}

export function getRoomCustomers(query) {
  return request({
    url: '/uhealth/room/customers/' + query,
    method: 'get',
  })
}

export function getRoomAssetsList(query) {
  return request({
    url: '/uhealth/room/assets/' + query,
    method: 'get',
  })
}

export function getAssetsList() {
  return request({
    url: '/assets/type/list',
    method: 'get',
  })
}

export function submitAddAssets(data) {
  return request({
    url: '/uhealth/room/assets',
    method: 'put',
    data
  })
}

export function submitAddAssetType(data) {
  return request({
    url: '/assets/type',
    method: 'put',
    data
  })
}
