<template>
  <div class="device-setting">
    <form class="form-container">
      <h4 class="form-title">设备参数</h4>
      <div class="label-wrapper" v-bar>
        <div class="label-container">
          <label for="deviceId">
            <span>设备编号：</span>
            <input id="deviceId" type="text" v-model="deviceId" readonly />
          </label>
          <label for="deviceName">
            <span>设备名称：</span>
            <input id="deviceName" type="text" v-model="deviceName" :class="redAdd && deviceName === '' ? 'red' : ''" autocomplete="off" />
          </label>
          <label for="url">
            <span>主服务器url：</span>
            <input id="url" type="text" v-model="url" :class="redAdd && url === '' ? 'red' : ''" autocomplete="off" />
          </label>
          <label for="url2">
            <span>次服务器url：</span>
            <input id="url2" type="text" v-model="url2" :class="redAdd && url2 === '' ? 'red' : ''" autocomplete="off" />
          </label>
          <label for="port">
            <span>Mina服务器端口：</span>
            <input id="port" placeholder="0-65535之间的整数" type="text" v-model="port" :class="redAdd && port === '' ? 'red' : ''" autocomplete="off" />
          </label>
          <label for="port2">
            <span>http服务器端口：</span>
            <input id="port2" placeholder="0-65535之间的整数" type="text" v-model="port2" :class="redAdd && port2 === '' ? 'red' : ''" autocomplete="off" />
          </label>
          <label for="maxCapacity">
            <span>设备容量：</span>
            <input id="maxCapacity" placeholder="0-1500之间的整数" type="text" v-model="maxCapacity" :class="redAdd && maxCapacity === '' ? 'red' : ''" autocomplete="off" />
          </label>
          <label for="heartBeat" class="select-label">
            终端心跳：
            <div class="select-wrapper">
              <select id="heartBeat" v-model="heartBeat" :class="redAdd && heartBeat === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option v-for="n in [30, 60, 120, 180]" :value="String(n)">{{ n }}秒</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="overTime" class="select-label">
            超时时间：
            <div class="select-wrapper">
              <select id="overTime" v-model="overTime" :class="redAdd && overTime === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option v-for="n in [10, 20, 30]" :value="String(n)">{{ n }}秒</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="resendCount" class="select-label">
            重发次数：
            <div class="select-wrapper">
              <select id="resendCount" v-model="resendCount" :class="redAdd && resendCount === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option v-for="n in [1, 2, 3, 4, 5]" :value="String(n)">{{ n }}</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="wiegand" class="select-label">
            通讯协议：
            <div class="select-wrapper">
              <select id="wiegand" v-model="wiegand" @change="outputMsgIsShow=!outputMsgIsShow">
                <!--<option disabled selected v-show="false" value="请选择">请选择</option>-->
                <option value="0">韦根 26</option>
                <option value="1">韦根 34</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="outputType" class="select-label">
            输出类型：
            <div class="select-wrapper">
              <select id="outputType" v-model="outputType" :class="redAdd && outputType === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option value="1">工号</option>
                <option value="2">卡号</option>
                <option value="0">固定输出</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="outputMsg">
            固定输出内容：
            <input type="text" placeholder="不大于16777215的正整数" id="outputMsg" v-model="outputMsg" v-show="outputMsgIsShow" autocomplete="off"  :class="{red:redAdd}" />
            <input type="text" placeholder="不大于4294967295的正整数" id="outputMsg" v-model="outputMsg" v-show="!outputMsgIsShow" autocomplete="off"  :class="{red:redAdd}"/>
          </label>
          <label for="entryType" class="select-label">
            进出类型：
            <div class="select-wrapper">
              <select id="entryType" v-model="entryType" :class="redAdd && entryType === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option value="0">无</option>
                <option value="1">进入</option>
                <option value="2">离开</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="matchType" class="select-label">
            比对方式：
            <div class="select-wrapper">
              <select id="matchType" v-model="matchType" :class="redAdd && matchType === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option value="0">虹膜对比</option>
                <option value="1">卡与虹膜对比</option>
                <option value="2">卡或虹膜对比</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="delayTime" class="select-label">
            门禁延时：
            <div class="select-wrapper">
              <select id="delayTime" v-model="delayTime" :class="redAdd && delayTime === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option v-for="n in [1,3,5,10,20]" :value="String(n)">{{ n }}秒</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="protectLock" class="select-label">
            防拆开关：
            <div class="select-wrapper">
              <select id="protectLock" v-model="protectLock" :class="redAdd && protectLock === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option value="1">开</option>
                <option value="0">关</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <label for="privilege" class="select-label">
            注册开关：
            <div class="select-wrapper">
              <select id="privilege" v-model="privilege" :class="redAdd && privilege === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option value="1">开</option>
                <option value="0">关</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <!--<label for="wiegandEndian" class="select-label">-->
            <!--韦根大小端：-->
            <!--<div class="select-wrapper">-->
              <!--<select id="wiegandEndian" v-model="wiegandEndian" @click="clearRed($event)" @blur="addRed($event)">-->
                <!--<option disabled selected v-show="false" value="请选择">请选择</option>-->
                <!--<option value="1">大端</option>-->
                <!--<option value="0">小端</option>-->
              <!--</select>-->
              <!--<i class="select-down icon-down"></i>-->
            <!--</div>-->
          <!--</label>-->
          <!--<label for="wiegandHex" class="select-label">-->
            <!--韦根输出进制：-->
            <!--<div class="select-wrapper">-->
              <!--<select id="wiegandHex" v-model="wiegandHex" @click="clearRed($event)" @blur="addRed($event)">-->
                <!--<option disabled selected v-show="false" value="请选择">请选择</option>-->
                <!--<option value="1">十六进制</option>-->
                <!--<option value="0">十进制</option>-->
              <!--</select>-->
              <!--<i class="select-down icon-down"></i>-->
            <!--</div>-->
          <!--</label>-->
        </div>
      </div>
      <div class="save-back-button">
        <button class="button" @click.prevent="saveEdit()">保存</button>
        <button class="button" @click.prevent="$router.go(-1) || $router.push('../../device/preview')">返回</button>
      </div>
    </form>
    <div class="buttons" v-if="online" v-show="!isLoading">
      <button class="button" @click="terminalControl('关机', 0)">关机</button>
      <button class="button" @click="terminalControl('重启', 1)">重启</button>
      <button class="button" @click="versionControl('强制升级', 3)">强制升级</button>
      <button class="button" @click="terminalControl('版本回退', 4)">版本回退</button>
      <button class="button" @click="terminalControl('强制开门', 5)">强制开门</button>
    </div>
    <div class="buttons loading-buttons" v-if="online" v-show="isLoading">
      <button class="button loading-button">关机</button>
      <button class="button loading-button">重启</button>
      <button class="button loading-button">强制升级</button>
      <button class="button loading-button">版本回退</button>
      <button class="button loading-button">强制开门</button>
    </div>
    <div class="buttons disabled-buttons" v-else>
      <button class="button disabled-button">关机</button>
      <button class="button disabled-button">重启</button>
      <button class="button disabled-button">强制升级</button>
      <button class="button disabled-button">版本回退</button>
      <button class="button disabled-button">强制开门</button>
    </div>
    <div class="console-container">
      <h4 class="console-title">操作记录</h4>
      <div class="console-content">
        <p v-for="(item, index) in msg" :key="index">
          <span>{{ item.detail }}</span>
          <span :class="item.status === '失败' ? 'failed' : 'succeed'">{{ item.status }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-expressions */
  import { _debounce, getBLen } from '../../common/js/util'
  export default {
    name: 'device-setting',
    props: ['deviceId'],
    data () {
      return {
        deviceName: '',
        delayTime: '请选择',
        url: '',
        url2: '',
        port: '',
        port2: '',
        heartBeat: '请选择', // int
        overTime: '请选择', // int
        resendCount: '请选择',
        wiegand: '0',
        outputType: '请选择',
        outputMsg: '',
        entryType: '请选择',
        matchType: '请选择',
        protectLock: '请选择',
        privilege: '请选择',
        wiegandEndian: '0',
        wiegandHex: '0',
        maxCapacity: '',
        redAdd: false,
        // userDefined: false,
        initial: {},
        msg: [],
        saveEdit: _debounce(this.saveEditHandler),
        online: true,
        isLoading: false,
        outputMsgIsShow: {}
      }
    },
//    computed: {
//      userDefined () {
//        return this.outputType === '0'
//      }
//    },
    created () {
      document.title = '修改设备信息 — 虹膜门禁管理系统'
//    this.outputMsgIsShow = this.wiegand === '0' ? this.outputMsgIsShow : false
      this.$http.post('getDevice', JSON.stringify({
        deviceId: this.deviceId
      })).then((res) => {
        console.log(res.data)
        console.log(res.data.data.outputMsg)
        if (res.data.status) {
          let data = res.data.data
          this.initial = data
          data.hasOwnProperty('deviceName') ? this.deviceName = data.deviceName : null
          data.hasOwnProperty('wiegand') ? this.wiegand = String(data.wiegand) : null
          data.hasOwnProperty('heartBeat') ? this.heartBeat = String(data.heartBeat) : null
          data.hasOwnProperty('overTime') ? this.overTime = String(data.overTime) : null
          data.hasOwnProperty('resendCount') ? this.resendCount = String(data.resendCount) : null
          data.hasOwnProperty('url') ? this.url = String(data.url) : null
          data.hasOwnProperty('url2') ? this.url2 = String(data.url2) : null
          data.hasOwnProperty('port') ? this.port = String(data.port) : null
          data.hasOwnProperty('port2') ? this.port2 = String(data.port2) : null
          data.hasOwnProperty('maxCapacity') ? this.maxCapacity = String(data.maxCapacity) : null
//          data.hasOwnProperty('wiegandEndian') ? this.wiegandEndian = String(data.wiegandEndian) : null
//          data.hasOwnProperty('wiegandHex') ? this.wiegandHex = String(data.wiegandHex) : null
          data.hasOwnProperty('outputType') ? this.outputType = String(data.outputType) : null
          data.hasOwnProperty('entryType') ? this.entryType = String(data.entryType) : null
          data.hasOwnProperty('matchType') ? this.matchType = String(data.matchType) : null
          data.hasOwnProperty('delayTime') ? this.delayTime = String(data.delayTime) : null
          data.hasOwnProperty('protectLock') ? this.protectLock = String(data.protectLock) : null
          data.hasOwnProperty('outputMsg') ? this.outputMsg = data.outputMsg : null
          data.hasOwnProperty('softwareVersion') ? this.softwareVersion = String(data.softwareVersion) : null
          data.hasOwnProperty('privilege') ? this.privilege = String(data.privilege) : null
          console.log(this.wiegand === '0')
          this.outputMsgIsShow = this.wiegand === '0' ? this.outputMsgIsShow : false
          if (!data.online) {
            this.$emit('alertMsg', '设备 ' + this.deviceName + ' 不在线，不能进行终端控制操作。')
            this.online = false
          }
        }
      }).catch(err => console.log(err))
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
//    watch: {
//      outputType (val) {
//        if (val !== '0') {
//          this.outputMsg = ''
//        }
//      }
//    },
    methods: {
//      outputChange () {
//        this.userDefined = this.outputType === '0'
//      },
      versionControl (act, i) {
        if (i !== 3 || act !== '强制升级') {
          return
        }
        this.$http.post('getAllVersionUp', JSON.stringify({
          softwareVersion: this.softwareVersion
        })).then((res) => {
          if (res.data.status) {
            if (!res.data.data.length) {
              this.$emit('alertMsg', '已是最新版本。')
            } else {
              this.$emit('selectVersion', res.data.data, (v) => {
                this.controlCallBack(act, i, v)()
              })
            }
          } else {
            this.$emit('alertMsg', res.data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$emit('alertMsg', '操作失败，请重试。')
        })
      },
      terminalControl (act, i) {
        if (!(i === 0 || i === 1 || i === 4 || i === 5)) {
          return
        }
        if ((act === '关机' && i !== 0) || (act === '重启' && i !== 1) || (act === '版本回退' && i !== 4) || (act === '强制开门' && i !== 5)) {
          return
        }
        let msg = '确认' + act + '吗？'
//        if (i === 4) {
//          msg = `当前软件版本为${this.softwareVersion}，` + msg
//        }
        if (i !== 4) {
          this.$emit('confirmMsg', msg, this.controlCallBack(act, i, ''))
        } else {
          msg = `当前软件版本为${this.softwareVersion}，` + msg
          this.$emit('confirmMsg', msg, this.controlCallBack(act, i, this.softwareVersion))
        }
      },
      controlCallBack (act, i, v) {
        // 4
        let detail = act
        return () => {
          this.isLoading = true
          this.$http.post('terminalController', JSON.stringify({
            deviceId: this.deviceId,
            cmdID: i,
            param: v
          }), {
            timeout: 10000
          }).then((res) => {
            this.isLoading = false
            console.log(res.data.data[0])
            console.log(res.data.data[0][this.deviceId] === 0)
            if (res.data.status && res.data.data[0][this.deviceId] === 0) {
              if (i === 3 || i === 4) {
                if (i === 4) {
                  this.softwareVersion = res.data.data[1].backVersion
                } else {
                  this.softwareVersion = v
                }
                detail = act + '：' + this.softwareVersion
                this.$emit('alertMsg', `操作成功，当前版本为${this.softwareVersion}，正在更新到设备...`)
              } else {
                this.$emit('alertMsg', '操作成功！')
              }
              this.msg.push({detail: detail, status: '成功'})
            } else {
              this.$emit('alertMsg', res.data.msg)
              this.msg.push({detail: detail, status: '失败'})
            }
          }).catch((err) => {
            console.log(err)
            this.isLoading = false
            this.$emit('alertMsg', '操作失败，请重试。')
            this.msg.push({detail: detail, status: '失败'})
          })
        }
      },
      saveEditHandler () {
        this.deviceName = this.deviceName.replace(/(^\s*)|(\s*$)/g, '')
        this.url = this.url.replace(/(^\s*)|(\s*$)/g, '')
        this.url2 = this.url2.replace(/(^\s*)|(\s*$)/g, '')
        this.port = this.port.replace(/(^\s*)|(\s*$)/g, '')
        this.port2 = this.port2.replace(/(^\s*)|(\s*$)/g, '')
        this.maxCapacity = this.maxCapacity.replace(/(^\s*)|(\s*$)/g, '')
        this.outputMsg = this.outputMsg.replace(/(^\s*)|(\s*$)/g, '')
        console.log('saveEdit')
//        if (this.deviceName === '') {
//          document.querySelector('#deviceName').classList.add('red')
//        }
//        if (this.url === '') {
//          document.querySelector('#url').classList.add('red')
//        }
//        if (this.url2 === '') {
//          document.querySelector('#url2').classList.add('red')
//        }
//        if (this.port === '') {
//          document.querySelector('#port').classList.add('red')
//        }
//        if (this.port2 === '') {
//          document.querySelector('#port2').classList.add('red')
//        }
//        if (this.maxCapacity === '') {
//          document.querySelector('#maxCapacity').classList.add('red')
//        }
//        if (this.wiegand === '请选择' || this.wiegand === '') {
//          document.querySelector('#wiegand').classList.add('red')
//        }
//        if (this.matchType === '请选择' || this.matchType === '') {
//          document.querySelector('#matchType').classList.add('red')
//        }
//        if (this.delayTime === '请选择' || this.delayTime === '') {
//          document.querySelector('#delayTime').classList.add('red')
//        }
//        if (this.heartBeat === '请选择' || this.heartBeat === '') {
//          document.querySelector('#heartBeat').classList.add('red')
//        }
//        if (this.overTime === '请选择' || this.overTime === '') {
//          document.querySelector('#overTime').classList.add('red')
//        }
//        if (this.resendCount === '请选择' || this.resendCount === '') {
//          document.querySelector('#resendCount').classList.add('red')
//        }
//        if (this.outputType === '请选择' || this.outputType === '') {
//          document.querySelector('#outputType').classList.add('red')
//        }
//        if (this.entryType === '请选择' || this.entryType === '') {
//          document.querySelector('#entryType').classList.add('red')
//        }
//        if (this.protectLock === '请选择' || this.protectLock === '') {
//          document.querySelector('#protectLock').classList.add('red')
//        }
//        if (this.privilege === '请选择' || this.privilege === '') {
//          document.querySelector('#privilege').classList.add('red')
//        }
//        if (this.wiegandEndian === '请选择' || this.wiegandEndian === '') {
//          document.querySelector('#wiegandEndian').classList.add('red')
//        }
//        if (this.wiegandHex === '请选择' || this.wiegandHex === '') {
//          document.querySelector('#wiegandHex').classList.add('red')
//        }
        if (this.deviceId === '' || this.deviceName === '' || this.url === '' || this.url2 === '' || this.port === '' || this.port2 === '' || this.maxCapacity === '' || this.wiegand === '请选择' || this.matchType === '请选择' || this.delayTime === '请选择' || this.heartBeat === '请选择' || this.overTime === '请选择' || this.resendCount === '请选择' || this.outputType === '请选择' || this.protectLock === '请选择' || this.privilege === '请选择') { // || this.wiegandEndian === '请选择' || this.wiegandEndian === ''  || this.wiegandHex === '请选择' || this.wiegandHex === ''
          this.$emit('alertMsg', '请完成所有信息。')
          this.redAdd = true
          return
        }
        let urlRe = /[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
        if (!urlRe.test(this.url)) {
          this.$emit('alertMsg', '主服务器url地址不规范。')
          return
        }
        if (!urlRe.test(this.url2)) {
          this.$emit('alertMsg', '次服务器url地址不规范。')
          return
        }
//        if (this.url === this.url2 || (this.url[this.url.length - 1] === '/' && this.url.slice(0, -1) === this.url2) || (this.url2[this.url2.length - 1] === '/' && this.url2.slice(0, -1) === this.url)) {
//          this.$emit('alertMsg', '主、次服务器url不能相同。')
//          return
//        }
        let re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
        if (!re.test(this.port) || !re.test(this.port2)) {
          this.$emit('alertMsg', '端口号必须为0-65535之间的整数。')
          return
        }
        let re1 = /^([0-9]|[1-9]\d|[1-9]\d{2}|1[0-4]\d{2}|1500)$/
        if (!re1.test(this.maxCapacity)) {
          this.$emit('alertMsg', '设备容量必须为0-1500之间的整数。')
          return
        }
//      if (this.outputMsg !== '' && (!/^[0-9]{1,10}$/g.test(this.outputMsg) || parseInt(this.outputMsg) >= 999999999)) {
//        this.$emit('alertMsg', '固定输出内容只能由数字0-9组成，最多9位。')
//        return
//      }
        console.log(this.wiegand === '0')
        console.log(parseInt(this.outputMsg))
        if (this.wiegand === '0') {
          if (parseInt(this.outputMsg) < 0 || parseInt(this.outputMsg) > 16777215) {
            console.log('请输入不大于16777215的正整数。')
            this.$emit('alertMsg', '请输入不大于16777215的正整数。')
            this.redAdd = true
            return
          }
        } else {
          if (parseInt(this.outputMsg) < 0 || parseInt(this.outputMsg) > 4294967295) {
            this.$emit('alertMsg', '请输入不大于4294967295的正整数。')
            this.redAdd = true
            return
          }
        }
//        if (parseInt(this.maxCapacity) > 1500) {
//          this.$emit('alertMsg', '设备容量最大不能超过1500。')
//          return
//        }
        //
//        if (isNaN(parseInt(this.heartBeat))) {
//          this.$emit('alertMsg', '终端心跳必须为整数。')
//          return
//        }
//        //
//        if (isNaN(parseInt(this.overTime))) {
//          this.$emit('alertMsg', '超时时间必须为整数。')
//          return
//        }
//        //
//        if (isNaN(parseInt(this.resendCount))) {
//          this.$emit('alertMsg', '重发次数必须为整数。')
//          return
//        }
        if (getBLen(this.deviceName) > 128) {
          this.$emit('alertMsg', '设备名称超出长度！')
          return
        }
        if (getBLen(this.url) > 256) {
          this.$emit('alertMsg', '主服务器url超出长度！')
          return
        }
        if (getBLen(this.url2) > 256) {
          this.$emit('alertMsg', '次服务器url超出长度！')
          return
        }
//        if (getBLen(this.heartBeat) > 11) {
//          this.$emit('alertMsg', '终端心跳超出范围。')
//          return
//        }
//        if (getBLen(this.overTime) > 11) {
//          this.$emit('alertMsg', '超时时间超出范围。')
//          return
//        }
//        if (getBLen(this.resendCount) > 11) {
//          this.$emit('alertMsg', '重发次数超出范围。')
//          return
//        }
        if (getBLen(this.outputMsg) > 256) {
          this.$emit('alertMsg', '输出类型超出长度！')
          return
        }
        if (isNaN(parseInt(this.matchType)) || isNaN(parseInt(this.delayTime)) || isNaN(parseInt(this.wiegand)) || isNaN(parseInt(this.privilege)) || isNaN(parseInt(this.outputType)) || isNaN(parseInt(this.protectLock)) || isNaN(parseInt(this.entryType)) || isNaN(parseInt(this.heartBeat)) || isNaN(parseInt(this.resendCount)) || isNaN(parseInt(this.overTime))) { //  || isNaN(parseInt(this.wiegandEndian)) || isNaN(parseInt(this.wiegandHex))
          console.log('isNaN')
          return
        }
        let detail = this.toDetail()
        if (detail === '') {
          this.$emit('alertMsg', '尚未修改任何信息。')
          return
        }
        console.log(detail)
        this.$http.post('editDevice', JSON.stringify({
          deviceId: this.deviceId,
          deviceName: this.deviceName,
          delayTime: parseInt(this.delayTime),
          url: this.url,
          url2: this.url2,
          port: parseInt(this.port),
          port2: parseInt(this.port2),
          wiegand: parseInt(this.wiegand),
          matchType: parseInt(this.matchType),
          maxCapacity: parseInt(this.maxCapacity),
          heartBeat: parseInt(this.heartBeat),
          overTime: parseInt(this.overTime),
          resendCount: parseInt(this.resendCount),
          privilege: parseInt(this.privilege),
          outputType: parseInt(this.outputType),
          entryType: parseInt(this.entryType),
          outputMsg: this.outputMsg,
          protectLock: parseInt(this.protectLock),
          wiegandEndian: parseInt(this.wiegandEndian),
          wiegandHex: parseInt(this.wiegandHex)
        })).then((res) => {
          if (res.data.status) {
            console.log(detail)
            this.$emit('alertMsg', '操作成功！')
            this.msg.push({detail: detail, status: '成功'})
            this.initial = {
              deviceName: this.deviceName,
              delayTime: parseInt(this.delayTime),
              url: this.url,
              url2: this.url2,
              port: parseInt(this.port),
              port2: parseInt(this.port2),
              wiegand: parseInt(this.wiegand),
              matchType: parseInt(this.matchType),
              maxCapacity: parseInt(this.maxCapacity),
              heartBeat: parseInt(this.heartBeat),
              overTime: parseInt(this.overTime),
              resendCount: parseInt(this.resendCount),
              privilege: parseInt(this.privilege),
              outputType: parseInt(this.outputType),
              entryType: parseInt(this.entryType),
              outputMsg: this.outputMsg,
              protectLock: parseInt(this.protectLock)
//              wiegandEndian: parseInt(this.wiegandEndian)
//              wiegandHex: parseInt(this.wiegandHex)
            }
            this.redAdd = false
//            let labels = document.querySelector('.label-wrapper')
//            let inputs = labels.querySelectorAll('input')
//            let selects = labels.querySelectorAll('select')
//            for (let i = 0; i < inputs.length; i++) {
//              if (inputs[i].classList.contains('red')) {
//                inputs[i].classList.remove('red')
//              }
//            }
//            for (let i = 0; i < selects.length; i++) {
//              if (selects[i].classList.contains('red')) {
//                selects[i].classList.remove('red')
//              }
//            }
          } else {
            this.$emit('alertMsg', res.data.msg)
            this.msg.push({detail: detail, status: '失败'})
          }
        }).catch((err) => {
          console.log(err)
          this.$emit('alertMsg', '操作失败，请重试。')
          this.msg.push({detail: detail, status: '失败'})
        })
      },
      toDetail () {
        // let outputMsg = this.outputType !== '0' ? '' : this.outputMsg
        let detail = []
        let wiegand = ''
        let outputType = ''
        let matchType = ''
        let entryType = ''
        let protectLock = this.protectLock === '0' ? '关' : '开'
        let privilege = this.privilege === '0' ? '关' : '开'
//        let wiegandEndian = this.wiegandEndian === '0' ? '小端' : '大端'
//        let wiegandHex = this.wiegandHex === '0' ? '十进制' : '十六进制'
        String(this.initial.deviceName) !== this.deviceName ? detail.push(`设备名称：${this.deviceName}`) : null
        String(this.initial.url) !== this.url ? detail.push(`主服务器url：${this.url}`) : null
        String(this.initial.url2) !== this.url2 ? detail.push(`次服务器url：${this.url2}`) : null
        String(this.initial.port) !== this.port ? detail.push(`Mina服务器端口：${parseInt(this.port)}`) : null
        String(this.initial.port2) !== this.port2 ? detail.push(`http服务器端口：${parseInt(this.port2)}`) : null
        String(this.initial.maxCapacity) !== this.maxCapacity ? detail.push(`设备容量：${parseInt(this.maxCapacity)}`) : null
        String(this.initial.heartBeat) !== this.heartBeat ? detail.push(`终端心跳：${parseInt(this.heartBeat)}秒`) : null
        String(this.initial.overTime) !== this.overTime ? detail.push(`超时时间：${parseInt(this.overTime)}秒`) : null
        String(this.initial.resendCount) !== this.resendCount ? detail.push(`重发次数：${parseInt(this.resendCount)}`) : null
        if (String(this.initial.wiegand) !== this.wiegand) {
          switch (this.wiegand) {
            case '0' : wiegand = '韦根 26'
              break
            case '1' : wiegand = '韦根 34'
          }
          detail.push(`通讯协议：${wiegand}`)
        }
        if (String(this.initial.outputType) !== this.outputType) {
          switch (this.outputType) {
            case '1' : outputType = '工号'
              break
            case '2' : outputType = '卡号'
              break
            case '0' : outputType = '固定输出'
          }
          detail.push(`输出类型：${outputType}`)
        }
        String(this.initial.outputMsg) !== this.outputMsg ? detail.push(`固定输出内容：${this.outputMsg}`) : null
//        this.outputType === '0' && this.initial.outputMsg !== this.output ? detail.push(`${output}`) : null
        if (String(this.initial.entryType) !== this.entryType) {
          switch (this.entryType) {
            case '0' : entryType = '无'
              break
            case '1' : entryType = '进入'
              break
            case '2' : entryType = '离开'
          }
          detail.push(`进出类型：${entryType}`)
        }
        if (String(this.initial.matchType) !== this.matchType) {
          switch (this.matchType) {
            case '0' : matchType = '虹膜对比'
              break
            case '1' : matchType = '卡与虹膜对比'
              break
            case '2' : matchType = '卡或虹膜对比'
          }
          detail.push(`比对方式：${matchType}`)
        }
        String(this.initial.delayTime) !== this.delayTime ? detail.push(`门禁延时：${this.delayTime}秒`) : null
        String(this.initial.protectLock) !== this.protectLock ? detail.push(`防拆开关：${protectLock}`) : null
        String(this.initial.privilege) !== this.privilege ? detail.push(`注册开关：${privilege}`) : null
//        String(this.initial.wiegandEndian) !== this.wiegandEndian ? detail.push(`韦根大小端：${wiegandEndian}`) : null
//        String(this.initial.wiegandHex) !== this.wiegandHex ? detail.push(`韦根输出进制：${wiegandHex}`) : null
        detail = detail.join('，')
        return detail
      }
//      clearRed (e) {
//        let target = e ? e.target : window.event.srcElement
//        if (this.redAdd && target.classList.contains('red')) {
//          target.classList.remove('red')
//        }
//      },
//      addRed (e) {
//        let target = e ? e.target : window.event.srcElement
//        target.value = target.value.replace(/(^\s*)|(\s*$)/g, '')
//        if (this.redAdd && target.id !== 'outputMsg' && (target.selectedIndex === 0 || (target.tagName.toLowerCase() === 'input' && target.value === ''))) {
//          target.classList.add('red')
//        }
//      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  formWidth = 560px
  //formWidth = 620px
  consoleWidth = 790px
  //consoleWidth = 850px
  .device-setting
    width 790px
    margin 0 auto
    text-align center
    .form-container
      display inline-block
      height 440px
      vertical-align top
      form-container(formWidth)
      .label-wrapper
        height 300px
        width 500px
        margin 0 auto
        margin-top 20px
        label
          //width 290px
          width 350px
          margin 10px auto 0
          &:first-of-type
            margin-top 0 !important
          &:last-of-type
            margin-bottom 10px !important
          input
            text-align left !important
        .select-label
          select-label()
          &:before
            right 0
            width 200px
          .select-down
            top 8px
            right 4px
      .save-back-button
        .button
          margin 20px 53px
          width 120px
    .buttons
      display inline-block
      vertical-align top
      margin-left 83px
      .button
        display block
        margin-top 40px
        outline none
        cursor pointer
      .switch
        cursor pointer
    .loading-buttons
      .switch
        cursor default
      .loading-button
        cursor default
    .disabled-buttons
      .switch
        cursor default
      .disabled-button
        cursor default
        color #eee
        background #0077d5
    .console-container
      console-container(consoleWidth)
</style>
