import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   name: 'Home',
  //   meta: {
  //     title: '公会后台平台端'
  //   },
  //   children: [{
  //       path: 'home',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Home',
  //       meta: {
  //         title: '平台工作台'
  //       }
  //     },
  //     //公会管理
  //     {
  //       path: 'guildmanage',
  //       component: () => import('@/views/guildmanage/index'),
  //       name: 'Guildmanage',
  //       redirect: '/guildmanage/guildmanage',
  //       meta: {
  //         title: '公会管理'
  //       },
  //       children: [{
  //           path: 'guildmanage',
  //           name: 'guildmanage',
  //           component: () => import('@/views/guildmanage/guildmanage'),
  //           meta: {title: '公会管理',}
  //         },
  //         {
  //           path: 'guilddetails',
  //           name: 'Guilddetails',
  //           component: () => import('@/views/guildmanage/Guilddetails'),
  //           meta: {
  //             title: '公会详情'
  //           },
  //           hidden: true
  //         }
  //       ]
  //     },
  //     //公会主播管理
  //     {
  //       path: 'Anchormanage',
  //       name: 'Anchormanage',
  //       component: () => import('@/views/anchormanage/index'),
  //       redirect: '/Anchormanage/Anchormanage',
  //       meta: {
  //         title: '公会主播管理'
  //       },
  //       children: [{
  //           path: 'Anchormanage',
  //           name: 'Anchormanage',
  //           component: () => import('@/views/anchormanage/anchormanage'),
  //           meta: {title: '公会主播管理',}
  //         },
  //         {
  //           path: 'Anchordetails',
  //           name: 'Anchordetails',
  //           component: () => import('@/views/anchormanage/anchordetails'),
  //           meta: {
  //             title: '主播详情'
  //           },
  //           hidden: true
  //         }
  //       ]
  //     },
  //     //公会结算管理
  //     {
  //       path: 'guild',
  //       name: 'Guild',
  //       component: () => import('@/views/guildSettlement/index'),
  //       redirect: '/guild/guildSet',
  //       meta: {
  //         title: '公会结算管理'
  //       },
  //       children: [{
  //           path: 'guildSet',
  //           name: 'GuildSet',
  //           component: () => import('@/views/guildSettlement/guildSettlement'),
  //           meta: {title: '公会结算管理',}
  //         },
  //         {
  //           path: 'guildsetdetails',
  //           name: 'Guildsetdetails',
  //           component: () => import('@/views/guildSettlement/details'),
  //           meta: {
  //             title: '公会结算详情'
  //           },
  //           hidden: true
  //         }
  //       ]
  //     },
  //     //主播结算管理
  //     {
  //       path: 'anchor',
  //       name: 'Anchor',
  //       component: () => import('@/views/anchorsettlement/index'),
  //       redirect: '/anchor/anchorSet',
  //       meta: {
  //         title: '主播结算管理'
  //       },
  //       children: [{
  //           path: 'anchorSet',
  //           name: 'AnchorSet',
  //           component: () => import('@/views/anchorsettlement/anchorsettlement'),
  //           meta: {title: '主播结算管理',}
  //         },
  //         {
  //           path: 'anchorsetdetails',
  //           name: 'Anchorsetdetails',
  //           component: () => import('@/views/anchorsettlement/details'),
  //           meta: {
  //             title: '主播结算详情'
  //           },
  //           hidden: true
  //         }
  //       ]
  //     },
  //   ]
  // },
  //app版本管理
  {
    path: '/',
    component: Layout,
    children: [{
      path: 'home',
      name: 'Manage',
      component: () => import('@/views/index/appVersion'),
      meta: {
        title: 'APP版本管理',icon:'app'
      }
    }]
  },
  {
    path: '/navigation',
    component: Layout,
    children: [{
      path: 'navigationconfig',
      name: 'Navigationconfig',
      component: () => import('@/views/navigationconfig/index'),
      meta: {
        title: '导航资源配置',icon:'config'
      },
    }, ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
