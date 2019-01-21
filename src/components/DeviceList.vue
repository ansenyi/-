<template>
  <div class="device-list">
    <h4 class="box-title">设备列表</h4>
    <div class="box-content">
      <p @click="selectAll" v-if="$route.name !== 'Blog'" v-show="select">全选</p>
      <p @click="unselectAll" v-if="$route.name !== 'Blog'" v-show="!select">全不选</p>
      <p v-else></p>
      <div class="search-input">
        <input type="text" placeholder="模糊搜索" v-model="searchInput" @keyup="searchLike" autocomplete="off" />
        <i class="input-cancel icon-cancel" v-show="showCancel" @click="searchInput = '';searchLike()"></i>
      </div>
      <!--<div class="replace-little-bar" v-show="!chosenDeviceList.length"></div>-->
      <div class="my-bar" v-bar>
        <ul ref="list" @change="deviceChange($event)">
          <li v-for="(item, index) in deviceList" v-show="deviceLikeList.indexOf(item.id) !== -1" :key="index">
            <input type="checkbox" v-model="item.checked" :id="'d' + index" :value="index">
            <label :for="'d' + index">{{ item.name }}</label>
          </li>
        </ul>
      </div>
      
      <div class="little-bar" v-show="chosenDeviceList.length" v-bar>
        <div class="chosen-options">
          <div class="chosen-option" v-for="(item, index) in chosenDeviceList" :key="index">
            {{ deviceList[item].name }}
            <i class="chosen-cancel icon-cancel" @click="cancelChosen(item, index)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../common/js/Bus'
  import { searchLike } from '../common/js/util'
  export default {
    name: 'device-list',
    props: {
      initPost: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        deviceList: [],  // id, name, checked
        deviceLikeList: [], // id
        chosenDeviceList: [],  // 'index'
        searchInput: ''
      }
    },
    computed: {
      select () {
        return this.deviceList.length === 0 || this.chosenDeviceList.length !== this.deviceList.length
      },
      showCancel () {
        return this.searchInput !== ''
      }
    },
    created () {
      this.initList()
    },
    mounted () {
      Bus.$on('getCheckedList', this.checkedList)
      Bus.$on('unselectAllClick', this.unselectAll)
    },
    methods: {
      // 初始化列表
      initList () {
        this.$http.post(this.initPost, JSON.stringify({like: ''}))
        .then((res) => {
          console.log('初始化设备列表请求后获得的数据：')
          console.log(res)
          if (res.data.status) {
            res.data.data.forEach((device) => {
              let suf = ''
              if (this.$route.name === 'Blog' && device.status === 0) {
                suf = '（已删除）'
              }
              this.deviceList.push({id: device.deviceId, name: device.deviceName + suf, checked: false})
              this.deviceLikeList.push(device.deviceId)
            })
          }
        })
        .catch((err) => {
          console.log('初始化列表失败！')
          console.log(err)
        })
      },
      async searchLike () {
        let property = 'deviceId'
        let path = this.initPost
        let option = {like: this.searchInput}
        this.deviceLikeList = []
        this.deviceLikeList = await searchLike(this.searchInput, this.deviceList, this.deviceLikeList, property, path, option)
      },
      deviceChange (e) {
        let target = e ? e.target : window.event.srcElement
        if (target.tagName.toLowerCase() === 'input') {
          let index = target.value
          this.deviceList[index].checked ? this.chosenDeviceList.push(index) : this.chosenDeviceList.splice(this.chosenDeviceList.indexOf(index), 1)
//          let deviceNode = target.parentNode
//          target.checked ? this.chosenDeviceList.push({id: deviceNode.dataset.id, name: deviceNode.dataset.name, node: deviceNode})
//            : this.chosenDeviceList.splice(this.chosenDeviceList.findIndex(device => device.id === deviceNode.dataset.id), 1)
        }
      },
      cancelChosen (item, index) {
        this.deviceList[item].checked = false
        this.chosenDeviceList.splice(index, 1)
      },
      selectAll () {
        if (this.deviceLikeList.length === this.deviceList.length) {
          this.chosenDeviceList = []
          this.deviceList.forEach((d, index) => {
            d.checked = true
            this.chosenDeviceList.push(String(index))
          })
        } else {
          this.deviceLikeList.forEach((id) => {
            let index = this.deviceList.findIndex(d => {
              return d.id === id
            })
            if (this.chosenDeviceList.indexOf(String(index)) === -1) {
              this.deviceList[index].checked = true
              this.chosenDeviceList.push(String(index))
            }
          })
        }
      },
      unselectAll () {
        this.chosenDeviceList = []
        this.deviceList.forEach((d) => {
          d.checked = false
        })
      },
      checkedList () {
        let arr = [[], []]
        this.chosenDeviceList.forEach((i) => {
          arr[0].push(this.deviceList[i].id)
          arr[1].push(this.deviceList[i].name)
        })
        this.$emit('sendCheckedList', arr)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../common/stylus/mixin.styl'
  boxWidth = 240px
  .device-list
    grey-black(boxWidth)
    display inline-block
    vertical-align top
    .box-content
      display flex
      flex-direction column
      width boxWidth
      height 280px
      padding 0 20px 13px
      box-sizing border-box
      p
        margin 5px 0
        text-align right
        cursor pointer
        color #2dc5fa
        font-size 15px
        line-height 16px
      .search-input
        search-input()
      .chosen-options
        chosen-options()
      ul
        height 188px
        margin 0
        padding 0
        list-style none
        text-align left
        li
          padding-bottom 3px
        label
          cursor pointer
      .replace-little-bar
        height 10px
      .little-bar
        flex 1 0 auto
        max-height 40px
        margin 5px -12px 0 0
      .my-bar
        flex 0 1 230px
        margin-right -12px
        margin-top 8px
  .device-argument-list
    .box-content
      height 360px
      ul
        height 268px
      .little-bar
        max-height 90px
      .my-bar
        flex 0 1 300px
</style>
