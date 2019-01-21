<template>
  <div class="person-preview">
    <tables :theads="theads" :like="like" :placeholder="placeholder" :tableData="tableData" :settingPath="settingPath"
            :totalPages="totalPages" :curPage="curPage"
            @updateData="updateData" @removeId="removeId" @showPersonDetail="showPersonDetail" @showPersonTable="showPersonTable">
      <span slot="count">查询结果数量：{{ totalElements }}</span>
    </tables>
  </div>
</template>

<script>
  import Tables from '../Tables.vue'
  export default {
    name: 'person-preview',
    data () {
      return {
        placeholder: '按姓名、工号、卡号搜索',
        theads: [{prop: 'userName', title: '姓名'}, {prop: 'employeeId', title: '工号'}, {prop: 'cardNo', title: '卡号'}, {prop: 'org.orgName', title: '部门'}, {prop: 'role.roleName', title: '角色'}, {title: '人员管理'}],
        tableData: [],
        curPage: 0,
        size: 10,
        direction: 'asc',
        property: 'userName',
        like: '',
        settingPath: '/person/setting',
        totalElements: 0,
        totalPages: 1
      }
    },
    created () {
      document.title = '人员预览 — 虹膜门禁管理系统'
      this.initTable()
    },
    methods: {
      initTable () {
        this.$http.post('queryUser', JSON.stringify({
          number: 0,
          size: 10,
          direction: 'asc',
          property: 'userName',
          like: ''
        })).then((res) => {
          if (res.data.status) {
            console.log('初始化列表')
            console.log(res.data.data)
            this.toTableData(res.data.data.content)
            this.totalElements = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      toTableData (arr) {
        this.tableData = []
        arr.forEach((person) => {
          let row = []
          let employeeId = (!person.hasOwnProperty('employeeId') || person.employeeId === '') ? '-' : person.employeeId
          let cardNo = (!person.hasOwnProperty('cardNo') || person.cardNo === '') ? '-' : person.cardNo
          row.push(person.userId, person.userName, employeeId, cardNo)
          person.hasOwnProperty('org') ? (person.org.hasOwnProperty('orgName') ? row.push(person.org.orgName) : row.push('未分配')) : row.push('未分配')
          let roleName = '未分配'
          if (person.role && person.role.roleName) {
            let suf = ''
            switch (person.role.roleType) {
              case 1 : suf = '（默认）'
                break
              case 2 : suf = '（管理员）'
            }
            roleName = person.role.roleName + suf
          }
          row.push(roleName)
//          person.role ? (person.role['roleName'] ? row.push(person.role['roleName']) : row.push('未分配')) : row.push('未分配')
          this.tableData.push(row)
        })
      },
      updateData (curPage = 0, size = this.size, direction = this.direction, property = this.property, like = this.like) {
        console.log('2' + this.curPage + this.size + this.direction + this.property + this.like)
        this.curPage = curPage
        this.size = size
        this.direction = direction
        this.property = property
        this.like = like
        console.log({number: curPage, size: size, direction: direction, property: property, like: like})
        this.$http.post('queryUser', JSON.stringify({number: curPage, size: size, direction: direction, property: property, like: like}))
          .then((res) => {
            console.log(res)
            if (res.data.status) {
              this.toTableData(res.data.data.content)
              this.totalElements = res.data.data.totalElements
              this.totalPages = res.data.data.totalPages
            } else {
              this.$emit('alertMsg', res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err)
            this.$emit('alertMsg', '操作失败，请重试。')
          })
      },
      removeId (id, name) {
        this.$emit('confirmMsg', '确定删除 ' + name + ' 吗？', () => {
          this.$http.post('delUser', JSON.stringify({userId: id}))
            .then((res) => {
              console.log(res)
              if (res.data.status) {
                if (this.totalPages > 1 && this.curPage === this.totalPages - 1 && this.totalElements % this.size === 1) {
                  console.log('updateData(this.curPage - 1)')
                  this.updateData(this.curPage - 1)
                } else {
                  console.log('updateData(this.curPage)')
                  this.updateData(this.curPage)
                }
              } else {
                this.$emit('alertMsg', res.data.msg)
              }
            })
            .catch((err) => {
              console.log(err)
              this.$emit('alertMsg', '操作失败，请重试。')
            })
        })
      },
      showPersonDetail (id) {
        this.$emit('getPersonDetail', async() => {
          return this.$http.post('getUser', JSON.stringify({
            userId: id
          })).then((res) => {
            console.log('员工信息详情响应数据：')
            console.log(res)
            if (res.data.status) {
              return this.toDetail(res.data.data)
            }
          }).catch((err) => {
            console.log(err)
          })
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
      },
      toDetail (p) {
//        let employeeId = (!p.hasOwnProperty('employeeId') || p.employeeId === '') ? '-' : p.employeeId
//        let cardNo = (!p.hasOwnProperty('cardNo') || p.cardNo === '') ? '-' : p.cardNo
        // 未分配
        let orgName = p.hasOwnProperty('org') ? (p.org.hasOwnProperty('orgName') ? p.org.orgName : '') : ''
        let roleName = ''
        if (p.role && p.role.roleName) {
          let suf = ''
          switch (p.role.roleType) {
            case 1 : suf = '（默认）'
              break
            case 2 : suf = '（管理员）'
          }
          roleName = p.role.roleName + suf
        }
//        let roleName = p.role ? (p.role['roleName'] ? p.role['roleName'] : '未分配') : '未分配'
        let registerTime = new Date(p.registerTime)
        registerTime = this.getTime(registerTime)
        let privilege = p.privilege ? '是' : '否'
        return {
          '姓名': p.userName,
          '工号': p.employeeId,
          '卡号': p.cardNo,
          '部门': orgName,
          '角色': roleName,
          '注册时间': registerTime,
          '管理员': privilege,
          '性别': p.sex,
          '地址': p.address,
          '发证机关': p.authority,
          '出生日期': p.birthday,
          '民族': p.ethnicity,
          '人脸图片': p.faceImgPath,
          '身份证号': p.idNumber,
          '证件生效时间': p.validityBegin,
          '证件失效时间': p.validityEnd
        }
      },
      showPersonTable (id, name) {
        this.$emit('personTable', name, async() => {
          return this.$http.post('getDeviceContainUser', JSON.stringify({
            userId: id
          })).then((res) => {
            if (res.data.status) {
              return this.toPersonTable(res.data.data)
            }
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      toPersonTable (arr) {
        let table = []
        arr.forEach((d) => {
          let row = []
          let deviceName = (!d.hasOwnProperty('deviceName') || d.deviceName === '') ? 'Untitled' : d.deviceName
          let protectLock = d.protectLock === 0 ? '关' : '开'
          let privilege = d.privilege === 0 ? '关' : '开'
          let online = d.online === 0 ? '未连接' : '已连接'
          let occupancyRate = Number(d.occupancyRate * 100).toFixed() + '%'
          row.push(d.deviceId, deviceName, protectLock, privilege, online, occupancyRate)
          table.push(row)
        })
        return table
      }
    },
    components: {
      Tables
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    overflow-x auto
</style>
