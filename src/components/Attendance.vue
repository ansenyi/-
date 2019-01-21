<template>
  <div class="attendance">
    <page>
      <p class="title">考勤管理</p>
      <div slot="container" class="container center">
        <div class="tables-wrapper">
          <div class="caption-box">
            <div class="left">
              <label class="select-label" for="workshop">
                <select id="workshop" v-model="workshop" @change="updateData">
                  <option v-for="(item, index) in workshopList" :key="index" :value="item.roleId">{{ item.roleName }}</option>
                </select>
                <i class="select-down icon-down"></i>
              </label>
              <p>明细列表</p>
            </div>
            <h3 class="middle">当前车间：<span>{{ currentElements }}人</span></h3>
            <div class="right">
              <button class="button" @click="clearAttendance">清零</button>
              <p>车间人员总数：{{ totalElements }}</p>
            </div>
          </div>
          <div class="table-box">
            <table>
              <thead>
              <tr>
                <th v-for="(item, index) in theads" :key="index">{{ item }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in tableData">
                <td>{{ item.userName }}</td>
                <td>{{ item.employeeId }}</td>
                <td>{{ item.inTime || '-' }}</td>
                <td>{{ item.outTime || '-' }}</td>
                <td>{{ item.status }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <pagination :totalPages="totalPages ? totalPages : 1" :current="curPage + 1" @toPage="toPage" @changeSize="changeSize"></pagination>
        </div>
      </div>
    </page>
  </div>
</template>

<script>
  import Page from '../components/Page/Page.vue'
  import Pagination from '../components/Pagination.vue'
  import Bus from '../common/js/Bus'
  export default {
    name: 'attendance',
    data () {
      return {
        workshop: '', // id 车间select
        workshopList: [], // id, name
        currentElements: 0, // 当前车间人数
        totalElements: 0, // 车间总人数
        theads: ['姓名', '工号', '上线时间', '下线时间', '状态'],
        tableData: [], // userName, employeeId, inTime, outTime, status
        totalPages: 0,
        curPage: 0,
        size: 10
      }
    },
    created () {
      document.title = '考勤管理 — 虹膜门禁管理系统'
      this.$http.post('getWorkshop', '').then((res) => {
        if (res.data.status) {
          this.workshopList = res.data.data
          this.workshop = this.workshopList[0].roleId
          this.updateData()
          this.$http.post('getCountInWorkshop', JSON.stringify({
            roleId: this.workshop
          })).then((res) => {
            if (res.data.status) {
              console.log(res.data.data)
              this.currentElements = res.data.data
            }
          }).catch(err => console.log(err))
        }
      }).catch(err => console.log(err))
    },
    methods: {
      updateData () {
        this.$http.post('queryAttendance', JSON.stringify({
          roleId: this.workshop,
          number: this.curPage,
          size: this.size,
          direction: 'asc',
          property: 'userName',
          like: ''
        })).then((res) => {
          if (res.data.status) {
            this.tableData = []
            this.toTableData(res.data.data)
          }
        }).catch(err => console.log(err))
      },
      toTableData (data) {
        data.content.forEach((i) => {
          this.tableData.push({userName: i.userName, employeeId: i.employeeId, inTime: i.inTime, outTime: i.outTime, status: i.status})
        })
        this.totalElements = data.totalElements
        this.totalPages = data.totalPages
      },
      toPage (curPage) {
        this.curPage = curPage
        this.updateData()
      },
      changeSize (size) {
        this.size = size
        this.updateData()
      },
      clearAttendance () {
        this.$http.post('clearAttendance', JSON.stringify({roleId: this.workshop})).then((res) => {
          Bus.$emit('alertMsgShow', res.data.msg)
        }).catch((err) => {
          console.log(err)
          Bus.$emit('alertMsgShow', '操作失败，请重试。')
        })
      }
    },
    components: {
      Page,
      Pagination
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/mixin.styl'
  .attendance
    .tables-wrapper
      .caption-box
        display flex
        justify-content space-between
        width 850px
        margin 0 auto
        .left
          .select-label
            select-label()
            &:before
              top 0
              right 0
              margin-top -5px
              width 140px
              height 30px
            select
              width 140px
              height 30px
              border 1px solid #646464
              border-radius 1px
              vertical-align middle
              cursor pointer
            .icon-down
              top 1px
          p
            margin 0
            margin-top 20px
            padding-left 2px
            font-size 18px
            text-align left
        .middle
          margin 0
          font-size 36px
          line-height 60px
          span
            color #0077d5
        .right
          p
            margin 10px 0
      .table-box
        table, th, td
          border 1.5px solid #eee
        table
          border-collapse collapse
          margin 0 auto
          width 850px
          th, td
            max-width 300px
            height 38px
          th
            position relative
            min-width 70px
            font-weight normal
            color #fff
            background #0077d5
            background-clip padding-box
            padding 0 10px
          td
            text-align center
            padding 0 10px
            background #fff
            white-space pre-wrap
            word-break break-all
            &:nth-of-type(3), &:nth-of-type(4)
              white-space nowrap
              word-break normal
</style>
