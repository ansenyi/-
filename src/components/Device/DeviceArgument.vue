<template>
  <div class="device-argument center">
    <device-list class="device-argument-list" ref="deviceList" initPost="selDeviceByNameLike" @sendCheckedList="receiveCheckedList"></device-list>
    <form class="device-control">
      <h4 class="form-title">参数配置</h4>
      <div class="label-wrapper" v-bar>
        <div class="label-container">
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
              <select id="wiegand" v-model="wiegand" :class="redAdd && wiegand === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
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
            <input type="text" placeholder="由数字0-9组成，最多9位" id="outputMsg" v-model="outputMsg" :class="redAdd && outputMsg === '' ? 'red' : ''"  autocomplete="off" maxlength="9"/>
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
        </div>
      </div>
    </form>
    <div class="device-console">
      <h4 class="console-title">配置记录</h4>
      <div class="console-content">
        <p v-for="(item, index) in msg" :key="index">
          <span>{{ item.detail }}</span>
          <span :class="item.status === '成功' ? 'succeed' : 'failed'">{{ item.status }}</span>
        </p>
      </div>
    </div>
    <div class="button-container">
      <button class="button" @click="saveAll()">确认</button>
    </div>
  </div>
</template>

<script>
  import Bus from '../../common/js/Bus'
  import DeviceList from '../DeviceList.vue'
  import { _debounce, getBLen } from '../../common/js/util'
  export default {
    name: 'device-argument',
    data () {
      return {
        delayTime: '请选择',
        url: '',
        url2: '',
        port: '',
        port2: '',
        heartBeat: '请选择', // int
        overTime: '请选择', // int
        resendCount: '请选择',
        wiegand: '请选择',
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
        msg: [],
        checkedList: [],
        saveAll: _debounce(this.saveAllHandler)
      }
    },
//    computed: {
//      userDefined () {
//        return this.outputType === '0'
//      }
//    },
    created () {
      document.title = '设备参数批量修改 — 虹膜门禁管理系统'
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
      receiveCheckedList (arr) {
        this.checkedList = arr
      },
      saveAllHandler () {
        Bus.$emit('getCheckedList')
        console.log(this.checkedList)
//        let checkedList = this.$refs.deviceList.checkedList()
        if (!this.checkedList.length || !this.checkedList[0].length || !this.checkedList[1].length) {
          this.$emit('alertMsg', '请选择设备。')
          return
        }
        this.url = this.url.replace(/(^\s*)|(\s*$)/g, '')
        this.url2 = this.url2.replace(/(^\s*)|(\s*$)/g, '')
        this.port = this.port.replace(/(^\s*)|(\s*$)/g, '')
        this.port2 = this.port2.replace(/(^\s*)|(\s*$)/g, '')
        this.maxCapacity = this.maxCapacity.replace(/(^\s*)|(\s*$)/g, '')
        this.outputMsg = this.outputMsg.replace(/(^\s*)|(\s*$)/g, '')
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
//        if (this.heartBeat === '请选择' || this.heartBeat === '') {
//          document.querySelector('#heartBeat').classList.add('red')
//        }
//        if (this.overTime === '请选择' || this.overTime === '') {
//          document.querySelector('#overTime').classList.add('red')
//        }
//        if (this.resendCount === '请选择' || this.resendCount === '') {
//          document.querySelector('#resendCount').classList.add('red')
//        }
//        if (this.wiegand === '请选择' || this.wiegand === '') {
//          document.querySelector('#wiegand').classList.add('red')
//        }
//        if (this.outputType === '请选择' || this.outputType === '') {
//          document.querySelector('#outputType').classList.add('red')
//        }
//        if (this.entryType === '请选择' || this.entryType === '') {
//          document.querySelector('#entryType').classList.add('red')
//        }
//        if (this.matchType === '请选择' || this.matchType === '') {
//          document.querySelector('#matchType').classList.add('red')
//        }
//        if (this.delayTime === '请选择' || this.delayTime === '') {
//          document.querySelector('#delayTime').classList.add('red')
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
        if (this.url === '' || this.url2 === '' || this.port === '' || this.port2 === '' || this.maxCapacity === '' || this.outputMsg === '' || this.wiegand === '请选择' || this.matchType === '请选择' || this.delayTime === '请选择' || this.heartBeat === '请选择' || this.overTime === '请选择' || this.resendCount === '请选择' || this.outputType === '请选择' || this.protectLock === '请选择' || this.privilege === '请选择') {
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
        if (this.outputMsg !== '' && (!/^[0-9]{1,10}$/g.test(this.outputMsg) || parseInt(this.outputMsg) >= 999999999)) {
          this.$emit('alertMsg', '固定输出内容只能由数字0-9组成，最多9位。')
          return
        }
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
        if (getBLen(this.outputMsg) > 256) {
          this.$emit('alertMsg', '输出类型超出长度！')
          return
        }
        if (isNaN(parseInt(this.matchType)) || isNaN(parseInt(this.delayTime)) || isNaN(parseInt(this.wiegand)) || isNaN(parseInt(this.privilege)) || isNaN(parseInt(this.outputType)) || isNaN(parseInt(this.protectLock)) || isNaN(parseInt(this.entryType)) || isNaN(parseInt(this.heartBeat)) || isNaN(parseInt(this.resendCount)) || isNaN(parseInt(this.overTime))) { //  || isNaN(parseInt(this.wiegandEndian)) || isNaN(parseInt(this.wiegandHex))
          console.log('isNaN')
          return
        }
        let options = this.toOptions()
        let devices = this.checkedList[1].join('，')
        let detail = `设备：${devices}\n${options}`
        this.$http.post('editMulDevice', JSON.stringify({
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
          wiegandHex: parseInt(this.wiegandHex),
          deviceIdList: this.checkedList[0]
        })).then((res) => {
          console.log('res')
          if (res.data.status) {
            this.$emit('alertMsg', '操作成功！')
            this.msg.push({detail: detail, status: '成功'})
            this.resetForm()
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
      resetForm () {
        Bus.$emit('unselectAllClick')
        this.deviceId = ''
        this.deviceName = ''
        this.delayTime = '请选择'
        this.url = ''
        this.url2 = ''
        this.port = ''
        this.port2 = ''
        this.wiegand = '请选择'
        this.matchType = '请选择'
        this.maxCapacity = ''
        this.heartBeat = '请选择'
        this.overTime = '请选择'
        this.resendCount = '请选择'
        this.outputType = '请选择'
        this.entryType = '请选择'
        this.outputMsg = ''
        this.protectLock = '请选择'
        this.privilege = '请选择'
        this.wiegandEndian = '0'
        this.wiegandHex = '0'
        this.redAdd = false
      },
      toOptions () {
        let wiegand = ''
        let outputType = ''
        let entryType = ''
        let matchType = ''
        let protectLock = this.protectLock === '0' ? '关' : '开'
        let privilege = this.privilege === '0' ? '关' : '开'
        switch (this.wiegand) {
          case '0' : wiegand = '韦根 26'
            break
          case '1' : wiegand = '韦根 34'
        }
        switch (this.outputType) {
          case '1' : outputType = '工号'
            break
          case '2' : outputType = '卡号'
            break
          case '0' : outputType = '固定输出'
        }
        switch (this.entryType) {
          case '0' : entryType = '无'
            break
          case '1' : entryType = '进入'
            break
          case '2' : entryType = '离开'
        }
        switch (this.matchType) {
          case '0' : matchType = '虹膜对比'
            break
          case '1' : matchType = '卡与虹膜对比'
            break
          case '2' : matchType = '卡或虹膜对比'
        }
        return `主服务器url：${this.url}，次服务器url：${this.url2}，Mina服务器端口：${parseInt(this.port)}，http服务器端口：${parseInt(this.port2)}，设备容量：${parseInt(this.maxCapacity)}，终端心跳：${parseInt(this.heartBeat)}秒，超时时间：${parseInt(this.overTime)}秒，重发次数：${parseInt(this.resendCount)}，通讯协议：${wiegand}，输出类型：${outputType}，固定输出内容：${this.outputMsg}, 进出类型：${entryType}，比对方式：${matchType}，门禁延时：${this.delayTime}秒，防拆开关：${protectLock}，注册开关：${privilege}` // ，韦根大小端：${wiegandEndian} ，韦根输出进制：${wiegandHex}
      }
    },
    components: {
      DeviceList
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  //formWidth = 460px
  formWidth = 520px
  //consoleWidth =735px
  consoleWidth =795px
  .device-argument
    padding-bottom 60px
    .device-control
      height 400px
      display inline-block
      margin-left 30px
      vertical-align top
      form-container(formWidth)
      .label-wrapper
        height 300px
        width 500px
        margin 0 auto
        margin-top 30px
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
          .select-down
            top 8px
            right 4px
          &:before
            right 0
            width 200px
          &:first-of-type
            margin-top 50px
    .device-console
      console-container(consoleWidth)
    .button-container
      position relative
      //width 735px
      width 795px
      height 40px
      margin 0 auto
      .button
        position absolute
        bottom 0
        right 0
        background-color #0077d5
</style>
