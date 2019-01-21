<template>
  <div class="message">
    <page>
      <!--<p class="title">消息列表</p>-->
      <div slot="container" class="container center">
        <div class="container-wrapper">
          <div class="message-list">
            <h4 @click="show1 = !show1">新增注册人员（{{ newPersons.length }}）<i class="icon-down" :class="show1 ? 'up' : 'down'"></i></h4>
            <table v-show="show1" cellspacing="0">
              <thead>
              <tr>
                <th>姓名</th>
                <th>工号</th>
                <th>卡号</th>
                <th>查看</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in newPersons" :key="index">
                <td>{{ item.userName || '-' }}</td>
                <td>{{ item.employeeId || '-' }}</td>
                <td>{{ item.cardNo || '-' }}</td>
                <td>
                  <router-link :to="'/person/setting/' + item.userId"><i class="icon-edit"></i></router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="message-list">
            <h4 @click="show2 = !show2">未分配角色人员（{{ noRolePersons.length }}）<i class="icon-down" :class="show2 ? 'up' : 'down'"></i></h4>
            <table v-show="show2" cellspacing="0">
              <thead>
	              <tr>
	                <th>姓名</th>
	                <th>工号</th>
	                <th>卡号</th>
	                <th>查看</th>
	              </tr>
              </thead>
              <tbody>
	              <tr v-for="(item, index) in noRolePersons" :key="index">
	                <td>{{ item.userName || '-' }}</td>
	                <td>{{ item.employeeId || '-' }}</td>
	                <td>{{ item.cardNo || '-' }}</td>
	                <td>
	                  <router-link :to="'/person/setting/' + item.userId"><i class="icon-edit"></i></router-link>
	                </td>
	              </tr>
              </tbody>
            </table>
          </div>
          <div class="message-list">
            <h4 @click="show3 = !show3">未添加角色设备（{{ noRoleDevices.length }}）<i class="icon-down" :class="show3 ? 'up' : 'down'"></i></h4>
            <table v-show="show3" cellspacing="0">
              <thead>
	              <tr>
	                <th>设备编号</th>
	                <th>设备名称</th>
	                <th>查看</th>
	              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in noRoleDevices" :key="index">
                <td>{{ item.deviceId || '-' }}</td>
                <td>{{ item.deviceName || '-' }}</td>
                <td>
                  <a href="javascript:;" @click="goDeviceAssign(item.deviceName, item.deviceId)"><i class="icon-edit"></i></a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="message-list">
            <h4 @click="show4 = !show4">上线的设备（{{ onlineDevices.length }}）<i class="icon-down" :class="show4 ? 'up' : 'down'"></i></h4>
            <table v-show="show4" cellspacing="0">
              <thead>
	              <tr>
	                <th>设备编号</th>
	                <th>设备名称</th>
	                <th>查看</th>
	              </tr>
              </thead>
              <tbody>
	              <tr v-for="(item, index) in onlineDevices" :key="index">
	                <td>{{ item.deviceId || '-' }}</td>
	                <td>{{ item.deviceName || '-' }}</td>
	                <td>
	                  <router-link :to="'/device/setting/' + item.deviceId"><i class="icon-edit"></i></router-link>
	                </td>
	              </tr>
              </tbody>
            </table>
          </div>
          <div class="message-list">
            <h4 @click="show5 = !show5">下线的设备（{{ outlineDevices.length }}）<i class="icon-down" :class="show5 ? 'up' : 'down'"></i></h4>
            <table v-show="show5" cellspacing="0">
              <thead>
	              <tr>
	                <th>设备编号</th>
	                <th>设备名称</th>
	              </tr>
              </thead>
              <tbody>
	              <tr v-for="(item, index) in outlineDevices" :key="index">
	                <td>{{ item.deviceId || '-' }}</td>
	                <td>{{ item.deviceName || '-' }}</td>
	              </tr>
              </tbody>
            </table>
          </div>
          <button class="button" @click="$router.go(-1) || $router.push('/menu')"><i class="icon-left"></i>返回</button>
          <div class="back-to-top" v-show="hasScrollbar" @click="backToTop"><i class="icon-down"></i></div>
        </div>
      </div>
    </page>
  </div>
</template>

<script>
  import Page from './Page/Page.vue'
  import Bus from '../common/js/Bus'
  export default {
    name: 'message',
    data () {
      return {
        newPersons: [],
        noRolePersons: [],
        noRoleDevices: [],
        onlineDevices: [],
        outlineDevices: [],
        show1: true,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        hasScrollbar: false
      }
    },
    created () {
      document.title = '消息列表 — 虹膜门禁管理系统'
      this.$http.post('queryMessage', '', {
        timeout: 5000
      }).then((res) => {
        if (res.data.status) {
          let data = res.data.data
          this.newPersons = data[0]
          this.noRolePersons = data[1]
          this.noRoleDevices = data[2]
          this.onlineDevices = data[3]
          this.outlineDevices = data[4]
          if (data[0].length === 0) {
            this.show1 = false
            if (data[1].length !== 0) {
              this.show2 = true
            } else {
              if (data[2].length !== 0) {
                this.show3 = true
              } else {
                if (data[3].length !== 0) {
                  this.show4 = true
                } else if (data[4].length !== 0) {
                  this.show5 = true
                }
              }
            }
          }
        }
      }).catch(err => console.log(err))
    },
    mounted () {
      window.addEventListener('scroll', this.scrollHandler)
      console.log(window.myToken)
//      document.querySelector('.show-confirm').classList.add('message-confirm')
//      this.$nextTick(() => {
//        this.goDeviceAssign('', 1)
//      })
    },
    methods: {
      scrollHandler () {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        this.hasScrollbar = scrollTop > 0
      },
      goDeviceAssign (name, id) {
        if (!name) {
          document.querySelector('.show-confirm').classList.add('message-confirm')
          Bus.$emit('confirmMsgShow', '无名称设备不能分配角色，请先设置设备名称。按确定键进入设备设置页面。', () => {
            this.$router.push('/device/setting/' + id)
          })
        } else {
          this.$router.push({name: 'RoleRightAssign', params: {deviceName: name}})
        }
      },
      backToTop () {
//        document.documentElement.scrollTop ? document.documentElement.scrollTop = 0 : document.body.scrollTop = 0
        let scrolldelay = null
        let sTop = document.documentElement.scrollTop + document.body.scrollTop
        console.log(sTop)
        let scroll = 100
        if (sTop > 10000) {
          scroll = Number(sTop / 100).toFixed()
        }
        function backTop () {
          window.scrollBy(0, -scroll)
          scrolldelay = setTimeout(backTop, 2)
          let sTop = document.documentElement.scrollTop + document.body.scrollTop
          if (sTop === 0) {
            clearTimeout(scrolldelay)
          }
        }
        backTop()
      }
    },
    components: {
      Page
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.scrollHandler)
    }
  }
</script>

<style lang="stylus" scoped>
  .up
    transform rotate(180deg)
  .down
    transform rotate(0)
  .container-wrapper
    width 700px
    margin 0 auto
    .message-list
      width 700px
      margin 10px auto
      border-radius 3px
      box-shadow 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
      h4
        position relative
        width 700px
        height 40px
        margin 0 auto
        font-size 18px
        font-weight normal
        line-height 40px
        color #fff
        background #333538
        border-radius 3px
        cursor pointer
        i
          position absolute
          top 8px
          right 14px
          font-size 24px
          transition transform 1s
      table
        width 700px
        margin -2px auto 0
        tr
          th:first-of-type
            border-left 1px solid #333538
          td:first-of-type
            border-left 1px solid #333538
        th, td
          height 38px
          border-right 1px solid #333538
          border-bottom 1px solid #333538
        th
          min-width 60px
          font-weight normal
          background #fff
        tr:last-of-type
          td:first-of-type
            border-radius 0 0 0 3px
          td:last-of-type
            border-radius 0 0 3px 0
        td
          white-space pre-wrap
          word-break break-all
          text-align center
          background #fff
          a
            text-decoration none
            i
              color #2dc5fa
              font-size 28px
    .button
      width 72px
      margin-top 40px
      font-size 18px
      color #fff
      border-radius 3px
      .icon-left
        margin-left -5px
    .back-to-top
      position fixed
      display flex
      align-items center
      justify-content center
      bottom 10%
      right 10%
      width 50px
      height 50px
      border-radius 50%
      background lighten(#d84c4c, 20%)
      box-shadow 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
      text-align center
      vertical-align middle
      line-height 50px
      font-size 28px
      color #fff
      transition transform 1s
      &:hover
        cursor pointer
        background lighten(#d84c4c, 10%)
        box-shadow 0 2px 6px 0 rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 4px 2px -2px rgba(0,0,0,.12)
      .icon-down
        margin-top -5px
        margin-left -1px
        transform rotate(180deg)
</style>
