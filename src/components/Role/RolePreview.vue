<template>
  <div class="role-preview">
    <tables :theads="theads" :like="like" :placeholder="placeholder" :tableData="tableData" :settingPath="settingPath"
            :totalPages="totalPages" :curPage="curPage"
            @updateData="updateData" @removeId="removeId" @showRoleEdit="showRoleEdit">
      <span slot="count">查询结果数量：{{ totalElements }}</span>
      <span slot="count" class="add-role-span" @click="showRoleAdd">
      	<i class="icon-add">
      		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 768 768">
            <path d="M608 64h-448c-54.4 0-96 41.6-96 96v448c0 54.4 41.6 96 96 96h448c54.4 0 96-41.6 96-96v-448c0-54.4-41.6-96-96-96zM640 608c0 19.2-12.8 32-32 32h-448c-19.2 0-32-12.8-32-32v-448c0-19.2 12.8-32 32-32h448c19.2 0 32 12.8 32 32v448z"></path>
            <path d="M512 352h-96v-96c0-19.2-12.8-32-32-32s-32 12.8-32 32v96h-96c-19.2 0-32 12.8-32 32s12.8 32 32 32h96v96c0 19.2 12.8 32 32 32s32-12.8 32-32v-96h96c19.2 0 32-12.8 32-32s-12.8-32-32-32z"></path>
          </svg>
      	</i>
      	添加角色
      </span>
    </tables>
  </div>
</template>

<script>
  import Tables from '../Tables.vue'
  export default {
    name: 'role-preview',
    data () {
      return {
        placeholder: '按角色名称或描述搜索',
        theads: [{prop: 'roleId', title: '角色编号'}, {prop: 'roleName', title: '角色名称'}, {prop: 'roleType', title: '角色类型'}, {prop: 'openDoor', title: '允许开门'}, {prop: 'roleDesc', title: '角色描述'}, {title: '角色管理'}],
        tableData: [],
        curPage: 0,
        size: 10,
        direction: 'asc',
        property: 'roleId',
        like: '',
        settingPath: '',
        totalElements: 0,
        totalPages: 1
      }
    },
    created () {
      document.title = '角色预览 — 虹膜门禁管理系统'
      this.initTable()  // 页面加载时即初始化列表
    },
    methods: {
      initTable () {
        this.$http.post('queryRole', JSON.stringify({
          number: 0,
          size: 10,
          direction: 'asc',
          property: 'roleId',
          like: ''
        })).then((res) => {
          console.log('初始化角色列表的数据：')
          console.log(res)
          if (res.data.status) {
            this.toTableData(res.data.data.content)
            this.totalElements = res.data.data.totalElements  // 总数量
            this.totalPages = res.data.data.totalPages   // 总页数
          }
        }).catch(err => console.log(err))
      },
      toTableData (arr) {
        this.tableData = []
        arr.forEach((role) => {
          let row = []
          let roleName = (!role.hasOwnProperty('roleName') || role.roleName === '') ? '-' : role.roleName
          let roleType = role.roleType ? '默认' : '自定义'
          let openDoor = role.openDoor ? '是' : '否'
          let roleDesc = (!role.hasOwnProperty('roleDesc') || role.roleDesc === '') ? '-' : role.roleDesc
          row.push(role.roleId, roleName, roleType, openDoor, roleDesc)
          this.tableData.push(row)
        })
      },
      updateData (curPage = 0, size = this.size, direction = this.direction, property = this.property, like = this.like) {
        this.curPage = curPage
        this.size = size
        this.direction = direction
        this.property = property
        this.like = like
        this.$http.post('queryRole', JSON.stringify({number: curPage, size: size, direction: direction, property: property, like: like}))
          .then((res) => {
            console.log('查询条件更新后，查询角色的数据：')
            console.log(res)
            if (res.data.status) {
              this.toTableData(res.data.data.content)
              this.totalElements = res.data.data.totalElements
              this.totalPages = res.data.data.totalPages
//            alert(res.data.msg)
            } else {
              this.$emit('alertMsg', res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err)
            this.$emit('alertMsg', '操作失败，请重试。')
          })
      },
      showRoleAdd () {
        this.$emit('roleEdit', '添加角色', undefined, (r) => {
          r = this.fromPageRole(r)
          this.$http.post('addRole', JSON.stringify({
            roleName: r.roleName,
            roleType: r.roleType,
            openDoor: r.openDoor,
            roleDesc: r.roleDesc
          })).then((res) => {
            // fn()
            if (res.data.status) {
              this.$emit('alertMsg', '角色添加成功！')
              this.initTable()
            } else {
              this.$emit('alertMsg', res.data.msg)
            }
          }).catch((err) => {
            // fn()
            console.log(err)
            this.$emit('alertMsg', '操作失败，请重试。')
          })
        })
      },
      showRoleEdit (id) {
        this.$emit('roleEdit', '修改角色', async() => {
          return this.$http.post('getRole', JSON.stringify({
            roleId: id
          })).then((res) => {
            if (res.data.status) {
              return this.toPageRole(res.data.data)
            }
          }).catch(err => console.log(err))
        }, (r) => {
          r = this.fromPageRole(r)
          this.$http.post('editRole', JSON.stringify({
            roleId: r.roleId,
            roleName: r.roleName,
            roleType: r.roleType,
            openDoor: r.openDoor,
            roleDesc: r.roleDesc
          })).then((res) => {
            // fn()
            if (res.data.status) {
              this.$emit('alertMsg', '角色修改成功！')
              this.initTable()
            } else {
              this.$emit('alertMsg', res.data.msg)
            }
          }).catch((err) => {
            // fn()
            console.log(err)
            this.$emit('alertMsg', '操作失败，请重试。')
          })
        })
      },
      toPageRole (r) {
        r.roleType = String(r.roleType) === '1'
        r.openDoor = String(r.openDoor) === '1'
        return r
      },
      fromPageRole (r) {
        r.roleType = r.roleType ? 1 : 0
        r.openDoor = r.openDoor ? 1 : 0
        return r
      },
      removeId (id, name) {
        this.$emit('confirmMsg', '确定删除角色 "' + name + '"吗？', () => {
          this.$http.post('delRole', JSON.stringify({roleId: id}))
            .then((res) => {
              console.log('执行删除角色操作后的数据：')
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
    .add-role-span
      color darken(#2dc5fa, 30%)
      cursor pointer
      .icon-add
        padding-right 2px
        vertical-align sub
        svg
          fill darken(#2dc5fa, 30%)
</style>
