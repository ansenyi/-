<template>
  <div class="device-preview">
    <tables :theads="theads" 
    	:like="like" 
    	:placeholder="placeholder" 
    	:tableData="tableData" 
    	:settingPath="settingPath"
      :totalPages="totalPages" 
      :curPage="curPage"
      @updateData="updateData" 
      @removeId="removeId" 
      @showDeviceDetail="showDeviceDetail" 
      @showDeviceTable="showDeviceTable">
      <span slot="count">设备数量：{{ totalDeviceNumbers }}</span>
      <span slot="count">未命名设备数量：{{ unnamed }}</span>
      <span slot="count">在线设备数量：{{ onlineCount }}</span>
    </tables>
  </div>
</template>

<script>
  import Tables from '../Tables.vue'
  export default {
    name: 'device-preview',
    data () {
      return {
        placeholder: '按设备名称、编号搜索',
        theads: [{prop: 'deviceId', title: '设备编号'}, {prop: 'deviceName', title: '设备名称'}, {prop: 'protectLock', title: '防拆开关'}, {prop: 'softwareVersion', title: '软件版本号'}, {prop: 'hardwareVersion', title: '硬件版本号'}, {prop: 'online', title: '连接状态'}, {prop: 'ip', title: '通讯地址'}, {prop: 'privilege', title: '注册开关'}, {prop: 'occupancyRate', title: '设备占用率'}, {title: '设备管理'}],
        tableData: [],
        curPage: 0,
        size: 10,
        direction: 'asc',
        property: 'deviceName',
        like: '',
        settingPath: '/device/setting',
        totalDeviceNumbers: 0,
        unnamed: 0,
        totalPages: 1,
        onlineCount: 0
      }
    },
    created () {
      document.title = '设备预览 — 虹膜门禁管理系统'
      this.initTable()
      this.$http.post('getNumberOfNoNameDevice', '')
      .then((res) => {
        console.log('请求未命名设备的数量后的数据：')
        console.log(res)
        if (res.data.status) {
          console.log('未命名设备的数量：' + res.data.data)
          this.unnamed = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
      this.$http.post('getOnlineDeviceCount', '').then((res) => {
        console.log('请求在线设备的数量后的数据：')
        console.log(res)
        if (res.data.status) {
          console.log('在线设备的数量：' + res.data.data)
          this.onlineCount = res.data.data
        }
      }).catch(err => console.log(err))
    },
    methods: {
      // 将请求后得到的数据转化为表格数据
      toTableData (arr) {
        this.tableData = []
        arr.forEach((device) => {
          let row = []
          let deviceName = (!device.hasOwnProperty('deviceName') || device.deviceName === '') ? 'Untitled' : device.deviceName
          let online = device.online === 0 ? '未连接' : '已连接'
          let lock = device.protectLock === 0 ? '关' : '开'
          let privilege = device.privilege === 0 ? '关' : '开'
          let ip = device.online === 0 ? '-' : device.ip
          let hardware = !device.hardwareVersion || device.hardwareVersion === '' ? '-' : device.hardwareVersion
          let software = !device.softwareVersion || device.softwareVersion === '' ? '-' : device.softwareVersion
          let occupancyRate = Number(device.occupancyRate * 100).toFixed() + '%'
          row.push(device.deviceId, deviceName, lock, software, hardware, online, ip, privilege, occupancyRate)
          this.tableData.push(row)
        })
      },
      initTable () {
        this.$http.post('queryDevice', JSON.stringify({
          number: 0,
          size: 10,
          direction: 'asc',
          property: 'deviceName',
          like: ''
        }))
        .then((res) => {
          console.log('查询设备列表请求后的数据：')
          console.log(res)
          if (res.data.status) {
            this.toTableData(res.data.data.content)
            this.totalDeviceNumbers = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      updateData (curPage = 0, size = this.size, direction = this.direction, property = this.property, like = this.like) {
        this.curPage = curPage
        this.size = size
        this.direction = direction
        this.property = property
        this.like = like
        console.log({number: curPage, size: size, direction: direction, property: property, like: like})
        this.$http.post('queryDevice', JSON.stringify({number: curPage, size: size, direction: direction, property: property, like: like}))
          .then((res) => {
            console.log(res)
            if (res.data.status) {
              this.toTableData(res.data.data.content)
              this.totalDeviceNumbers = res.data.data.totalElements
              this.totalPages = res.data.data.totalPages
            }
//            else {
//              this.$emit('alertMsg', res.data.msg)
//            }
          })
          .catch((err) => {
            console.log(err)
//            this.$emit('alertMsg', '操作失败，请重试。')
          })
      },
      removeId (id, name) {
        this.$emit('confirmMsg', '确定删除设备 ' + name + ' 吗？', () => {
          this.$http.post('delDevice', JSON.stringify({deviceId: id}))
            .then((res) => {
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
      showDeviceDetail (id) {
        this.$emit('getDeviceDetail', async() => {
          return this.$http.post('getDevice', JSON.stringify({
            deviceId: id
          })).then((res) => {
            if (res.data.status) {
              return this.toDetail(res.data.data)
            }
          }).catch(err => console.log(err))
        })
      },
      toDetail (d) {
        let protectLock = !d.protectLock ? '关' : '开'
        let privilege = !d.privilege ? '关' : '开'
        let online = !d.online ? '不在线' : '在线'
        let occupancyRate = Number(d.occupancyRate * 100).toFixed() + '%'
        let wiegand = ''
        switch (d.wiegand) {
          case 0 :
            wiegand = '韦根 26'
            break
          case 1 :
            wiegand = '韦根 34'
        }
        let outputType = ''
        switch (d.outputType) {
          case 0 :
            outputType = '固定输出'
            break
          case 1 :
            outputType = '工号'
            break
          case 2 :
            outputType = '卡号'
        }
        let entryType = ''
        switch (d.entryType) {
          case 0 : entryType = '无'
            break
          case 1 : entryType = '进入'
            break
          case 2 : entryType = '离开'
        }
        let matchType = ''
        switch (d.matchType) {
          case 0 :
            matchType = '虹膜对比'
            break
          case 1 :
            matchType = '卡与虹膜对比'
            break
          case 2 :
            matchType = '卡或虹膜对比'
        }
        let wiegandHex = !d.wiegandHex ? '十进制' : '十六进制'
        let wiegandEndian = !d.wiegandEndian ? '小端' : '大端'
        return {
          '设备编号': d.deviceId,
          '设备名称': d.deviceName,
          '门禁延时': String(d.delayTime) + '秒',
          '软件版本': d.softwareVersion,
          '硬件版本': d.hardwareVersion,
          '终端心跳': String(d.heartBeat) + '秒',
          '消息超时': String(d.overTime) + '秒',
          '重发次数': d.resendCount,
          '防拆开关': protectLock,
          '是否在线': online,
          '设备占用率': occupancyRate,
          '主服务器url': d.url,
          '次服务器url': d.url2,
          'Mina服务器端口': d.port,
          'http服务器端口': d.port2,
          '注册开关': privilege,
          '通讯协议': wiegand,
          '输出类型': outputType,
          '固定输出内容': d.outputMsg,
          '进出类型': entryType,
          '比对方式': matchType,
          '通讯地址': d.ip,
          '设备容量': d.maxCapacity,
          '当前容量': d.currentCapacity,
          '韦根大小端': wiegandEndian,
          '韦根输出进制': wiegandHex
        }
      },
      showDeviceTable (id, name) {
        this.$emit('deviceTable', name, async() => {
          return this.$http.post('getUserInDevice', JSON.stringify({
            deviceId: id
          })).then((res) => {
            if (res.data.status) {
              return this.toDeviceTable(res.data.data)
            }
          }).catch(err => console.log(err))
        })
      },
      toDeviceTable (arr) {
        let table = []
        arr.forEach((p) => {
          let row = []
          let employeeId = (!p.hasOwnProperty('employeeId') || p.employeeId === '') ? '-' : p.employeeId
          let cardNo = (!p.hasOwnProperty('cardNo') || p.cardNo === '') ? '-' : p.cardNo
          row.push(p.userName, employeeId, cardNo)
          let roleName = '未分配'
          if (p.role && p.role.roleName) {
            let suf = ''
            switch (p.role.roleType) {
              case 1 : suf = '（默认）'
                break
              case 2 : suf = '（管理员）'
            }
            roleName = p.role.roleName + suf
          }
          row.push(roleName)
//          p.role ? (p.role['roleName'] ? row.push(p.role['roleName']) : row.push('未分配')) : row.push('未分配')
          p.hasOwnProperty('org') ? (p.org.hasOwnProperty('orgName') ? row.push(p.org.orgName) : row.push('未分配')) : row.push('未分配')
          let sex = (!p.hasOwnProperty('sex') || p.sex === '') ? '-' : p.sex
          let privilege = p.privilege ? '是' : '否'
          row.push(sex, privilege)
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
