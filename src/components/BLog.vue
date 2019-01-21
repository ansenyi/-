<template>
  <div class="blog">
    <page ref="page">
      <div slot="container" class="container center">
        <device-list ref="deviceList" initPost="selDeviceByNameLikeAll" @sendCheckedList="receiveDeviceList"></device-list>
        <div class="date-choose">
          <div class="start">
            <span>开始日期：</span>
            <date-picker v-model="startDate" :disabledDate="startDisabled" format="YYYY-MM-DD HH:mm:ss"></date-picker>
          </div>
          <div class="end">
            <span>结束日期：</span>
            <date-picker v-model="endDate" :disabledDate="endDisabled" format="YYYY-MM-DD HH:mm:ss"></date-picker>
          </div>
          <button class="button" @click="downloadBlog()">下载</button>
        </div>
        <div class="blog-console">
          <h4 class="console-title">操作记录</h4>
          <div class="console-content">
            <p v-for="(item, index) in msg" :key="index">
              <span>{{ item.detail }}</span>
              <span :class="item.status === '成功' ? 'succeed' : 'failed'">{{ item.status }}</span>
            </p>
          </div>
        </div>
      </div>
    </page>
  </div>
</template>

<script>
  import Page from './Page/Page.vue'
  import DeviceList from './DeviceList.vue'
  import DatePicker from 'vue-datepicker-local'
  import Bus from '../common/js/Bus'
  import { _debounce } from '../common/js/util'
  export default {
    name: 'blog',
    data () {
      return {
        // status: 0,
        minTime: new Date(2017, 0, 1),
        startDate: '',
        endDate: '',
        msg: [],
        deviceList: [],
        downloadBlog: _debounce(this.downloadBlogHandler),
        today: new Date()
      }
    },
    created () {
      document.title = '日志管理 — 虹膜门禁管理系统'
      this.startDate = this.today
      this.endDate = this.today
    },
    watch: {
      endDate (newVal) {
        if (this.startDate === this.today) {
          this.startDate = newVal
        }
      }
    },
    methods: {
      receiveDeviceList (arr) {
        this.deviceList = arr
      },
      endDisabled (time) {
        return time < this.minTime || time > this.today || (this.startDate !== '' && this.startDate !== this.today ? time < this.startDate : false)
      },
      startDisabled (time) {
        return time < this.minTime || time > this.today || (this.endDate !== '' && this.endDate !== this.today ? time > this.endDate : false)
      },
      downloadBlogHandler () {
        Bus.$emit('getCheckedList')
        console.log('日志-设备列表的数据：')
        console.log(this.deviceList)
        if (!this.deviceList.length || !this.deviceList[0].length || !this.deviceList[1].length) {
          Bus.$emit('alertMsgShow', '请选择设备。')
          return
        }
        if (this.deviceList[0].length > 10) {
          Bus.$emit('alertMsgShow', '最多可选10个设备。')
          return
        }
        if (this.startDate === '' || this.endDate === '') {
          Bus.$emit('alertMsgShow', '请选择一段时间间隔。')
          return
        }
        let startTime = this.getTime(this.startDate)
        let endTime = this.getTime(this.endDate)
        // 开始时间等于结束时间，报错
        if (startTime === endTime) {
          Bus.$emit('alertMsgShow', '请选择一段时间间隔。')
          return
        }
        // 开始时间大于结束时间，报错
        if (this.startDate >= this.endDate) {
          Bus.$emit('alertMsgShow', '请选择合适的时间间隔。')
          return
        }
        let startDay = this.startDate
        let endDay = this.endDate
        startDay.setHours(0, 0, 0, 0)
        endDay.setHours(0, 0, 0, 0)
        if (endDay.getTime() - startDay.getTime() > 30 * 24 * 60 * 60 * 1000) {
          Bus.$emit('alertMsgShow', '日期间隔不能超过30天。')
          return
        }
        console.log('打印出设备列表、开始时间和结束时间')
        console.log({
          deviceIds: this.deviceList[0],
          startTime: startTime,
          endTime: endTime
        })
        let detail = `设备：${this.deviceList[1].join('，')}\n开始时间：${startTime}\n结束时间：${endTime}`
        this.$http.post('getLog', JSON.stringify({
          deviceIds: this.deviceList[0],
          startTime: startTime,
          endTime: endTime
        }), {responseType: 'arraybuffer'}).then((res) => {
          if (res.status === 200) {
            console.log('取日志得到的数据：')
            console.log(res)
            let fileName = String(res.headers['content-disposition']).split('=')[1]
            const blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            if (navigator.userAgent.indexOf('Trident') > -1 || navigator.userAgent.indexOf('Edge') > -1) {
              window.navigator.msSaveBlob(blob, fileName)
            } else {
              const elink = document.createElement('a')
              console.log('文件名=' + fileName)
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              elink.target = '_blank'
              document.body.appendChild(elink)
              elink.click()
              document.body.removeChild(elink)
            }
            this.msg.push({detail: detail, status: '成功'})
            this.today = new Date()
            this.startDate = this.today
            this.endDate = this.today
            this.deviceList = []
            Bus.$emit('unselectAllClick')
          } else {
            Bus.$emit('alertMsgShow', '操作失败，请重试。')
            this.msg.push({detail: detail, status: '失败'})
          }
        }).catch((err) => {
          console.log(err)
          Bus.$emit('alertMsgShow', '操作失败，请重试。')
          this.msg.push({detail: detail, status: '失败'})
        })
      },
      getTime (date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }
    },
    components: {
      Page,
      DeviceList,
      DatePicker
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/mixin.styl'
  consoleWidth = 735px
  .blog
    .date-choose
      display inline-block
      width 460px
      height 320px
      margin-left 30px
      background #333538
      span
        color #eee
      .start
        margin-top 90px
      .end
        margin-top 26px
      .button
        width 292px
        margin-top 40px
    .blog-console
      console-container(consoleWidth)
</style>
