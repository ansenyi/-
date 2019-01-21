<template>
  <div class="login">
    <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 440px;height: 450px;">
    	<div class="title">
	  		<p class="Ch">虹膜门禁管理系统</p>
	  		<p class="En">IRIS ACCESS CONTROL MANAGEMENT SYSTEM</p>
	  	</div>
      <div class="login-confirm">
      	<p class="pclass">虹膜门禁管理系统</p>
	      <div class="confirm-content">
	        <p class="empty" v-show="emptyShow">用户名或密码不能为空</p>
	        <p class="error" v-show="errorShow">用户名或密码错误</p>
	        <div class="input">
	          <input type="text" id="name" name="name" placeholder="请输入您的用户名" v-model="adminName" ref="name" @keyup.enter="blurName()" autocomplete="off" autofocus>
	          <i class="input-cancel icon-cancel" v-show="nameCancel" @click="adminName = ''"></i>
	        </div>
	        <div class="input">
	          <input type="password" id="password" name="pwd" placeholder="请输入您的密码" v-model="password" ref="password" @keyup.enter="blurPassword()"  autocomplete="off">
	          <i class="input-cancel icon-cancel" v-show="pwdCancel" @click="password = ''"></i>
	        </div>
	      </div>
	      <button class="confirm-button" @click="login()">登   录</button>
      </div>
    </div>
  </div>
</template>

<script>
//  import md5 from 'blueimp-md5'
  import myHeader from './Header/Header.vue'
  import Bus from '../common/js/Bus'
  import { _debounce, getBLen } from '../common/js/util'
  import md5 from 'js-md5'
  export default {
    name: 'login',
    data () {
      return {
        emptyShow: false,
        errorShow: false,
        adminName: '',
        password: '',
        login: _debounce(this.loginHandler)
      }
    },
    computed: {
      nameCancel () {
        return this.adminName !== ''
      },
      pwdCancel () {
        return this.password !== ''
      }
    },
    created () {
      document.title = '登录 — 虹膜门禁管理系统'
    },
    methods: {
      loginHandler () {
        this.adminName = this.adminName.replace(/(^\s*)|(\s*$)/g, '')  // 删除左右两端的空格
        this.password = this.password.replace(/(^\s*)|(\s*$)/g, '')   // 删除左右两端的空格
        console.log('加密后的密码:' + md5(this.password))
        if (this.adminName === '' || this.password === '') {
          this.emptyShow = true
          this.errorShow = false
          return
        }
        if (getBLen(this.adminName) > 32) {
          this.$emit('alertMsg', '用户名超出长度！')
          return
        }
        if (getBLen(this.password) > 32) {
          this.$emit('alertMsg', '密码超出长度！')
          return
        }
        this.$http.post('login', JSON.stringify({
          adminName: this.adminName,
//        password: this.password
          password: md5(this.password)
        }))
        .then((response) => {
          console.log('登录请求到的数据：')
          console.log(response)
          if (response.data.status) {
            console.log(response.headers.authorization)
            console.log(response.data.data)
            this.saveToken(response.headers.authorization)
            this.saveName(this.adminName)
            this.savePassword(this.password)
            this.$router.replace('/menu')
            Bus.$emit('startMessageTimer')
          } else {
            this.emptyShow = false
            this.errorShow = true
          }
        }).catch((error) => {
          console.log(error)
          this.emptyShow = false
          this.errorShow = false
        })
//        let info = `http://192.168.1.104:8080/entrance/login?adminName=${this.adminName}&password=${this.password}`
      },
      blurName () {
        this.$refs.name.blur()
        this.$refs.password.focus()
      },
      blurPassword () {
        this.$refs.password.blur()
        this.login()
      },
      saveToken (token) {
        try {
//          window.localStorage.setItem('JWT_TOKEN', token)
          window.localStorage.setItem(window.myToken, token)
          console.log('保存了token')
        } catch (err) {
          console.log('保存token出错')
          console.log(err)
        }
      },
      saveName (name) {
        try {
          window.localStorage.setItem('ADMIN_NAME', name)
          console.log('保存了name')
        } catch (err) {
          console.log('保存name出错')
          console.log(err)
        }
      },
      savePassword (password) {
        try {
          window.localStorage.setItem('ADMIN_PASSWORD', password)
          console.log('保存了password')
        } catch (err) {
          console.log('保存password出错')
          console.log(err)
        }
      }
    },
    components: {
      myHeader
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/mixin.styl'
  titleWidth = 436px
  titleHeight = 45px
  contentHeight = 150px
  confirmWidth = 414px
  confirmHeight = 45px
  .login
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background url('../assets/background.png') no-repeat center center / cover
   .title
    position absolute
    width 450px
    /*padding-top 30%
    padding-bottom 20%*/
    .Ch
     font-size 32px
     color #fff
     text-align center
    .En
     font-size 13px
     color #fff
     text-align center
     margin-top -20px
  .login-confirm
    position absolute
    top 50%
    left 50%
    height 300px
    background #fff
    border-radius 5px
    margin-top -100px
    margin-left -220px
    .pclass
     font-size 20px
     margin-left 63px
    confirm-container(titleWidth, titleHeight, contentHeight, confirmWidth, confirmHeight)
    .confirm-content
      position relative
      padding 10px 70px
      box-sizing border-box
      background #fff
      .empty, .error
        position absolute
        top -15px
        left 40px
        font-size 12px
        color #d84c4c
      .input
        search-input()
        .input-cancel
          right 2px
          /*color red*/
        &:first-of-type
          margin-bottom 35px
        label
          display inline-block
          line-height 22px
          text-align right
          color #ccc
        input
          float right
          width 300px !important
          height 40px
          outline none
          border 1px solid #ccc
          line-height 22px
          background-color #fff
		    input:focus
		      border 1px solid #0077d5
		.confirm-button
		 width 300px!important
</style>
