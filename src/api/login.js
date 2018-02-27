import request from '@/utils/request'

export function loginByUsername(userName, password) {
  const data = {
    userName,
    password
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/auth/operator/information',
    method: 'get'
  })
}

