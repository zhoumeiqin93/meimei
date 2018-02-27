import {asyncRouterMap, constantRouterMap} from '@/router'

const _import = require('../../router/_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '../../views/layout/Layout'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param routedevelopment
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      console.log(state.routers)
    }
  },
  actions: {
    GenerateRoutes({commit}, data) {
      return new Promise(resolve => {
        const {menus} = data;
        let accessedRouters = [];
        for (let i = 0; i < menus.length; i++) {
          // console.log(menus[i]);
          if (menus[i].pageCode === '/dashboard') {
            continue
          }
          if (menus[i].childrenMenus.length) {
            accessedRouters.push({
              id: menus[i].id,
              path: menus[i].pageCode,
              component: Layout,
              redirect: 'noredirect',
              alwaysShow: true,
              name: menus[i].pageCode.substr(1, menus[i].pageCode.length),
              meta: {
                title: menus[i].pageCode.substr(1, menus[i].pageCode.length),
                icon: menus[i].icon
              },
              children: []
            })
            // console.log(accessedRouters)
            for (let j in menus[i].childrenMenus) {
              accessedRouters[accessedRouters.length - 1].children.push({
                id: menus[i].childrenMenus[j].id,
                path: menus[i].childrenMenus[j].pageCode,
                component: _import('erpPage/' + menus[i].childrenMenus[j].pageCode),
                name: menus[i].childrenMenus[j].pageCode + '-demo',
                meta: {
                  title: menus[i].childrenMenus[j].pageCode
                }
              })
              // console.log(accessedRouters)
            }
          } else {
            accessedRouters.push({
              id: menus[i].id,
              path: menus[i].pageCode,
              component: Layout,
              children: [{
                path: menus[i].pageCode.substr(1, menus[i].pageCode.length),
                name: menus[i].pageCode.substr(1, menus[i].pageCode.length),
                component: _import('erpPage/' + menus[i].pageCode.substr(1, menus[i].pageCode.length)),
                meta: {
                  title: menus[i].pageCode.substr(1, menus[i].pageCode.length),
                  icon: menus[i].icon
                }
              }]
            })
          }
        }
        // accessedRouters = asyncRouterMap
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
