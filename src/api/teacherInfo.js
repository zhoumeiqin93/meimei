import request from '@/utils/request'

export function getTeacherInfo(query) {
  return request({
    url: '/teacher/resource/list',
    method: 'get',
    params: query
  })
}

export function getAppellation() {
  return request({
    url: '/enums/appellation',
    method: 'get',
  })
}

export function getTeacherInfoDetail(query) {
  return request({
    url: '/teacher/resource/' + query,
    method: 'get',
  })
}

export function getIdCardType() {
  return request({
    url: '/enums/idcard/type',
    method: 'get',
  })
}

export function modifyTeacherInfo(data) {
  return request({
    url: '/teacher/resource',
    method: 'post',
    data
  })
}

export function addTeacherInfo(data) {
  return request({
    url: '/teacher/resource',
    method: 'put',
    data
  })
}

export function deleteTeacherInfo(data) {
  return request({
    url: '/teacher/resource',
    method: 'delete',
    data
  })
}

export function getLinkManList(query) {
  return request({
    url: '/teacher/resource/linkmans/' + query,
    method: 'get',
  })
}

export function addLinkMan(data) {
  return request({
    url: '/teacher/resource/linkmans',
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
