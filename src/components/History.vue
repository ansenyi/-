<template>
  <div class="history">
    <page>
      <!--<p class="title">历史记录</p>-->
      <div slot="container" class="container center">
        <form class="form-container">
          <h4 class="form-title">获取历史记录</h4>
          <label for="historyType" class="select-label">
            历史记录类型：
            <div class="select-wrapper">
              <select id="historyType" v-model="historyType" :class="redAdd && historyType === '请选择' ? 'red' : ''">
                <option disabled selected v-show="false" value="请选择">请选择</option>
                <option value="1">设备</option>
                <option value="2">用户</option>
                <option value="3">部门</option>
                <option value="4">角色</option>
                <option value="5">角色设备</option>
              </select>
              <i class="select-down icon-down"></i>
            </div>
          </label>
          <div class="start">
            <span>开始日期：</span>
            <date-picker style="color: #000;width: 207px" v-model="startDate" :disabledDate="startDisabled" format="YYYY-MM-DD HH:mm:ss"></date-picker>
          </div>
          <div class="end">
            <span>结束日期：</span>
            <date-picker style="color: #000;width: 207px" v-model="endDate" :disabledDate="endDisabled" format="YYYY-MM-DD HH:mm:ss"></date-picker>
          </div>
          <button class="button" @click.prevent="downloadExcel()">下载</button>
        </form>
      </div>
    </page>
  </div>
</template>

<script>
  import Bus from '../common/js/Bus'
  import Page from './Page/Page.vue'
  import DatePicker from 'vue-datepicker-local'
  import { _debounce } from '../common/js/util'
  export default {
    name: 'history',
    data () {
      return {
        historyType: '请选择',
        minTime: new Date(2017, 0, 1),
        startDate: '',
        endDate: '',
        downloadExcel: _debounce(this.downloadExcelHandler),
        today: new Date(),
        redAdd: false
      }
    },
    created () {
      document.title = '历史记录 — 虹膜门禁管理系统'
      this.startDate = this.today
      this.endDate = this.today
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
    watch: {
      endDate (newVal) {
        if (this.startDate === this.today) {
          this.startDate = newVal
        }
      }
    },
    methods: {
      endDisabled (time) {
        return time < this.minTime || time > this.today || (this.startDate !== '' && this.startDate !== this.today ? time < this.startDate : false)
      },
      startDisabled (time) {
        return time < this.minTime || time > this.today || (this.endDate !== '' && this.endDate !== this.today ? time > this.endDate : false)
      },
      downloadExcelHandler () {
        if (this.historyType === '请选择') {
//          document.querySelector('#historyType').classList.add('red')
          this.redAdd = true
          Bus.$emit('alertMsgShow', '请选择历史记录类型。')
          return
        }
        if (this.startDate === '' || this.endDate === '') {
          Bus.$emit('alertMsgShow', '请选择一段时间间隔。')
          return
        }
        let startTime = this.getTime(this.startDate)
        let endTime = this.getTime(this.endDate)
        if (startTime === endTime) {
          Bus.$emit('alertMsgShow', '请选择一段时间间隔。')
          return
        }
        if (this.startDate >= this.endDate) {
          Bus.$emit('alertMsgShow', '请选择合适的时间间隔。')
          return
        }
        if (isNaN(parseInt(this.historyType))) {
          return
        }
        this.$http.post('getHistory', JSON.stringify({
          type: parseInt(this.historyType),
          startTime: startTime,
          endTime: endTime
        }), {responseType: 'arraybuffer'}).then((res) => {
          if (res.status === 200) {
            console.log(res)
            console.log(res.headers)
            // console.log(res.headers['content-disposition'])
            // elink.download = String(res.headers['content-disposition']).split('=')[1]
            let type = ''
            switch (this.historyType) {
              case '1' : type = 'device'
                break
              case '2' : type = 'person'
                break
              case '3' : type = 'department'
                break
              case '4' : type = 'role'
                break
              case '5' : type = 'role-device'
            }
            let start = startTime.split(' ')[0]
            let end = endTime.split(' ')[0]
            console.log(start)
            console.log(`history_${type}_${start}_${end}.xlsx`)
            let fileName = `history_${type}_${start}_${end}.xlsx`
            // navigator.appVersion.toString().indexOf('.NET') > 0
            const blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            if (navigator.userAgent.indexOf('Trident') > -1 || navigator.userAgent.indexOf('Edge') > -1) {
              window.navigator.msSaveBlob(blob, fileName)
              return
            }
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            elink.target = '_blank'
            document.body.appendChild(elink)
            elink.click()
            document.body.removeChild(elink)
          } else {
            Bus.$emit('alertMsgShow', '操作失败，请重试。')
          }
        }).catch((err) => {
          console.log(err)
          Bus.$emit('alertMsgShow', '操作失败，请重试。')
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
//      clearRed (e) {
//        let target = e ? e.target : window.event.srcElement
//        if (this.redAdd && target.classList.contains('red')) {
//          target.classList.remove('red')
//        }
//      },
//      addRed (e) {
//        let target = e ? e.target : window.event.srcElement
//        if (this.redAdd && (target.selectedIndex === 0 || (target.tagName.toLowerCase() === 'input' && (target.value === '')))) {
//          target.classList.add('red')
//        }
//      }
    },
    components: {
      Page,
      DatePicker
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
        //width 460px
        height 320px
        margin 0 auto
        background #333538
        .select-label
          select-label()
          margin 0 auto
          width 320px
          margin-top 80px
          select
            width 207px
          .select-down
            right 3px
            top 8px
          &:before
            width 207px
            right 0
        span
          line-height 34px
          color #eee
        .start, .end
          display flex
          justify-content space-between
          width 320px
          margin 0 auto
          margin-top 26px
        .button
          width 320px
          margin-top 40px
</style>
