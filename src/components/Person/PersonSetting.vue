<template>
  <div class="person-setting">
    <form class="form-container">
      <h4 class="form-title">人员信息</h4>
      <label for="name">
                   姓名<span style="color: #d84c4c;font-size: 20px;">*</span>：
        <input type="text" id="name" v-model="userName" :class="redAdd && userName === '' ? 'red' : ''" autocomplete="off" />
      </label>
      <label for="number">
                   工号<span style="color: #d84c4c;font-size: 20px;">*</span>：
        <input type="text" placeholder="由数字0-9组成，最多9位" id="number" v-model="employeeId" :class="redAdd && employeeId === '' ? 'red' : ''" maxlength="9" autocomplete="off" />
      </label>
      <label for="card">
                   卡号<span style="opacity: 0;font-size: 20px;">*</span>：
        <!--<input type="text" placeholder="由数字0-9组成，且小于4294967295" id="card" v-model="cardNo" autocomplete="off" disabled="disabled"/>-->
        <input type="text" id="card" v-model="cardNo" autocomplete="off" disabled="disabled"/>
      </label>
      <label class="select-label" for="dept">
                   部门<span style="opacity: 0;font-size: 20px;">*</span>：
        <div class="dept-wrapper">
          <select id="dept" v-model="parentId" @change="getSecondLevel(function (){})">
            <option selected value="请选择">请选择</option>
            <option v-for="(items, index) in orgList" :key="index" :value="items.orgId">{{ items.orgName }}</option>
          </select>
          <i id="first" class="select-down icon-down"></i>
          <select id="second-dept" v-model="orgId" :class="redAdd && parentId !== '请选择' && orgId === '请选择' ? 'red' : ''">
            <option selected value="请选择">请选择</option>
            <option v-for="(item, index) in secondLevel" :key="index" :value="item.orgId">{{ item.orgName }}</option>
          </select>
          <i id="second" class="select-down icon-down"></i>
        </div>
      </label>
      <label class="select-label" for="role">
       	 角色<span style="opacity: 0;font-size: 20px;">*</span>：
        <select id="role" v-model="roleId">
          <option disabled selected value="请选择">请选择</option>
          <option v-for="(item, index) in roleList" :key="index" :value="item.roleId">{{ item.roleName }}<span v-if="item.roleType === 2">（管理员）</span><span v-if="item.roleType === 1">（默认）</span></option>
        </select>
        <i class="select-down icon-down"></i>
      </label>
    </form>
    <div class="buttons">
      <button class="button" @click="saveAll()">保存</button>
      <button class="button" @click="$router.go(-1) || $router.push('../../person/preview')">返回</button>
    </div>
  </div>
</template>

<script>
  import { _debounce, getBLen } from '../../common/js/util'
  export default {
    name: 'person-setting',
    props: ['userId'],
    data () {
      return {
        userName: '',
        employeeId: '',
        cardNo: '',
        orgList: [],
        secondLevel: [],
        roleList: [],
        parentId: '请选择',
        orgId: '请选择',
        roleId: '请选择',
        redAdd: false,
        saveAll: _debounce(this.saveAllHandler)
      }
    },
    async created () {
      document.title = '修改人员信息 — 虹膜门禁管理系统'
      this.$http.post('findAllRole', JSON.stringify({like: ''})).then((res) => {
        console.log('查询出所有的角色：')
        console.log(res.data.data)
        if (res.data.status) {
          this.roleList = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
      await this.$http.post('selOrgByParentId', JSON.stringify({
        parentId: 0
      })).then((res) => {
        if (res.data.status) {
          console.log('查询出org')
          console.log(res.data.data)
          this.orgList = res.data.data
        }
      }).catch(err => console.log(err))
      this.$http.post('getUser', JSON.stringify({
        userId: this.userId
      })).then((res) => {
        if (res.data.status) {
          console.log('取出某个user的信息：')
          console.log(res.data.data)
          let person = res.data.data
          this.userName = person.userName
          this.employeeId = person.employeeId
          this.cardNo = person.cardNo == null ? '' : person.cardNo
          console.log(person.org)
          console.log(person.role)
          if (person.hasOwnProperty('org') && person.org.hasOwnProperty('orgName')) {
            this.parentId = person.org.parentId
            this.getSecondLevel(() => {
              this.orgId = person.org.orgId
            })
          }
          if (person.hasOwnProperty('role') && person.role.hasOwnProperty('roleName')) {
            this.roleId = person.role.roleId
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    mounted () {
      let options = document.querySelectorAll('option[disabled=disabled]')
      console.log('options.length')
      console.log(options.length)
      if (options.length > 0 && (navigator.userAgent.indexOf('Trident') > -1 || navigator.userAgent.indexOf('Edge') > -1)) {
        for (let i = 0; i < options.length; i++) {
          console.log(options[i].style.display)
          options[i].style.display = 'block'
        }
      }
    },
    methods: {
      getSecondLevel (fn) {
        console.log('getSecondLevel')
        if (this.parentId === '请选择') {
          this.secondLevel = []
          this.orgId = '请选择'
//          let secDept = document.querySelector('#second-dept')
//          if (this.redAdd && secDept.classList.contains('red')) {
//            console.log('remove')
//            secDept.classList.remove('red')
//          }
          return
        }
        let index = this.orgList.findIndex((dept) => dept.orgId === this.parentId)
        console.log(index)
        if (index === -1) {
          console.log('return')
          return
        }
        if (this.orgList[index].hasOwnProperty('children')) {
          console.log(this.orgList[index].children)
          this.secondLevel = this.orgList[index].children
          this.orgId = '请选择'
          fn()
        } else {
          console.log('else')
          this.$http.post('selOrgByParentId', JSON.stringify({
            parentId: this.parentId
          })).then((res) => {
            if (res.data.status) {
              this.orgList[index].children = res.data.data
              this.secondLevel = this.orgList[index].children
              this.orgId = '请选择'
              fn()
            }
          }).catch(err => console.log(err))
        }
      },
      saveAllHandler () {
        this.userName = this.userName.replace(/(^\s*)|(\s*$)/g, '')
        this.employeeId = this.employeeId.replace(/(^\s*)|(\s*$)/g, '')
        this.cardNo = this.cardNo.replace(/(^\s*)|(\s*$)/g, '')
        if (this.userName === '' || this.employeeId === '' || (this.parentId !== '请选择' && this.orgId === '请选择')) {
          this.$emit('alertMsg', '请完成所有信息。')
          this.redAdd = true
          return
        }
        //  ^\d{1,10}$ ,也可以这么写，\d  匹配一个数字字符，等价于[0-9]
        if (!/^[0-9]{1,10}$/g.test(this.employeeId) || parseInt(this.employeeId) >= 999999999) {
          this.$emit('alertMsg', '工号只能由数字0-9组成，最多9位。')
//          this.redAdd = true
          return
        }
        if (this.cardNo !== '' && !/^[0-9]{1,10}$/g.test(this.cardNo) || parseInt(this.cardNo) >= 4294967295) {
//          document.querySelector('#card').classList.add('red')
          this.$emit('alertMsg', '卡号只能由数字0-9组成，且小于4294967295。')
//          this.redAdd = true
          return
        }
        if (getBLen(this.userName) > 32) {
          this.$emit('alertMsg', '姓名超出长度！')
          return
        }
        if (getBLen(this.employeeId) > 32) {
          this.$emit('alertMsg', '工号超出长度！')
          return
        }
        if (getBLen(this.cardNo) > 32) {
          this.$emit('alertMsg', '卡号超出长度！')
          return
        }
        console.log('输出修改后的信息：')
        console.log({
          userId: this.userId,
          userName: this.userName,
          employeeId: this.employeeId,
          cardNo: this.cardNo,
          orgId: this.orgId,
          roleId: this.roleId
        })
        let orgId = this.orgId === '请选择' ? '' : this.orgId
        let roleId = this.roleId === '请选择' ? '' : this.roleId
        this.$http.post('editUser', JSON.stringify({
          userId: this.userId,
          userName: this.userName,
          employeeId: this.employeeId,
          cardNo: this.cardNo,
          orgId: orgId,
          roleId: roleId
        })).then((res) => {
          if (res.data.status) {
            this.redAdd = false
          }
          console.log(res.data.msg)
          this.$emit('alertMsg', res.data.msg)
        }).catch((err) => {
          console.log(err)
          this.$emit('alertMsg', '操作失败，请重试。')
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  formWidth = 500px
  .person-setting
    width 800px
    margin 0 auto
    padding-top 23vh
    .form-container
      height 307px
      form-container(formWidth)
      display inline-block
      label
        width 258px
        margin 8px auto
        &:first-of-type
          margin-top 40px
      .select-label
        select-label()
        &:before
          right 0
          width 200px
        .select-down
          top 8px
          right 4px
      label input
        text-align left
      label[for=dept]
        &:before
          width 108px
        &:after
          content ''
          display block
          position absolute
          top 6px
          right 112px
          width 88px
          height 22px
          background #fff
          z-index -2
        select
          width 98px
        #dept
          width 88px
        #second-dept
          width 108px
        #first
          right 116px
    .buttons
      display inline-block
      margin-left 75px
      vertical-align bottom
      .button
        display block
        margin 75px 0
        background-color #0077d5
</style>
