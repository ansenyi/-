<template>
  <div>
    <div class="clearfix">
      <my-header @alertMsg="alertMsg">
        <slot></slot>
      </my-header>
      <slot name="container"></slot>
      <router-view class="container" @alertMsg="alertMsg" @confirmMsg="confirmMsg" @selectVersion="selectVersion" @roleEdit="roleEdit"
                   @getDeviceDetail="getDeviceDetail" @getPersonDetail="getPersonDetail" @deviceTable="deviceTable" @personTable="personTable"></router-view>
    </div>
    <transition name="scaleConfirm">
      <div class="show-confirm confirm" v-show="showConfirm">
        <h4 class="confirm-title">提示<i class="icon-close" @click="cancelClick"></i></h4>
        <div class="confirm-content">
          {{ confirmMessage }}
        </div>
        <button class="confirm-left confirm-button" @click="confirmClick">确 定</button>
        <button class="cancel-right confirm-button" @click="cancelClick">取 消</button>
      </div>
    </transition>
    <transition name="scaleSelect">
      <div class="show-select confirm" v-show="showSelect">
        <h4 class="confirm-title">选择版本<i class="icon-close" @click="cancelVersionClick"></i></h4>
        <div class="confirm-content">
          <label class="select-label">
            可选版本：
            <select v-model="version">
              <option disabled selected v-show="false" value="请选择">请选择</option>
              <option v-for="n in versionList" :value="n">{{ n }}</option>
            </select>
            <i class="select-down icon-down"></i>
          </label>
        </div>
        <button class="confirm-left confirm-button" @click="confirmVersionClick">确 定</button>
        <button class="cancel-right confirm-button" @click="cancelVersionClick">取 消</button>
      </div>
    </transition>
    <transition name="scaleAlert">
      <div class="alert" v-show="showAlert">
        <h4 class="confirm-title">提示<i class="icon-close" @click="closeAlert"></i></h4>
        <div class="confirm-content">
          {{ alertMessage }}
        </div>
        <button class="confirm-button" @click="closeAlert">确 定</button>
      </div>
    </transition>
    <transition name="scaleDeviceDetail">
      <div class="show-detail" v-show="showDeviceDetail">
        <h4 class="confirm-title">设备详情<i class="icon-close" @click="closeDeviceDetail"></i></h4>
        <div class="confirm-content">
          <div class="detail-bar" v-bar>
            <ul>
              <li v-for="item in Object.keys(deviceDetail)">{{item}}：{{deviceDetail[item]}}</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <transition name="scalePersonDetail">
      <div class="show-detail" v-show="showPersonDetail">
        <h4 class="confirm-title">人员详情<i class="icon-close" @click="closePersonDetail"></i></h4>
        <div class="confirm-content">
          <div class="detail-bar" v-bar>
            <ul>
              <li v-for="item in Object.keys(personDetail)">{{item}}：{{personDetail[item]}}</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <transition name="scaleEditRole">
      <div class="show-editRole confirm" v-show="showEditRole">
        <h4 class="confirm-title">{{ roleTitle }}<i class="icon-close" @click="cancelEditRoleClick"></i></h4>
        <div class="confirm-content">
          <label for="role-name">角色名称<span style="color: #d84c4c;font-size: 20px;">*</span>：
            <input id="role-name" type="text" v-model="role.roleName" :class="pageRedAdd && role.roleName === '' ? 'red' : ''" autocomplete="off" />
          </label>
          <label for="role-def">
            <input id="role-def" type="checkbox" v-model="role.roleType">
            默认角色
          </label>
          <label for="role-allow">
            <input id="role-allow" type="checkbox" v-model="role.openDoor">
            允许开门
          </label>
          <label for="role-desc">角色描述：<span style="opacity: 0;font-size: 20px;">*</span>
            <textarea id="role-desc" v-model="role.roleDesc" cols="19" rows="5"></textarea>
          </label>
        </div>
        <button class="confirm-left confirm-button" @click="confirmEditRoleClick">确 定</button>
        <button class="cancel-right confirm-button" @click="cancelEditRoleClick">取 消</button>
      </div>
    </transition>
    <transition name="scaleDeviceTable">
      <div class="show-device-table alert" v-show="showDTable">
        <div class="page-table-wrapper">
          <h4>设备 <span>{{ deviceTableName }}</span> 下的人员<i class="icon-close" @click="closeDeviceTable"></i></h4>
          <div class="overflow-table" v-bar>
            <div class="table-wrapper">
              <table cellspacing="0">
                <thead>
                <tr>
                  <th v-for="th in deviceThead">{{ th }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(items, index) in deviceTableData" :key="index">
                  <td v-for="(item, index) in items" :key="index">{{ item }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="scalePersonTable">
      <div class="show-person-table alert" v-show="showPTable">
        <div class="page-table-wrapper">
          <h4><span>{{ personTableName }}</span> 所属的设备<i class="icon-close" @click="closePersonTable"></i></h4>
          <div class="overflow-table" v-bar>
            <div class="table-wrapper">
              <table cellspacing="0">
                <thead>
                <tr>
                  <th v-for="th in personThead">{{ th }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(items, index) in personTableData" :key="index">
                  <td v-for="(item, index) in items" :key="index">{{ item }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="mask" v-show="showAlert || showConfirm || showSelect || showDeviceDetail || showPersonDetail || showEditRole || showDTable || showPTable"
         :style="{background: showAlert && !showEditRole ? 'transparent' : 'rgba(0, 0, 0, .6)'}" @click="closePersonDetail();closeDeviceDetail();closePersonTable();closeDeviceTable();"></div>
    <!--<footer>-->
      <!--<p>-->
        <!--<router-link to="/about-irisian">关于聚虹</router-link> |-->
        <!--<router-link to="/help">帮助</router-link>-->
      <!--</p>-->
      <!--<p>Copyright @  2015上海聚虹光电科技有限公司&nbsp;&nbsp;保留所有权利&nbsp;&nbsp;&nbsp;&nbsp;沪ICP备13029784号</p>-->
      <!--<p>上海聚虹光电科技有限公司官方网站 : <a target="_blank" href="http://www.irisian.com">http://www.irisian.com</a></p>-->
    <!--</footer>-->
  </div>
</template>

<script>
  import Bus from '../../common/js/Bus'
  import myHeader from '../Header/Header.vue'
  import { getBLen } from '../../common/js/util'
  export default {
    name: 'page',
    data () {
      return {
        showConfirm: false,
        showAlert: false,
        showSelect: false,
        alertMessage: '',
        confirmMessage: '',
        version: '请选择',
        confirmCallback: null,
        versionCallback: null,
        versionList: [],
        deviceDetail: {},
        personDetail: {},
        showDeviceDetail: false,
        showPersonDetail: false,
        showEditRole: false,
        roleTitle: '',
        role: {
          roleName: '',
          roleType: false,
          openDoor: false,
          roleDesc: ''
        },
        editRoleCallback: null,
        pageRedAdd: false,
        showDTable: false,
        deviceTableData: null,
        showPTable: false,
        personTableData: null,
        deviceTableName: '',
        personTableName: '',
        deviceThead: ['姓名', '工号', '卡号', '角色', '部门', '性别', '管理员'],
        personThead: ['设备编号', '设备名称', '防拆开关', '注册开关', '连接状态', '设备占用率']
      }
    },
    mounted () {
      Bus.$on('alertMsgShow', this.alertMsg)
      Bus.$on('confirmMsgShow', this.confirmMsg)
    },
    methods: {
      alertMsg (msg) {
        this.alertMessage = msg
        this.showAlert = true
      },
      closeAlert () {
        this.alertMessage = ''
        this.showAlert = false
      },
      closeDeviceDetail () {
        this.deviceDetail = {}
        this.showDeviceDetail = false
      },
      closePersonDetail () {
        this.personDetail = {}
        this.showPersonDetail = false
      },
      closeDeviceTable () {
        this.deviceTableName = ''
        this.showDTable = false
        this.deviceTableData = []
      },
      closePersonTable () {
        this.personTableName = ''
        this.showPTable = false
        this.personTableData = []
      },
      confirmMsg (msg, callback) {
        this.confirmMessage = msg
        this.confirmCallback = callback
        this.showConfirm = true
      },
      selectVersion (versionList, callback) {
        this.showSelect = true
        this.versionList = versionList
        this.versionCallback = callback
      },
      async roleEdit (title, getRes, callback) {
        this.showEditRole = true
        this.roleTitle = title
        if (getRes) {
          this.role = await getRes()
        }
        this.editRoleCallback = callback
      },
      async getDeviceDetail (getRes) {
        this.showDeviceDetail = true
        this.deviceDetail = await getRes()
      },
      async getPersonDetail (getRes) {
        this.showPersonDetail = true
        this.personDetail = await getRes()
      },
      async deviceTable (name, getRes) {
        this.deviceTableName = name
        this.showDTable = true
        this.deviceTableData = await getRes()
      },
      async personTable (name, getRes) {
        this.personTableName = name
        this.showPTable = true
        this.personTableData = await getRes()
      },
      confirmClick () {
        this.confirmCallback()
        this.confirmMessage = ''
        this.confirmCallback = null
        this.showConfirm = false
      },
      confirmVersionClick () {
        this.versionCallback(this.version)
        this.version = '请选择'
        this.versionList = []
        this.versionCallback = null
        this.showSelect = false
      },
      confirmEditRoleClick () {
        this.role.roleName = this.role.roleName.replace(/(^\s*)|(\s*$)/g, '')
        this.role.roleDesc = this.role.roleDesc.replace(/(^\s*)|(\s*$)/g, '')
        if (this.role.roleName === '') {
//          document.querySelector('#role-name').classList.add('red')
          this.pageRedAdd = true
          return
        }
        if (getBLen(this.role.roleName) > 128) {
          this.alertMsg('角色名称超出长度！')
          return
        }
        if (getBLen(this.role.roleDesc) > 256) {
          this.alertMsg('角色描述超出长度！')
          return
        }
        this.editRoleCallback(this.role)
        this.editRoleCallback = null
        this.roleTitle = ''
        this.role = {
          roleName: '',
          roleType: false,
          openDoor: false,
          roleDesc: ''
        }
        this.showEditRole = false
      },
      cancelClick () {
        this.confirmMessage = ''
        this.confirmCallback = null
        this.showConfirm = false
      },
      cancelVersionClick () {
        this.version = '请选择'
        this.versionList = []
        this.versionCallback = null
        this.showSelect = false
      },
      cancelEditRoleClick () {
        this.editRoleCallback = null
        this.roleTitle = ''
        this.role = {
          roleName: '',
          roleType: false,
          openDoor: false,
          roleDesc: ''
        }
        this.showEditRole = false
      }
//      clearRed (e) {
//        let target = e ? e.target : window.event.srcElement
//        if (this.pageRedAdd && target.classList.contains('red')) {
//          console.log('remove')
//          target.classList.remove('red')
//        }
//      },
//      addRed (e) {
//        let target = e ? e.target : window.event.srcElement
//        this.role.roleName = this.role.roleName.replace(/(^\s*)|(\s*$)/g, '')
//        if (this.pageRedAdd && this.role.roleName === '') {
//          target.classList.add('red')
//        }
//      }
    },
    components: {
      myHeader
    }
  }
</script>

<style lang="stylus">
  @import '../../common/stylus/mixin.styl'
  .scaleConfirm-enter-active, .scaleSelect-enter-active, .scaleAlert-enter-active, .scaleDeviceDetail-enter-active, .scalePersonDetail-enter-active, .scaleEditRole-enter-active, .scaleDeviceTable-enter-active, .scaleDeviceTable-enter-active
    transition transform .1s, opacity .1s
  .scaleConfirm-enter, .scaleSelect-enter, .scaleAlert-enter, .scaleDeviceDetail-enter, .scalePersonDetail-enter, .scaleEditRole-enter, .scaleDeviceTable-enter, .scalePersonTable-enter
    transform scale(0)
    opacity 0
  .scaleConfirm-leave-active, .scaleSelect-leave-active, .scaleAlert-leave-active, .scaleDeviceDetail-leave-active, .scalePersonDetail-leave-active, .scaleEditRole-leave-active, .scaleDeviceTable-leave-active, .scaleDeviceTable-leave-active
    transition opacity .1s
  .scaleConfirm-leave-to, .scaleSelect-leave-to, .scaleAlert-leave-to, .scaleDeviceDetail-leave-to, .scalePersonDetail-leave-to, .scaleEditRole-leave-to, .scaleDeviceTable-leave-to, .scaleDeviceTable-leave-to
    opacity 0
  .message-confirm
    .confirm-content
      font-size 16px !important
      line-height 24px
      padding-top 35px !important
    .confirm-left
      color #000 !important
      background #0077d5 !important
    .cancel-right
      color #eee !important
      background #777 !important
  .title
    flex 0 0 10%
    margin 10px auto 5px
    font-size 16px
    color #fff
    text-align center
  .section
    position fixed
    top 0
    left 0
    margin-top 40px
    padding-bottom 5px
    width 100%
    height 50px
    text-align center
    color #fff
    font-size 14px
    background #0077d5
    box-shadow 0 5px 5px -5px rgba(0, 0, 0, .5)
    a
      text-decoration none
      outline none
      color #2dc5fa
      &:hover
        color #fff
      &:not(:last-child)
        padding-right 15px
      &:not(:first-child)
        padding-left 15px
  .container
    padding-top 126px
    padding-bottom 50px
    width 100%
    min-height 100vh
    box-sizing border-box
  titleWidth = 360px
  titleHeight = 36px
  contentHeight = 160px
  confirmWidth = 66px
  confirmHeight = 32px
  .alert, .confirm, .show-detail
    position fixed
    top 50%
    left 50%
    margin-top - (titleHeight / 2 + contentHeight / 2 + 40px)
    margin-left - (titleWidth / 2 + 10px)
    width titleWidth
    z-index 999
    confirm-container(titleWidth, titleHeight, contentHeight, confirmWidth, confirmHeight)
    .confirm-title
      position relative
      border-radius 2px 2px 0 0
      i
        position absolute
        top 7px
        right 6px
        font-size 20px
        &:hover
          color #fff
          cursor default
    .confirm-content
      padding 45px 18px 30px 18px
      box-sizing border-box
      text-align center
      font-size 17px
      color #fff
      border-radius 0 0 2px 2px
      box-shadow 0 2px 6px 0 rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 4px 2px -2px rgba(0,0,0,.12)
      .select-label
        margin 5px 0
        select-label()
        select
          margin-top 5px
          width 80px
        &:before
          width 80px
          top -3px
          left 90px
        .select-down
          top 0
          left 148px
    .confirm-button
      position absolute
      bottom 20px
      display block
      right 30px
      border-radius 1px
      /*background-color #0077d5*/
      cursor default
  .alert
    z-index 1000
    word-break keep-all
    line-height 22px
  .confirm
    .confirm-left
      left 20px
      color #eee
      background #777
      cursor pointer
    .cancel-right
      right 50px
      cursor pointer
  .show-detail
    width 360px
    margin-top - (titleHeight / 2 + 420px / 2)
    margin-left - (360px / 2 + 10px)
    .confirm-title
      width 360px
      font-size 18px
    .confirm-content
      width 360px - 18px
      height 420px
      padding 25px 0
      font-size 16px
      text-align left
      .detail-bar
        width 335px
        height 360px
        ul
          margin 0
          padding 0
          padding-left 30px
          list-style none
          li
            width 300px
            padding 5px
  .show-editRole
    margin-top -158px
    margin-left -210px
    .confirm-title
      width 418px
    .confirm-content
      padding-top 35px
      width 400px
      height 280px
      font-size 16px
      label[for=role-name], label[for=role-desc]
        display block
        input, textarea
          width 189px
          box-sizing border-box
      label[for=role-def], label[for=role-allow]
        display inline-block
        margin 14px 0
        font-size 14px
        text-align left
      label[for=role-def]
        margin-left 92px
      label[for=role-allow]
        margin-left 40px
      label[for=role-desc]
        textarea
          vertical-align top
    .confirm-left
      left 80px
      color #fff
      background #0077d5
    .cancel-right
      right 20px
  .show-select
    select
      padding-right 20px !important
      outline none
  .show-device-table, .show-person-table
    width 700px
    margin-top -180px
    margin-left -350px
    border-radius 3px
    box-shadow 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
    h4
      position relative
      width 700px
      height 40px
      margin 0 auto
      font-size 18px
      text-align center
      font-weight normal
      line-height 40px
      color #fff
      background #333538
      border-radius 3px 3px 0 0
      span
        color #aa2e30
      i
        position absolute
        top 8px
        right 14px
        font-size 24px
        &:hover
          color #fff
          cursor pointer
    .overflow-table
      max-height 330px
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
  .mask
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    background transparent
    z-index 998
</style>
