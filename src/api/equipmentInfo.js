import request from '@/utils/request'

export function getDepartMentInfo(query) {
  return request({
    url: '/department/-1/children/list',
    method: 'get',
    params: query
  })
}

export function getEquipmentInfo(query) {
  return request({
    url: '/company/assets/list',
    method: 'get',
    params: query
  })
}

export function getCompanyAssets() {
  return request({
    url: '/enums/company/assets',
    method: 'get'
  })
}

export function addCompanyAssets(data) {
  return request({
    url: '/company/assets',
    method: 'put',
    data
  })
}

// 修改公司设备
export function editCompanyAssets(data) {
  return request({
    url: '/company/assets',
    method: 'post',
    data
  })
}

export function deleteCompanyAssets(data) {
  return request({
    url: '/company/assets',
    method: 'delete',
    data
  })
}

// 获取公司设备详细
export function getAssetsDetails(data) {
  return request({
    url: '/company/assets/' + data,
    method: 'get'
  })
}

export function getAssetsList() {
  return request({
    url: '/assets/type/list',
    method: 'get',
  })
}
