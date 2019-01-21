<template>
  <header>
    <div class="logo">
      <p>虹膜识别门禁管理系统</p>
    </div>
    <slot></slot>
    <div id="placeholder" v-if="$route.name === 'Login'"></div>
    <nav id="menu" v-else>
      <span>{{ adminName }}，欢迎你</span>
      <router-link to="/menu">主菜单</router-link>
      <router-link class="email" to="/message" v-show="!redShow"></router-link>
      <router-link class="email-red" to="/message" v-show="redShow"></router-link>
      <router-link to="/upload">软件上传</router-link>
      <router-link to="/history">历史记录</router-link> 
      <router-link to="/password">密码修改</router-link> 
      <!--<router-link to="" style="padding-right: 15px;">考勤管理</router-link>-->|
      <a class="logout" href="javascript:;" @click="logout()">退出</a>
      <!--<router-link to="/help">帮助</router-link>-->
    </nav>
  </header>
</template>

<script>
  import { _debounce } from '../../common/js/util'
  import Bus from '../../common/js/Bus'
  export default {
    name: 'header',
    data () {
      return {
        redShow: false,
        logout: _debounce(this.logoutHandler)
      }
    },
    computed: {
      adminName () {
        try {
          let name = window.localStorage.getItem('ADMIN_NAME')
          if (!name) {
            return null
          }
          return name
        } catch (error) {
          console.log('取name出错')
          console.log(error)
          return null
        }
      }
    },
    mounted () {
      if (this.$route.name !== 'Login') {
        // console.log('header mounted;on-hasMessage')
        Bus.$on('hasMessage', (show) => {
          this.redShow = show
        })
        Bus.$emit('requireMsg')
      }
    },
    methods: {
      logoutHandler () {
        this.$http.post('logout', '').then((response) => {
          console.log('退出时请求到的数据：')
          console.log(response)
          if (response.data.status) {
            console.log('退出成功！')
            this.clearToken()
            this.clearName()
            Bus.$emit('endMessageTimer')
            Bus.$emit('resetMsgData')
            this.$router.replace('/')
          } else {
            this.$emit('alertMsg', response.data.msg)
          }
        }).catch((error) => {
          console.log(error)
          this.$emit('alertMsg', '退出失败，请重试。')
        })
      },
      clearToken () {
        let localStorage = window.localStorage
        try {
//          if (localStorage.getItem('JWT_TOKEN') !== null) {
          if (localStorage.getItem(window.myToken) !== null) {
            localStorage.removeItem('JWT_TOKEN')
            console.log('logout token')
          }
        } catch (err) {
          console.log('logout token 出错')
          console.log(err)
        }
      },
      clearName () {
        let localStorage = window.localStorage
        try {
          if (localStorage.getItem('ADMIN_NAME') !== null) {
            localStorage.removeItem('ADMIN_NAME')
            console.log('logout name')
          }
        } catch (err) {
          console.log('logout name 出错')
          console.log(err)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  header
    position fixed
    top 0
    left 0
    z-index 997
    display flex
    width 100%
    height 40px
    background #333538
    .logo
      flex 1 1 50%
      height 40px
      vertical-align middle
      p
        width 300px
        text-align center
        color #fff
        font-size 20px
        margin-top 10px
        cursor default
    #placeholder
      flex 0 0 50%
    #menu
      flex 1 1 26%
      height 40px
      width 2100px !important
      line-height 40px
      font-size 14px
      text-align center
      overflow hidden
      color #fff
      /*background-color red*/
      span
        padding-left 10px
      a
        margin-left 10px
        text-decoration none
        color #fff
        vertical-align middle
      a:nth-of-type(2), :nth-of-type(3)
        display inline-block
        width 24px
        height 18px
        margin-bottom 5px
      a:nth-of-type(2)
        background url(./email.png) no-repeat center center / contain
      a:nth-of-type(3)
        background url(./email-red.png) no-repeat center center / contain
      a:nth-of-type(6)
        margin-right 10px
</style>
