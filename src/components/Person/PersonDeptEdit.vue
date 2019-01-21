<template>
  <div class="person-dept-edit center" @click.prevent="cancelChosen($event)">
    <div class="new-dept one-column">
      <h4 class="box-title">新建部门</h4>
      <div class="box-content">
	      <label for="name">部门名称
	        <input type="text" id="name" @keyup.enter="newDept" placeholder="请输入新建部门名称" v-model="newDeptName" autocomplete="off" />
	      </label>
	      <button class="button" @click="newDept">新建部门</button>
	    </div>
    </div>
    <div class="dept-list one-column">
      <h4 class="box-title">已有部门</h4>
      <div class="box-content">
        <div class="search-input">
          <input type="text" placeholder="模糊搜索" v-model="searchInput" @keyup="searchLike" autocomplete="off" />
          <i class="input-cancel icon-cancel" v-show="showCancel" @click="searchInput = '';searchLike()"></i>
        </div>
        <div class="my-bar" v-bar>
          <ul @click="chooseDept($event)" @keyup.enter="checkName" @focusout="checkName">
            <li v-for="(items, index) in deptList" v-show="deptLikeList.indexOf(items.orgId) !== -1" :key="index" :data-id="items.orgId" :data-level="items.level" :data-index="index">
              <p :class="{'chosen': chosenDept.orgId === String(items.orgId)}" v-show="renameDept !== String(items.orgId)">
                <i class="icon-right" v-show="actives.indexOf(String(items.orgId)) === -1"></i>
                <i class="icon-down" v-show="actives.indexOf(String(items.orgId)) !== -1"></i>
                {{ items.orgName }}
              </p>
              <input :ref="items.orgId" type="text" v-show="renameDept === String(items.orgId)" v-model="renameInput" autocomplete="off" />
              <ul v-show="actives.indexOf(String(items.orgId)) !== -1">
                <li v-for="(item, index) in items.children" :key="index" :data-id="item.orgId">
                  <p :class="{'chosen': chosenDept.orgId === String(item.orgId)}" v-show="renameDept !== String(item.orgId)">{{ item.orgName }}</p>
                  <input :ref="item.orgId" type="text" v-show="renameDept === String(item.orgId)" v-model="renameInput" autocomplete="off" />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="button" @click="rename">重命名</button>
      <button class="button" @click="deleteDept">删除部门</button>
    </div>
  </div>
</template>

<script>
  import { getBLen } from '../../common/js/util'
  export default {
    name: 'person-dept-edit',
    data () {
      return {
        deptList: [],
        newDeptName: '',
        renameInput: '',
        chosenDept: {},
        renameDept: '',
        actives: [],
        searchInput: '',
        deptLikeList: []
      }
    },
    computed: {
      showCancel () {
        return this.searchInput !== ''
      }
    },
    created () {
      document.title = '部门编辑 — 虹膜门禁管理系统'
      this.$http.post('selOrgByParentId', JSON.stringify({
        parentId: 0
      })).then((res) => {
        if (res.data.status) {
          console.log('请求的部门列表数据：')
          console.log(res)
          this.deptList = res.data.data
          res.data.data.forEach((org) => {
            this.deptLikeList.push(org.orgId)
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    methods: {
      searchLike () {
        this.deptLikeList = []
        this.searchInput = this.searchInput.replace(/(^\s*)|(\s*$)/g, '')
        if (this.searchInput === '') {
          this.deptList.forEach((item) => {
            this.deptLikeList.push(item.orgId)
          })
        } else {
          this.$http.post('queryOrgLike', JSON.stringify({
            level: 1,
            like: this.searchInput
          })).then((res) => {
            console.log('模糊查询部门后得到的数据：')
            console.log(res)
            if (res.data.status) {
              res.data.data.forEach((item) => {
                this.deptLikeList.push(item.orgId)
              })
            }
          }).catch(err => console.log(err))
        }
      },
      reInitList () {
        this.$http.post('selOrgByParentId', JSON.stringify({
          parentId: 0
        })).then((res) => {
          if (res.data.status) {
            this.deptList = res.data.data
            this.searchLike()
            if (this.actives.length !== 0) {
              this.actives.forEach((orgId) => {
                let index = this.deptList.findIndex(dept => String(dept.orgId) === orgId)
                console.log('findIndex' + index)
                if (index !== -1) {
                  this.$http.post('selOrgByParentId', JSON.stringify({
                    parentId: orgId
                  })).then((res) => {
                    if (res.data.status) {
                      this.$set(this.deptList[index], 'children', res.data.data)
                      console.log(this.deptList)
                    }
                  }).catch(err => console.log(err))
                }
              })
            }
          }
        }).catch(err => console.log(err))
      },
      newDept () {
        let parentId = ''
        if (!this.chosenDept.hasOwnProperty('level') || this.chosenDept.level !== '1') {
          parentId = 0
        } else {
          parentId = this.chosenDept.orgId
        }
        if (getBLen(this.newDeptName) > 128) {
          this.$emit('alertMsg', '部门名称超出长度！')
          return
        }
        this.newDeptName = this.newDeptName.replace(/(^\s*)|(\s*$)/g, '')
        if (this.newDeptName !== '') {
          this.$http.post('addOrg', JSON.stringify({
            orgName: this.newDeptName,
            parentId: parentId
          })).then((res) => {
            this.newDeptName = ''
            if (res.data.status) {
              console.log('新增部门操作后的数据：')
              console.log(res.data)
              this.$emit('alertMsg', res.data.msg)
              this.reInitList()
            } else {
              this.$emit('alertMsg', res.data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$emit('alertMsg', '操作失败，请重试。')
          })
        }
      },
      chooseDept (e) {
        let target = e ? e.target : window.event.srcElement
        let item
        switch (target.tagName.toLowerCase()) {
          case 'i' : item = target.parentNode.parentNode
            break
          case 'p' : item = target.parentNode
            break
          default : return
        }
        console.log('选中项的信息：')
        console.log(item.dataset)
        let index = item.dataset.index
        let orgId = item.dataset.id
        let level = item.dataset.level
        this.chosenDept = {orgId: orgId, level: level}
        console.log(this.chosenDept)
        if (level === '1') {
          if (this.actives.indexOf(orgId) === -1) {
            this.actives.push(orgId)
            if (this.deptList[index].hasOwnProperty('children')) {
              return
            }
            this.$http.post('selOrgByParentId', JSON.stringify({
              parentId: orgId
            })).then((res) => {
              if (res.data.status) {
                this.$set(this.deptList[index], 'children', res.data.data)
              }
            }).catch(err => console.log(err))
          } else {
            this.actives.$remove(orgId)
          }
        }
      },
      checkName () {
        if (getBLen(this.renameInput) > 128) {
          this.$emit('alertMsg', '部门名称超出长度！')
          return
        }
        this.renameInput = this.renameInput.replace(/(^\s*)|(\s*$)/g, '')
        if (this.renameInput !== '') {
          this.$http.post('renameOrg', JSON.stringify({
            orgId: this.renameDept,
            orgName: this.renameInput
          })).then((res) => {
            this.renameDept = ''
            this.renameInput = ''
            if (res.data.status) {
              this.reInitList()
            }
          }).catch(err => console.log(err))
        } else {
          this.renameDept = ''
        }
      },
      deleteDept () {
        if (JSON.stringify(this.chosenDept) === '{}') {
          this.$emit('alertMsg', '请选择部门。')
          return
        }
        this.$emit('confirmMsg', '确定删除该部门吗？', () => {
          this.$http.post('delOrg', JSON.stringify({
            orgId: this.chosenDept.orgId
          })).then((res) => {
            if (res.data.status) {
              this.chosenDept = {}
              console.log(this.chosenDept)
              this.reInitList()
            } else {
              this.$emit('alertMsg', res.data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$emit('alertMsg', '操作失败，请重试。')
          })
        })
      },
      rename () {
        if (JSON.stringify(this.chosenDept) === '{}') {
          this.$emit('alertMsg', '请选择部门。')
          return
        }
        this.renameDept = this.chosenDept.orgId
        this.$nextTick(() => {
          this.$refs[this.renameDept][0].focus()
        })
      },
      cancelChosen (e) {
        let target = e ? e.target : window.event.srcElement
        console.log('target', target)
        if (target.tagName.toLowerCase() !== 'input' && target.tagName.toLowerCase() !== 'p' && target.tagName.toLowerCase() !== 'i' && target.tagName.toLowerCase() !== 'button') {
          this.chosenDept = {}
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  .person-dept-edit
    three-columns()
    padding-top 19vh
    .new-dept
      position relative
      .box-content
        label
          input
            display block
            width 200px
            margin-top 10px
            font-size 14px
            line-height 24px
        button
          position absolute
          bottom 20px
          left 20px
          width 200px
    .dept-list
      margin-left 50px
      .search-input
        margin-bottom 10px
      .my-bar
        flex-basis 310px !important
    .buttons
      display inline-block
      margin-left 50px
      .button
        background-color #0077d5
</style>
