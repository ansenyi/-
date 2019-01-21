<template>
  <div class="history">
    <page>
      <div slot="container" class="container center">
        <form class="form-container">
          <h4 class="form-title">修改密码</h4>
          <label for="oldPassword">
	          <span>请输入旧密码：</span>
	          <input type="password" id="oldPassword" v-model="oldPassword" autofocus="autofocus">
          </label>
          <label for="newPassword">
	          <span>请输入新密码：</span>
	          <input type="password" id="newPassword" v-model="newPassword" style="margin-left: 5px;">
          </label>
          <div class="item1">
	        <label class="pwd">（至少8位，只允许数字和字母，且必须包含至少一个大写字母）</label>
	      </div>
          <label for="newPassword1">
	          <span>请确认新密码：</span>
	          <input type="password" id="newPassword1" v-model="newPassword1" style="margin-left: 5px;"><br />
          </label>
          <button class="button" @click.prevent="changePassword()">确定</button>
          <button class="button" @click.prevent="cancelChange()">取消</button>
        </form>
      </div>
    </page>
  </div>
</template>

<script>
  import Bus from '../common/js/Bus'
  import { _debounce } from '../common/js/util'
  import Page from './Page/Page.vue'
  import md5 from 'js-md5'
  export default {
    name: 'password',
    data () {
      return {
        oldPassword: '',
        newPassword: '',
        newPassword1: '',
        changePassword: _debounce(this.changePasswordHandler)
      }
    },
    created () {
      document.title = '密码修改— 虹膜门禁管理系统'
      console.log('window.localStorage')
      console.log(window.localStorage)
    },
    mounted () {
    },
    watch: {
    },
    methods: {
      cancelChange () {
        this.oldPassword = ''
        this.newPassword = ''
        this.newPassword1 = ''
      },
      changePasswordHandler () {
        console.log('进入了changePassword函数')
        if (this.oldPassword === '' || this.newPassword === '' || this.newPassword1 === '') {
          Bus.$emit('alertMsgShow', '请填写完整')
          return
        }
        if (window.localStorage.ADMIN_PASSWORD !== this.oldPassword) {
          console.log(window.localStorage.ADMIN_PASSWORD)
          Bus.$emit('alertMsgShow', '输入的旧密码和原密码不同，请重新输入')
          this.oldPassword = ''
          document.getElementById('oldPassword').focus()
          return
        }
        let reg = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
        if (!reg.test(this.newPassword)) {
//        console.log('新密码不符合规范，请重新输入')
          Bus.$emit('alertMsgShow', '新密码不符合规范，请重新输入')
          document.getElementById('newPassword').focus()
          return
        }
        if (this.newPassword1 !== this.newPassword) {
//        console.log('新密码不符合规范，请重新输入')
          Bus.$emit('alertMsgShow', '两次输入的密码不同，请确认')
          document.getElementById('newPassword1').focus()
          return
        }
        console.log({
          userName: window.localStorage.ADMIN_NAME,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          newPassword1: this.newPassword1
        })
        this.$http.post('changePassword', JSON.stringify({
          name: window.localStorage.ADMIN_NAME,
          oldPwd: md5(this.oldPassword),
          newPwd: md5(this.newPassword)
        })).then((res) => {
          if (res.data.status) {
            console.log('修改成功')
            Bus.$emit('alertMsgShow', '修改成功')
          }
//        Bus.$emit('alertMsg', res.data.msg)
        }).catch((err) => {
          console.log(err)
          Bus.$emit('alertMsgShow', '操作失败，请重试。')
        })
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/mixin.styl'
  formWidth = 460px
  .history
    .container
      padding-top 20vh
      .form-container
        form-container(formWidth)
        width 460px
        height 350px
        margin 0 auto
        background #333538
        span
          line-height 34px
          color #eee
        label
          display flex
          justify-content space-between
          width 320px
          margin 0 auto
          margin-top 15px
          input
            text-align:left
        .pwd
            color:#888
            font-size:12px
        .button
          width 100px
          margin-top 40px
          margin-left:50px
          margin-right:30px
</style>
