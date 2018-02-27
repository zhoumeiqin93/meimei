import request from '@/utils/request'

export function getStaffInfo(query) {
  return request({
    url: '/operator/list',
    method: 'get',
    params: query
  })
}

export function getStaffDetail(query) {
  return request({
    url: '/operator/' + query,
    method: 'get',
  })
}

export function getCasteEnum() {
  return request({
    url: '/enums/operator/caste/enum',
    method: 'get',
  })
}

export function getIdCardType() {
  return request({
    url: '/enums/idcard/type',
    method: 'get',
  })
}

export function getGenderType() {
  return request({
    url: '/enums/gender/type',
    method: 'get',
  })
}

export function getMaritalStatus() {
  return request({
    url: '/enums/marital/status',
    method: 'get',
  })
}

export function getContractType() {
  return request({
    url: '/enums/contract/type',
    method: 'get',
  })
}

export function getCredentials() {
  return request({
    url: '/enums/credentials/type',
    method: 'get',
  })
}

export function getChildrenInStatus() {
  return request({
    url: '/enums/children/status',
    method: 'get',
  })
}

export function getEducationBackground() {
  return request({
    url: '/enums/education/background/type',
    method: 'get',
  })
}
export function getRelationType() {
  return request({
    url: '/enums/person/relation/type',
    method: 'get',
  })
}

export function modifyStaffInfo(data) {
  return request({
    url: '/operator',
    method: 'post',
    data
  })
}

export function addStaffInfo(data) {
  return request({
    url: '/operator',
    method: 'put',
    data
  })
}

export function deleteStaffInfo(data) {
  return request({
    url: '/operator',
    method: 'delete',
    data
  })
}

export function getFamilyNumberList(query) {
  return request({
    url: '/operator/family/members/' + query,
    method: 'get',
  })
}

export function addFamilyNumber(data) {
  return request({
    url: '/operator/family/members',
    method: 'put',
    data
  })
}

export function getFamilyNumberDetail(query) {
  return request({
    url: '/operator/family/member/' + query,
    method: 'get',
  })
}

export function submitModifyFamilyNumber(data) {
  return request({
    url: '/operator/family/members',
    method: 'post',
    data
  })
}

export function deleteFamilyNumber(query) {
  return request({
    url: '/operator/family/members/' + query,
    method: 'delete',
  })
}

