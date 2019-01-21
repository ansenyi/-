<template>
  <div class="assign center">
    <div class="one-column left-column">
      <h4 class="box-title">{{ leftTitle }}</h4>
      <div class="box-content">
        <div class="search-input">
          <input type="text" placeholder="模糊搜索" v-model="leftSearchInput" @keyup="leftSearchLike" autocomplete="off" />
          <i class="input-cancel icon-cancel" v-show="showCancel" @click="leftSearchInput = '';leftSearchLike()"></i>
        </div>
        <div class="my-bar" v-bar>
          <ul ref="leftList" @click="leftClick($event)" @change="leftChange($event)">
            <li v-for="(items, index) in leftList" v-show="leftLikeList.indexOf(items.id) !== -1" :key="index" :data-index="index" :data-id="items.id">
              <p :class="chosenLeft === String(items.id) ? 'chosen' : ''">
                <i class="icon-right" v-show="actives.indexOf(String(index)) === -1"></i>
                <i class="icon-down" v-show="actives.indexOf(String(index)) !== -1"></i>
                {{ items.name }}
              </p>
              <ul v-show="actives.indexOf(String(index)) !== -1" :data-index="index">
                <li v-for="(item, index) in items.children" :key="index" :data-id="item.id" :data-name="item.name">
                  <input type="checkbox" v-model="item.checked" :id="'l' + items.id + item.id" :value="index" />
                  <label :for="'l' + items.id + item.id">{{ item.name }}</label>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <!--<div class="replace-little-bar" v-show="!chosenLeftList.length"></div>-->
        <div class="little-bar" v-bar>
          <div class="chosen-options">
            <div class="chosen-option" v-for="(item, index) in chosenLeftList" :key="index">
              {{ item.name }}
              <i class="chosen-cancel icon-cancel" @click="cancelChosenLeft(item.id, item.parentId, index)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="button" @click="toUnassigned()"><i class="icon-to-right"></i></button>
      <button class="button" @click="toAssigned()"><i class="icon-to-left"></i></button>
    </div>
    <div class="one-column right-column">
      <h4 class="box-title">{{ rightTitle }}</h4>
      <div class="box-content">
        <p @click="selectAll" v-show="select">全选</p>
        <p @click="unselectAll" v-show="!select">全不选</p>
        <div class="search-input">
          <input type="text" placeholder="模糊搜索" v-model="rightSearchInput" @keyup="rightSearchLike" autocomplete="off" />
          <i class="input-cancel icon-cancel" v-show="showCancelRight" @click="rightSearchInput = '';rightSearchLike()"></i>
        </div>
        <div class="my-bar" v-bar>
          <ul ref="rightList" @change="rightChange($event)">
            <li v-for="(item, index) in rightList" v-show="rightLikeList.indexOf(item.id) !== -1" :data-id="item.id" :data-name="item.name" :key="index">
              <input type="checkbox" v-model="item.checked" :id="'r' + item.id" :value="index" />
              <label :for="'r' + item.id">{{ item.name }}</label>
            </li>
          </ul>
        </div>
        <!--<div class="replace-little-bar" v-show="!chosenRightList.length"></div>-->
        <div class="little-bar" v-bar>
          <div class="chosen-options">
            <div class="chosen-option" v-for="(item, index) in chosenRightList" :key="index">
              {{ item.name }}
              <i class="chosen-cancel icon-cancel" @click="cancelChosenRight(item.id, index)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { searchLike, _debounce } from '../common/js/util'
  export default {
    name: 'assign',
    data () {
      return {
        leftList: [],  // id, name, checked, children:{id, name, checked}
        leftLikeList: [],  // id
        rightList: [],  // id, name, checked
        rightLikeList: [],  // id
        saveList: [],  // userId, orgId, editType
        chosenLeftList: [],  // 已选要解除分配的人员的'userId', userName, orgId
        chosenRightList: [],  // 已选要分配的人员的'userId', userName
        leftSearchInput: '',
        rightSearchInput: '',
        actives: [], // 显示出成员的部门的index
        chosenLeft: '', // 已选要分配人员的部门的orgId
        toAssigned: _debounce(this.toAssignedHandler),
        toUnassigned: _debounce(this.toUnassignedHandler)
      }
    },
    props: {
      leftTitle: {
        type: String,
        default: ''
      },
      rightTitle: {
        type: String,
        default: ''
      },
      initPost: {
        type: String,
        default: ''
      },
      leftPre: {
        type: String,
        default: ''
      },
      rightPre: {
        type: String,
        default: ''
      },
      queryLeft: {
        type: String,
        default: ''
      },
      queryRight: {
        type: String,
        default: ''
      },
      childrenPost: {
        type: String,
        default: ''
      },
      leftMsg: {
        type: String,
        default: ''
      },
      theLeftMsg: {
        type: String,
        default: ''
      },
      rightMsg: {
        type: String,
        default: ''
      },
      savePost: {
        type: String,
        default: ''
      }
    },
    computed: {
      select () {
        return this.rightList.length === 0 || this.chosenRightList.length !== this.rightList.length
      },
      showCancel () {
        return this.leftSearchInput !== ''
      },
      showCancelRight () {
        return this.rightSearchInput !== ''
      }
    },
    created () {
      if (this.$route.name === 'RoleRightAssign') {
        this.$http.post(this.queryLeft, JSON.stringify({
          like: ''
        })).then((res) => {
          if (res.data.status) {
            console.log('左侧模糊查询后的数据：')
            console.log(res)
            res.data.data.forEach((item) => {
              let suf = ''
              switch (item.roleType) {
                case 1 : suf = '（默认）'
                  break
                case 2 : suf = '（管理员）'
              }
              this.leftList.push({id: item[this.leftPre + 'Id'], name: item[this.leftPre + 'Name'] + suf})
              this.leftLikeList.push(item[this.leftPre + 'Id'])
            })
          }
        }).catch(err => console.log(err))
        this.$http.post(this.queryRight, JSON.stringify({
          like: ''
        })).then((res) => {
          if (res.data.status) {
            console.log('右侧模糊查询后的数据：')
            console.log(res)
            res.data.data.forEach((item) => {
              this.rightList.push({id: item[this.rightPre + 'Id'], name: item[this.rightPre + 'Name'], checked: false})
              this.rightLikeList.push(item[this.rightPre + 'Id'])
            })
            if (this.$route.params.deviceName) {
              this.rightSearchInput = this.$route.params.deviceName
              this.rightSearchLike()
            }
          }
        }).catch(err => console.log(err))
      } else {
        this.$http.post(this.initPost, '').then((res) => {
          if (res.data.status) {
            if (this.$route.name === 'RoleAssign') {
              res.data.data[1].forEach((item) => {
                let suf = ''
                switch (item.roleType) {
                  case 1 : suf = '（默认）'
                    break
                  case 2 : suf = '（管理员）'
                }
                this.leftList.push({id: item[this.leftPre + 'Id'], name: item[this.leftPre + 'Name'] + suf})
                this.leftLikeList.push(item[this.leftPre + 'Id'])
              })
              res.data.data[0].forEach((item) => {
                this.rightList.push({id: item[this.rightPre + 'Id'], name: item[this.rightPre + 'Name'], checked: false})
                this.rightLikeList.push(item[this.rightPre + 'Id'])
              })
            } else {
              res.data.data[0].forEach((item) => {
                this.leftList.push({id: item[this.leftPre + 'Id'], name: item[this.leftPre + 'Name']})
                this.leftLikeList.push(item[this.leftPre + 'Id'])
              })
              res.data.data[1].forEach((item) => {
                this.rightList.push({id: item[this.rightPre + 'Id'], name: item[this.rightPre + 'Name'], checked: false})
                this.rightLikeList.push(item[this.rightPre + 'Id'])
              })
            }
          }
        }).catch(err => console.log(err))
      }
    },
    methods: {
      async leftSearchLike () {
        let property = this.leftPre + 'Id'
        let path = this.queryLeft
        let option
        if (this.$route.name === 'PersonDeptManage') {
          option = {level: 2, like: this.leftSearchInput}
        } else {
          option = {like: this.leftSearchInput}
        }
        this.leftLikeList = []
        this.leftLikeList = await searchLike(this.leftSearchInput, this.leftList, this.leftLikeList, property, path, option)
      },
      async rightSearchLike () {
        let property = this.rightPre + 'Id'
        let path = this.queryRight
        let option = {like: this.rightSearchInput}
        this.rightLikeList = []
        this.rightLikeList = await searchLike(this.rightSearchInput, this.rightList, this.rightLikeList, property, path, option)
      },
      // 已选标签的添加
      leftChange (e) {
        let target = e ? e.target : window.event.srcElement
        let node = target.parentNode
        if (target.tagName.toLowerCase() === 'input') {
          let index = target.value
          let parentIndex = node.parentNode.dataset.index
          this.leftList[parentIndex].children[index].checked ? this.chosenLeftList.push({ id: node.dataset.id, name: node.dataset.name, parentId: node.parentNode.parentNode.dataset.id })
            : this.chosenLeftList.splice(this.chosenLeftList.findIndex((item) => item.id === node.dataset.id), 1)
        }
      },
      // 子列表的显示
      leftClick (e) {
        let target = e ? e.target : window.event.srcElement
        let node = target.parentNode
        let dataset
        switch (target.tagName.toLowerCase()) {
          case 'i' : dataset = node.parentNode.dataset
            break
          case 'p' : dataset = node.dataset
            break
          default :
            return
        }
        console.log('this.actives的数据：')
        console.log(this.actives)
        this.chosenLeft = dataset.id
        if (this.actives.indexOf(dataset.index) !== -1) {
          let index = this.actives.indexOf(dataset.index)
          this.actives.splice(index, 1)
          console.log(this.actives)
          return
        }
        this.getChildren(dataset.index, dataset.id)
        this.actives.push(dataset.index)
      },
      getChildren (index, id) {
        this.$http.post(this.childrenPost, JSON.stringify({
          [this.leftPre + 'Id']: id
        })).then((res) => {
          console.log('取子列表数据后的数据：')
          console.log(res.data.data)
          if (res.data.status) {
            let children = []
            res.data.data.forEach((item) => {
              let checked = this.$route.name !== 'RoleRightAssign'
                ? this.chosenLeftList.findIndex(i => i.id === String(item[this.rightPre + 'Id'])) > -1
                : this.chosenLeftList.findIndex(i => i.id === String(item[this.rightPre + 'Id']) && i.parentId === String(id)) > -1
              children.push({id: item[this.rightPre + 'Id'], name: item[this.rightPre + 'Name'], checked: checked})
            })
            this.$set(this.leftList[index], 'children', children)
//            callback()
          }
        }).catch(err => console.log(err))
      },
      rightChange (e) {
        console.log('向右点击')
        let target = e ? e.target : window.event.srcElement
        if (target.tagName.toLowerCase() === 'input') {
          let node = target.parentNode
          let index = target.value
          // this.rightList[index].checked = !this.rightList[index].checked
          this.rightList[index].checked ? this.chosenRightList.push({id: node.dataset.id, name: node.dataset.name})
            : this.chosenRightList.splice(this.chosenRightList.findIndex(item => item.id === node.dataset.id), 1)
        }
      },
      toUnassignedHandler () {
        if (this.chosenLeftList.length === 0) {
          this.$emit('alertMsg', this.leftMsg)
          return
        }
        this.saveList = []
        this.chosenLeftList.forEach((item) => {
          this.saveList.push({[this.rightPre + 'Id']: item.id, [this.leftPre + 'Id']: item.parentId, editType: 2})
        })
        this.saveAll(() => {
//          let children = []
          let leftParents = [] // {index, id}
          this.chosenLeftList.forEach((item) => {
            let index = this.leftList.findIndex(i => String(i.id) === item.parentId)
            let child = this.leftList[index].children.find(i => String(i.id) === item.id)
            child.checked = false
            console.log('index')
            console.log(index)
            // this.getChildren(index, item.parentId)
            leftParents.findIndex(p => p.id === item.parentId) < 0 ? leftParents.push({index: index, id: item.parentId}) : null
            if (this.$route.name !== 'RoleRightAssign') {
//              children.push(child)
              this.rightList.push(child)
            }
          })
          leftParents.forEach(p => this.getChildren(p.index, p.id))
//          this.rightList = children.concat(this.rightList)
          if (this.$route.name !== 'RoleRightAssign') {
            this.rightList.sort((x, y) => {
              return x.id - y.id
            })
          }
          this.chosenLeftList = []
          this.rightSearchLike()
          this.leftSearchLike()
          this.$emit('alertMsg', '解除分配成功！')
        })
      },
      toAssignedHandler () {
        if (this.chosenLeft === '') {
          this.$emit('alertMsg', this.theLeftMsg)
          return
        }
        if (this.chosenRightList.length === 0) {
          this.$emit('alertMsg', this.rightMsg)
          return
        }
        this.saveList = []
        this.chosenRightList.forEach((item) => {
          this.saveList.push({[this.rightPre + 'Id']: item.id, [this.leftPre + 'Id']: this.chosenLeft, editType: 1})
        })
        this.saveAll(() => {
          this.chosenRightList.forEach((item) => {
            let rIndex = this.rightList.findIndex(i => String(i.id) === item.id)
            this.rightList[rIndex].checked = false
            if (this.$route.name !== 'RoleRightAssign') {
              this.rightList.splice(rIndex, 1)
            }
          })
          let lIndex = this.leftList.findIndex(i => String(i.id) === this.chosenLeft)
          this.getChildren(lIndex, this.chosenLeft)
          this.chosenRightList = []
          this.leftSearchLike()
          this.rightSearchLike()
          this.$emit('alertMsg', '分配成功！')
        })
      },
      saveAll (callback) {
        if (this.saveList.length > 0) {
          this.$http.post(this.savePost, JSON.stringify(this.saveList))
            .then((res) => {
              if (res.data.status) {
                this.saveList = []
                callback()
              } else {
                this.saveList = []
                this.$emit('alertMsg', res.data.msg)
              }
            }).catch((err) => {
              console.log(err)
              this.saveList = []
              this.$emit('alertMsg', '保存失败，请重试。')
            })
        }
      },
      cancelChosenLeft (id, parentId, index) {
        let children = this.leftList.find(i => String(i.id) === parentId).children
        let left = children.find((i) => {
          return String(i.id) === id
        })
        console.log('left的内容是：')
        console.log(left)
        if (!left) {
          console.log('左边选中的不在左边')
          return
        }
        left.checked = false
        this.chosenLeftList.splice(index, 1)
      },
      cancelChosenRight (id, index) {
        let right = this.rightList.find((i) => {
          return String(i.id) === id
        })
        if (!right) {
          console.log('右边选中的不在右边')
          return
        }
        right.checked = false
        this.chosenRightList.splice(index, 1)
      },
      selectAll () {
        if (this.rightLikeList.length === this.rightList.length) {
          this.chosenRightList = []
          this.rightList.forEach((d) => {
            d.checked = true
            this.chosenRightList.push({id: String(d.id), name: d.name})
          })
        } else {
          this.rightLikeList.forEach((id) => {
            let right = this.rightList.find(d => d.id === id)
            if (!this.chosenRightList.some(d => d.id === String(id))) {
              right.checked = true
              this.chosenRightList.push({id: String(right.id), name: right.name})
            }
          })
        }
      },
      unselectAll () {
        this.chosenRightList = []
        this.rightList.forEach((d) => {
          d.checked = false
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/mixin.styl'
  .assign
    three-columns()
    padding-top 18vh
    .replace-little-bar
      height 10px
    .right-column
      .box-content
        p
          margin -16px 0 4px
          text-align right
          cursor pointer
          color #2dc5fa
          font-size 14px
    .button
     background-color #0077d5
</style>
