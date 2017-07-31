import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import List from '../components/List.vue'
import Details from '../components/Details.vue'
import Setting from '../components/Setting.vue'

const routes={routes:[
  {path: '/', name:'root',redirect:'/list'},
  {path: '/list', name:'list', component: List},
  {path: '/details',  name:'details',component: Details},
  {path: '/setting',  name:'setting',component: Setting}
]}

export default new Router(routes)

