/* eslint-disable no-unused-vars */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import 'blueimp-md5/js/md5.min'
import 'normalize.css'
import './common/stylus/index.styl'
import Vuebar from 'vuebar'
import VueVideoPlayer from 'vue-video-player'
import './common/stylus/v-bar.css'
import Bus from './common/js/Bus'
import './common/js/Polyfill'

Vue.prototype.$http = Axios
Vue.config.productionTip = false
Vue.use(VueAxios, Axios)
Vue.use(VueVideoPlayer)
Vue.use(Vuebar)

Axios.defaults.timeout = 30000
// http://irisian.yunjuzhen.cn:18080/entrance-guard/entrance
// http://118.31.1.242:8080/entrance-guard/entrance
// 118.31.1.242:8080 jiayang
// 192.168.0.104:8080 manxin http://localhost:8080/entrance
// http://041257765409.cicp.net:11004/entrance-guard/entrance
Axios.defaults.baseURL = 'http://118.31.1.242:8080/entrance-guard/entrance'
Axios.defaults.maxContentLength = 20000
// Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// Vue.prototype.$http = Axios
/* eslint-disable no-new */

const localStorage = window.localStorage
window.myToken = 'JWT_TOKEN_' + '5200'
router.beforeEach((to, from, next) => {
  console.log('打印出to的内容(即将要进入的目标 路由对象)：')
  console.log(to)
  const isLogin = localStorage.getItem(window.myToken)
  if (isLogin) {
    next()
  } else {
    if (to.name === 'Login') {
      next()
    } else {
      next({ path: '/' })
    }
  }
  if (!localStorage.getItem('ADMIN_NAME')) {
    return next({ path: '/' })
  } else {
    next()
  }
})

Axios.interceptors.request.use(config => {
  if (localStorage.getItem(window.myToken)) {
    config.headers = {
      'Authorization': localStorage.getItem(window.myToken),
      'Content-Type': 'application/json;charset=UTF-8'
    }
  } else {
    config.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  Bus.$emit('showLoading')
  return config
}, err => {
  return Promise.reject(err)
})

function logout () {
  clearToken()
  clearName()
  Bus.$emit('endMessageTimer')
  Bus.$emit('resetMsgData')
  router.replace({
    path: 'login',
    query: {redirect: router.currentRoute.fullPath}// 登录成功后跳入浏览的当前页面
  })
}
function clearToken () {
  let localStorage = window.localStorage
  try {
    // if (localStorage.getItem('JWT_TOKEN') !== null) {
    if (localStorage.getItem(window.myToken) !== null) {
      // localStorage.removeItem('JWT_TOKEN')
      localStorage.removeItem(window.myToken)
      console.log('logout token')
    }
  } catch (err) {
    console.log('logout token err')
    console.log(err)
  }
}
function clearName () {
  let localStorage = window.localStorage
  try {
    if (localStorage.getItem('ADMIN_NAME') !== null) {
      localStorage.removeItem('ADMIN_NAME')
      console.log('logout name')
    }
  } catch (err) {
    console.log('logout name err')
    console.log(err)
  }
}

Axios.interceptors.response.use(response => {
  Bus.$emit('hideLoading')
  return response
}, err => {
  Bus.$emit('hideLoading')
  if (err.response) {
    console.log('axios:' + err.response.status)
    switch (err.response.status) {
      case 401:
        // logout
        logout()
        // router.replace({
        //   path: 'login',
        //   query: {redirect: router.currentRoute.fullPath}
        // })
    }
  }
  console.log(err)
  // err.response.data
  return Promise.reject(err)
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
