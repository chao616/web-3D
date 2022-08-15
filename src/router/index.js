import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Line from '@/pages/line'
import IntCharts from '@/pages/dwg'
import Slice from '@/pages/slice'
import Obj from '@/pages/obj'
import Objc from '@/pages/objc'
import DrawMesh from '@/pages/drawMesh/index.vue'
import DrawWork from '@/pages/drawWork/index.vue'
import DrawGeological from '@/pages/drawGeological/index.vue'
import DrawWorkGeo from '@/pages/drawWorkGeo/index.vue'
import DrawRoadWay from '@/pages/drawRoadWay/index.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '*',
            redirect: '/home' // 重定向
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/line',
            name: 'line',
            component: Line
        },
        {
            path: '/intCharts',
            name: 'intCharts',
            component: IntCharts
        },
        {
            path: '/slice',
            name: 'slice',
            component: Slice
        },
        {
            path: '/obj',
            name: 'obj',
            component: Obj
        },
        {
            path: '/objc',
            name: 'objc',
            component: Objc
        },
        {
            path: '/drawMesh',
            name: 'drawMesh',
            component: DrawMesh
        },
        {
            path: '/drawWork',
            name: 'drawWork',
            component: DrawWork
        },
        {
            path: '/drawGeological',
            name: 'drawGeological',
            component: DrawGeological
        },
        {
            path: '/drawWorkGeo',
            name: 'drawWorkGeo',
            component: DrawWorkGeo
        },
        {
            path: '/drawRoadWay',
            name: 'drawRoadWay',
            component: DrawRoadWay
        }
    ]
})
