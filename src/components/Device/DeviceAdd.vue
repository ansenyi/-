<template>
  <div class="device-add center">
    <form id="mul-device" class="form-container">
      <h4 class="form-title">多个设备上传</h4>
      <label for="upload">
        <span>Excel文件：</span>
        <div id="upload">
          <input type="file" id="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                 class="inputfile inputfile-6" @change="getExcelFile($event)" @focus="addFocus($event)" @blur="removeFocus($event)" alt="浏览器不支持本上传组件。"/>
          <label ref="addFile" for="file" :class="redAddMul && fileName === '' ? 'red' : ''"><span>{{ fileName }}</span> <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></i></label>
        </div>
      </label>
      <button class="button" @click.prevent="uploadFile" v-show="!loading">上传</button>
      <button class="button disabled-button" v-show="loading">正在上传...</button>
    </form>
    <form id="single-device" class="form-container">
      <h4 class="form-title">单个设备添加</h4>
      <label for="deviceId">
        <span>设备编号：</span>
        <input id="deviceId" type="text" v-model="deviceId" :class="redAdd && deviceId === '' ? 'red' : ''" autocomplete="off"  @keyup.enter="focusNextInput($event)"/>
      </label>
      <label for="deviceName">
        <span>设备名称：</span>
        <input id="deviceName" type="text" v-model="deviceName" :class="redAdd && deviceName === '' ? 'red' : ''" autocomplete="off" @keyup.enter="focusNextInput($event)"/>
      </label>
      <label for="url">
        <span>主服务器url：</span>
        <input id="url" type="text" v-model="url" :class="redAdd && url === '' ? 'red' : ''" autocomplete="off" @keyup.enter="focusNextInput($event)"/>
      </label>
      <label for="url2">
        <span>次服务器url：</span>
        <input id="url2" type="text" v-model="url2" :class="redAdd && url2 === '' ? 'red' : ''" autocomplete="off" @keyup.enter="focusNextInput($event)"/>
      </label>
      <label for="port">
        <span>Mina服务器端口：</span>
        <input id="port" type="text" placeholder="0-65535之间的整数" onkeyup="value=value.replace(/[^\d]/g,'')" v-model="port" :class="redAdd && port === '' ? 'red' : ''" autocomplete="off" @keyup.enter="focusNextInput($event)"/>
      </label>
      <label for="port2">
        <span>http服务器端口：</span>
        <input id="port2" type="text" placeholder="0-65535之间的整数" onkeyup="value=value.replace(/[^\d]/g,'')" v-model="port2" :class="redAdd && port2 === '' ? 'red' : ''" autocomplete="off" @keyup.enter="focusNextInput($event)"/>
      </label>
      <label for="maxCapacity">
        <span>设备容量：</span>
        <input id="maxCapacity" type="text" placeholder="0-1500之间的整数" v-model="maxCapacity" :class="redAdd && maxCapacity === '' ? 'red' : ''" autocomplete="off" @keyup.enter="focusNextInput($event)"/>
      </label>
      <label for="heartBeat" class="select-label">
                   终端心跳：
        <div class="select-wrapper">
          <select id="heartBeat" v-model="heartBeat">
            <option v-for="n in [30, 60, 120, 180]" :value="String(n)">{{ n }}秒</option>
          </select>
          <i class="select-down icon-down"></i>
        </div>
      </label>
      <label for="overTime" class="select-label">
                   超时时间：
        <div class="select-wrapper">
          <select id="overTime" v-model="overTime">
            <option v-for="n in [10, 20, 30]" :value="String(n)">{{ n }}秒</option>
          </select>
          <i class="select-down icon-down"></i>
        </div>
      </label>
      <label for="resendCount" class="select-label">
                   重发次数：
        <div class="select-wrapper">
          <select id="resendCount" v-model="resendCount">
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
          <select id="outputType" v-model="outputType">
            <!--<option disabled selected v-show="false" value="请选择">请选择</option>-->
            <option value="1">工号</option>
            <option value="2">卡号</option>
            <option value="0">固定输出</option>
          </select>
          <i class="select-down icon-down"></i>
        </div>
      </label>
      <label for="outputMsg">
                    固定输出内容：
        <!--<input type="text" placeholder="由数字0-9组成，最多9位" onkeyup="value=value.replace(/[^\d]/g,'')" id="outputMsg" v-model="outputMsg" :class="redAdd && outputMsg === '' ? 'red' : ''" autocomplete="off" maxlength="9"/>-->
      	<input type="text" placeholder="不大于16777215的正整数" id="outputMsg" v-model="outputMsg" v-show="outputMsgIsShow" autocomplete="off"  :class="{red:redAdd}"/>
        <input type="text" placeholder="不大于4294967295的正整数" id="outputMsg" v-model="outputMsg" v-show="!outputMsgIsShow" autocomplete="off"  :class="{red:redAdd}"/>
      </label>
      <label for="entryType" class="select-label">
       	进出类型：
        <div class="select-wrapper">
          <select id="entryType" v-model="entryType">
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
          <select id="matchType" v-model="matchType">
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
          <select id="delayTime" v-model="delayTime">
            <option v-for="n in [1,3,5,10,20]" :value="String(n)">{{ n }}秒</option>
          </select>
          <i class="select-down icon-down"></i>
        </div>
      </label>
      <label for="protectLock" class="select-label">
                   防拆开关：
        <div class="select-wrapper">
          <select id="protectLock" v-model="protectLock">
            <option value="1">开</option>
            <option value="0">关</option>
          </select>
          <i class="select-down icon-down"></i>
        </div>
      </label>
      <label for="privilege" class="select-label">
                   注册开关：
        <div class="select-wrapper">
          <select id="privilege" v-model="privilege">
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
      <div class="save-reset-button">
        <button type="reset" class="button" @click.prevent="resetForm">重置</button>
        <button type="button" class="button" @click.prevent="saveAll()">保存</button>
      </div>
    </form>
  </div>
</template>

<script>
  import { _debounce, getBLen } from '../../common/js/util'
  export default {
    name: 'device-add',
    data () {
      return {
        deviceId: '',
        deviceName: '',
        delayTime: '3',
        url: '',
        url2: '',
        port: '',
        port2: '',
        heartBeat: '60', // int
        overTime: '20', // int
        resendCount: '3',
        wiegand: '0',
        outputType: '1',
        outputMsg: '',
        entryType: '1',
        matchType: '2',
        protectLock: '0',
        privilege: '0',
        wiegandEndian: '0',
        wiegandHex: '0',
        maxCapacity: '1500',
        redAdd: false,
        redAddMul: false,
        saveAll: _debounce(this.saveAllHandler),
        file: null,
        fileName: '',
        loading: false,
        outputMsgIsShow: true
        // userDefined: false
      }
    },
    created () {
      document.title = '设备添加 — 虹膜门禁管理系统'
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
      saveAllHandler () {
        this.deviceId = this.deviceId.replace(/(^\s*)|(\s*$)/g, '')
        this.deviceName = this.deviceName.replace(/(^\s*)|(\s*$)/g, '')
        this.url = this.url.replace(/(^\s*)|(\s*$)/g, '')
        this.url2 = this.url2.replace(/(^\s*)|(\s*$)/g, '')
        this.port = this.port.replace(/(^\s*)|(\s*$)/g, '')
        this.port2 = this.port2.replace(/(^\s*)|(\s*$)/g, '')
        this.maxCapacity = this.maxCapacity.replace(/(^\s*)|(\s*$)/g, '')
        this.outputMsg = this.outputMsg.replace(/(^\s*)|(\s*$)/g, '')
//        if (this.deviceId === '') {
//          document.querySelector('#deviceId').classList.add('red')
//        }
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

        if (this.deviceId === '' || this.deviceName === '' || this.url === '' || this.url2 === '' || this.port === '' || this.port2 === '' || this.maxCapacity === '' || this.outputMsg === '') {
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
        if (getBLen(this.deviceId) > 64) {
          this.$emit('alertMsg', '设备编号超出长度！')
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
        // 已有watch
//        let outputMsg = this.outputType !== '0' ? '' : this.outputMsg
//      if (getBLen(this.outputMsg) > 256) {
//        this.$emit('alertMsg', '输出类型超出长度！')
//        return
//      }
        if (isNaN(parseInt(this.matchType)) || isNaN(parseInt(this.delayTime)) || isNaN(parseInt(this.wiegand)) || isNaN(parseInt(this.privilege)) || isNaN(parseInt(this.outputType)) || isNaN(parseInt(this.protectLock)) || isNaN(parseInt(this.entryType)) || isNaN(parseInt(this.heartBeat)) || isNaN(parseInt(this.resendCount)) || isNaN(parseInt(this.overTime))) {
          console.log('isNaN')
          return
        }
        this.$http.post('addDevice', JSON.stringify({
          deviceId: this.deviceId.toUpperCase(),
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
            this.$emit('alertMsg', '保存成功！')
            this.resetForm()
          } else {
            this.$emit('alertMsg', res.data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$emit('alertMsg', '保存失败，请重试。')
        })
      },
      resetForm () {
        this.deviceId = ''
        this.deviceName = ''
        this.delayTime = '3'
        this.url = ''
        this.url2 = ''
        this.port = ''
        this.port2 = ''
        this.wiegand = '0'
        this.matchType = '2'
        this.maxCapacity = '1500'
        this.heartBeat = '60'
        this.overTime = '20'
        this.resendCount = '3'
        this.outputType = '1'
        this.entryType = '1'
        this.outputMsg = ''
        this.protectLock = '0'
        this.privilege = '0'
        this.wiegandEndian = '0'
        this.wiegandHex = '0'
        this.redAdd = false
      },
      getExcelFile (e) {
        let target = e ? e.target : window.event.srcElement
        this.file = target.files[0]
        this.fileName = target.value.split('\\').pop()
      },
      /* addFocus (e) {
        let target = e ? e.target : window.event.srcElement
        target.classList.add('has-focus')
      },
      removeFocus (e) {
        let target = e ? e.target : window.event.srcElement
        target.classList.remove('has-focus')
      }, */
      uploadFile () {
        if (this.fileName === '') {
          this.redAddMul = true
          return
        }
        let formData = new FormData()  // 创建一个FormData类型的对象
        formData.append('deviceFile', this.file)
        this.loading = true
        this.$http.post('batchUploadDevice', formData, {
          timeout: 20000,
          headers: {
            'Content-Type': 'multipart/form-data'  // 文件上传用的格式
          }
        }).then((res) => {
          console.log('多个设备上传操作后的数据：')
          console.log(res)
          this.loading = false
          if (res.status === 200) {
            this.redAddMul = false
            this.$emit('alertMsg', res.data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.loading = false
          this.$emit('alertMsg', '上传失败，请重试。')
        })
      },
      focusNextInput (e) {
        var inputs = document.getElementsByTagName('input')
        console.log(e.target)
        console.log(inputs)
        for (var i = 0; i < inputs.length; i++) {
          if (i === (inputs.length - 1)) {
            break
          } else if (e.target === inputs[i]) {
            e.target.blur()
            inputs[i + 1].focus()
            break
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  @import '../../common/stylus/input-file.css'
  formWidth = 640px
  consoleWidth = 790px
  .device-add
    width 640px
    margin 0 auto
    text-align center
    #single-device
      margin 40px auto
      form-container(formWidth)
      label
        width 350px
        margin 7px auto
        &:first-of-type
          margin-top 28px
        input
          text-align left
      .select-label
        select-label()
        &:before
          right 0
          width 200px
        .select-down
          top 8px
          right 4px
      .save-reset-button
        .button
          margin 25px 53px 40px
          width 120px
    #mul-device
      margin 0 auto
      form-container(formWidth)
      >label
        display inline-block
        width 350px
        height 30px
        margin-bottom 30px
        line-height 30px
        font-size 16px
        //vertical-align middle
        #upload
          display inline-block
          width 200px
          height 22px
      .button
        display inline-block
        width 100px
        height 35px
      .disabled-button
        cursor default
        color #eee
        background #999
</style>
