import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'
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
  {
    path: '/',
    name: '数据统计',
    component: Layout,
    redirect: '/data',
    children: [{
      path: 'data',
      name: 'data',
      component: () => import('@/views/userdata/index'),
      meta: {
        title: '数据统计',
        icon: 'APP',
        url:'/data'
      },
      // hidden: false
    }]
  },
  {
    path: '/personalcenter',
    name: 'Personalcenter',
    component: Layout,
    children: [{
      path: 'memberInfo',
      name: 'MemberInfo',
      component: () => import('@/views/personalcenter/index'),
      meta: {
        title: '个人资料'
      },
      hidden: true
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    meta: {
      title: '主播管理',
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/dashboard'),
        name: 'Home',
        meta: {
          title: '平台工作台',
        },
        hidden: true
      },
      // 公会端主播管理
      {
        path:'guildAnchor',
        name:'guildAnchor',
        component:()=>import('@/views/guildAnchor/index'),
        meta:{
          title:'公会主播管理',
          isNotLink:true
        },
        children:[
          {
            path: 'home',
            component: () => import('@/views/dashboard/index'),
            name: 'Home',
            meta: {
              title: '平台工作台',
            }
          },
          //公会管理
          {
            path: 'guildmanage',
            component: () => import('@/views/guildmanage/index'),
            name: 'Guildmanage',
            redirect: '/guildmanage/guildmanage',
            meta: {
              title: '公会管理',
            },
            children: [{
                path: '/guildmanage/guildmanage',
                name: 'guildmanage',
                component: () => import('@/views/guildmanage/guildmanage'),
                meta: {
                  title: '公会管理',
                }
              },
              {
                path: '/guildmanage/guilddetails',
                name: 'Guilddetails',
                component: () => import('@/views/guildmanage/Guilddetails'),
                meta: {
                  title: '公会详情',
                  activeMenu:'/guildmanage/guildmanage'
                },
                hidden: true
              }
            ]
          },
          //公会主播管理
          {
            path: 'Anchormanage',
            name: 'Anchormanage',
            component: () => import('@/views/anchormanage/index'),
            redirect: '/Anchormanage/Anchormanage',
            meta: {
              title: '主播管理',
            },
            children: [{
                path: '/Anchormanage/Anchormanage',
                name: 'Anchormanage',
                component: () => import('@/views/anchormanage/anchormanage'),
                meta: {
                  title: '主播管理',
                }
              },
              {
                path: '/Anchormanage/Anchordetails',
                name: 'Anchordetails',
                component: () => import('@/views/anchormanage/anchordetails'),
                meta: {
                  title: '主播详情',
                  activeMenu:'/Anchormanage/Anchormanage'
                },
                hidden: true
              }
            ]
          },
          //公会结算管理
          {
            path: 'guild',
            name: 'Guild',
            component: () => import('@/views/guildSettlement/index'),
            redirect: '/guild/guildSet',
            meta: {
              title: '公会结算管理',
            },
            children: [{
                path: '/guild/guildSet',
                name: 'GuildSet',
                component: () => import('@/views/guildSettlement/guildSettlement'),
                meta: {
                  title: '公会结算管理',

                }
              },
              {
                path: '/guild/guildsetdetails',
                name: 'Guildsetdetails',
                component: () => import('@/views/guildSettlement/details'),
                meta: {
                  title: '公会结算详情',
                  activeMenu:'/guild/guildSet'
                },
                hidden: true
              }
            ]
          },
          //主播结算管理
          {
            path: 'anchor',
            name: 'Anchor',
            component: () => import('@/views/anchorsettlement/index'),
            redirect: '/anchor/anchorSet',
            meta: {
              title: '主播结算管理',
            },
            children: [{
                path: '/anchor/anchorSet',
                name: 'AnchorSet',
                component: () => import('@/views/anchorsettlement/anchorsettlement'),
                meta: {
                  title: '主播结算管理',
                }
              },
              {
                path: '/anchor/anchorsetdetails',
                name: 'Anchorsetdetails',
                component: () => import('@/views/anchorsettlement/details'),
                meta: {
                  title: '主播结算详情',
                  activeMenu:'/anchor/anchorSet'
                },
                hidden: true
              }
            ]
          },


        ]
      },
      //#region
      /**
      {
        path: 'home',
        component: () => import('@/views/dashboard/index'),
        name: 'Home',
        meta: {
          title: '平台工作台',
        }
      },
      //公会管理
      {
        path: 'guildmanage',
        component: () => import('@/views/guildmanage/index'),
        name: 'Guildmanage',
        redirect: '/guildmanage/guildmanage',
        meta: {
          title: '公会管理',
        },
        children: [{
            path: 'guildmanage',
            name: 'guildmanage',
            component: () => import('@/views/guildmanage/guildmanage'),
            meta: {
              title: '公会管理',
            }
          },
          {
            path: 'guilddetails',
            name: 'Guilddetails',
            component: () => import('@/views/guildmanage/Guilddetails'),
            meta: {
              title: '公会详情',
            },
            hidden: true
          }
        ]
      },
      //公会主播管理
      {
        path: 'Anchormanage',
        name: 'Anchormanage',
        component: () => import('@/views/anchormanage/index'),
        redirect: '/Anchormanage/Anchormanage',
        meta: {
          title: '公会主播管理',
        },
        children: [{
            path: 'Anchormanage',
            name: 'Anchormanage',
            component: () => import('@/views/anchormanage/anchormanage'),
            meta: {
              title: '公会主播管理',
            }
          },
          {
            path: 'Anchordetails',
            name: 'Anchordetails',
            component: () => import('@/views/anchormanage/anchordetails'),
            meta: {
              title: '主播详情',
            },
            hidden: true
          }
        ]
      },
      //公会结算管理
      {
        path: 'guild',
        name: 'Guild',
        component: () => import('@/views/guildSettlement/index'),
        redirect: '/guild/guildSet',
        meta: {
          title: '公会结算管理',
        },
        children: [{
            path: 'guildSet',
            name: 'GuildSet',
            component: () => import('@/views/guildSettlement/guildSettlement'),
            meta: {
              title: '公会结算管理',

            }
          },
          {
            path: 'guildsetdetails',
            name: 'Guildsetdetails',
            component: () => import('@/views/guildSettlement/details'),
            meta: {
              title: '公会结算详情',
            },
            hidden: true
          }
        ]
      },
      //主播结算管理
      {
        path: 'anchor',
        name: 'Anchor',
        component: () => import('@/views/anchorsettlement/index'),
        redirect: '/anchor/anchorSet',
        meta: {
          title: '主播结算管理',
        },
        children: [{
            path: 'anchorSet',
            name: 'AnchorSet',
            component: () => import('@/views/anchorsettlement/anchorsettlement'),
            meta: {
              title: '主播结算管理',
            }
          },
          {
            path: 'anchorsetdetails',
            name: 'Anchorsetdetails',
            component: () => import('@/views/anchorsettlement/details'),
            meta: {
              title: '主播结算详情'
            },
            hidden: true
          }
        ]
      },
     */
    //#endregion

      // 平台主播管理
      {
        path:'platformAnchor',
        name:'platformAnchor',
        component:()=>import('@/views/platformAnchor/index'),
        meta:{
          title:'平台主播管理',
          isNotLink:true
        },
        children:[
          {
            path:'stat',
            name:'stat',
            component:()=>import('@/views/platformAnchor/stat'),
            meta:{
              title:'数据统计'
            }
          },
          {
            path:'broadcastRoomManage',
            name:'broadcastRoomManage',
            component:()=>import('@/views/platformAnchor/broadcastRoomManage'),
            meta:{
              title:'直播间管理'
            }
          },
          {
            path:'platformAnchorManage',
            name:'platformAnchorManage',
            component:()=>import('@/views/platformAnchor/platformAnchorManage/index'),
            meta:{
              title:'主播管理'
            },
            children:[
              {
                path:'anchorDetails',
                name:'anchorDetails',
                component:()=>import('@/views/platformAnchor/platformAnchorManage/anchorDetails'),
                meta:{
                  title:'主播详情',
                  activeMenu:'/platformAnchor/platformAnchorManage'
                },
                hidden:true
              }
            ]
          },
          {
            path:'anchorList',
            name:'anchorList',
            component:()=>import('@/views/platformAnchor/anchorList'),
            meta:{
              title:'主播信息'
            }
          },

        ]
      },
    ]
  },
  // 旧后台部分
  /*------------------------------------------------------------------------*/
  {
    path: '/',
    component: Layout,
    redirect: '/content',
    name: 'content',
    meta: {
      title: '内容管理',
      icon: 'content'
    },
    children: [{
        path: 'content',
        name: 'contentIndex',
        component: () => import('@/views/content/index'),
        meta: {
          title: '内容管理'
        },
        hidden: true
      },
      {
        path: 'videoContentManage',
        name: 'videoContentManage',
        redirect:{name:'contentIndex'},
        component: () => import('@/views/content/videoContentManage'),
        meta: {
          title: '短视频管理',
          isNotLink:true    // 控制这个路由在面包屑导航上是否可以点击导航，true 禁用跳转导航
        },
        children: [{
          path: 'recreation',
          name: 'recreation',
          component: () => import('@/views/content/videoPage/recreation'),
          meta: {
            title: '娱乐'
          },
          children:[
            {
              path: 'videoDetails',
              component: () => import('@/views/content/videoDetails'),
              meta: {
                title: '视频详情',
                activeMenu:'/videoContentManage/recreation'  // 用于判断menu组件选中项，处于此路由时，menu组件中高亮 /videoContentManage/recreation
              },
              hidden: true // 在menu组件中不显示
            }
          ]
        }, {
          path: 'city',
          name: 'city',
          component: () => import('@/views/content/videoPage/city'),
          meta: {
            title: '城市名片'
          },
          children:[
            {
              path: 'videoDetails',
              component: () => import('@/views/content/videoDetails'),
              meta: {
                title: '视频详情',
                activeMenu:'/videoContentManage/city'
              },
              hidden: true
            }
          ]
        }, {
          path: 'card',
          name: 'card',
          component: () => import('@/views/content/videoPage/card'),
          meta: {
            title: '打卡视频'
          },
          children:[
            {
              path: 'videoDetails',
              component: () => import('@/views/content/videoDetails'),
              meta: {
                title: '视频详情',
                activeMenu:'/videoContentManage/card'
              },
              hidden: true
            }
          ]
        }, {
          path: 'lostAndFound',
          name: 'lostAndFound',
          component: () => import('@/views/content/videoPage/lostAndFound'),
          meta: {
            title: '拾金不昧'
          },
          children:[
            {
              path: 'videoDetails',
              component: () => import('@/views/content/videoDetails'),
              meta: {
                title: '视频详情',
                activeMenu:'/videoContentManage/lostAndFound'
              },
              hidden: true
            }
          ]
        }, {
          path: 'userDetails',
          name: 'userDetails',
          component: () => import('@/views/content/userDetails'),
          meta: {
            title: '用户详情'
          },
          hidden: true
        }
      ]
      }, {
        path: 'mark',
        name: 'mark',
        component: () => import('@/views/content/mark.vue'),
        meta: {
          title: '标签管理'
        }
      }
      , {
        path: 'topicManage',
        name: 'topicManage',
        component: () => import('@/views/content/topicManage.vue'),
        meta: {
          title: '话题管理'
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/audity',
    name: 'audity',
    meta: {
      title: '审核管理',
      icon: 'content'
    },
    children: [{
        path: 'audity',
        name: 'audityIndex',
        component: () => import('@/views/audity/index'),
        meta: {
          title: '审核管理'
        },
        hidden: true
      },

      {
        path: 'videoManage',
        name: 'videoManage',
        redirect:{name:'audity'},
        component: () => import('@/views/audity/videoManage'),
        meta: {
          title: '短视频审核',
          isNotLink:true // 控制这个路由在面包屑导航上是否可以点击导航，true 禁用跳转导航
        },
        children: [{
          path: 'recreation',
          name: 'recreation',
          component: () => import('@/views/audity/recreation'),
          meta: {
            title: '娱乐视频审核'
          },
        }, {
          path: 'city',
          name: 'city',
          component: () => import('@/views/audity/city'),
          meta: {
            title: '城市名片审核'
          },
        }, {
          path: 'card',
          name: 'card',
          component: () => import('@/views/audity/card'),
          meta: {
            title: '打卡视频审核'
          }
        }, {
          path: 'lostAndFound',
          name: 'lostAndFoundAudit',
          component: () => import('@/views/audity/lostAndFound'),
          meta: {
            title: '拾金不昧审核',
            // breadcrumb:false
          },

          children:[
             {
              path: 'lostAndFoundDetails',
              name: 'lostAndFoundDetails',
              component: () => import('@/views/audity/lostAndFoundDetails'),
              meta: {
                title: '拾金不昧详情页',
                activeMenu:'/videoManage/lostAndFound'
              },
              hidden: true,
              children:[
                 {
                  path: 'lostAndFoundHistory',
                  name: 'lostAndFoundHistory',
                  component: () => import('@/views/audity/lostAndFoundHistory'),
                  meta: {
                    title: '拾金不昧历史详情',
                    activeMenu:'/videoManage/lostAndFound'
                  },
                  hidden: true
                }
              ]
            }

          ]
        }]
      }, {
        path: 'topicAudit',
        name: 'topicAudit',
        component: () => import('@/views/audity/topicAudit'),
        meta: {
          title: '话题审核'
        }
      },
      {
        path: 'inform',
        name: 'inform',
        component: () => import('@/views/audity/inform'),
        meta: {
          title: '举报审核'
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/glance',
    name: 'Finance',
    meta: {
      title: '财务管理',
      icon: 'finance'
    },
    children: [{
        path: 'glance',
        name: 'Glance',
        component: () => import('@/views/finance/glance'),
        meta: {
          title: '财务管理'
        },
        hidden: true
      },
      {
        path: 'withdrawal',
        name: 'Withdrawal',
        component: () => import('@/views/finance/withdrawal'),
        meta: {
          title: '提现管理'
        },
      },
      {
        path: 'extension',
        name: 'Extension',
        component: () => import('@/views/finance/extension'),
        meta: {
          title: '推广管理'
        }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/finance/order'),
        meta: {
          title: '订单管理'
        },
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/tool',
    name: 'small',
    meta: {
      title: '小工具',
      icon: 'finance'
    },
    children: [{
        path: 'tool',
        name: 'Tool',
        component: () => import('@/views/smalltool/tool'),
        meta: {
          title: '小工具',
          icon: 'finance'
        },
        hidden: true
      },
      {
        path: 'manage',
        name: 'Manage',
        component: () => import('@/views/smalltool/appVersion'),
        meta: {
          title: 'APP版本管理',
          icon: 'APP',
        }
      },
      {
        path: 'navigationconfig',
        name: 'Navigationconfig',
        component: () => import('@/views/navigationconfig/index'),
        meta: {
          title: '导航资源配置',
          icon: 'config'
        },
      }
    ]
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
  router.matcher = newRouter.matcher
}

export default router
