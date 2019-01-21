<template>
  <div class="tables">
    <div class="search">
      <i class="input-search icon-search" @click="searchLike"></i>
      <input type="text" v-model="searchText" ref="search" :placeholder="placeholder" @keyup.enter="searchLike" autocomplete="">
      <i class="input-cancel icon-cancel" v-show="showCancel" @click="searchText = '';searchLike()"></i>
    </div>
    <table>
      <caption class="count">
        <slot name="count"></slot>
      </caption>
      <thead @click="sortClick($event)">
	      <tr>
	        <th v-for="(thead, index) in theads" :key="index">
	          <span>{{ thead.title }}</span>
	          <a><i class="icon-asc" v-if="index !== theads.length-1 && thead.prop !== 'ip'" data-direction="asc" :data-prop="thead.prop"></i></a>
	          <a><i class="icon-desc" v-if="index !== theads.length-1 && thead.prop !== 'ip'" data-direction="desc" :data-prop="thead.prop"></i></a>
	        </th>
	      </tr>
      </thead>
      <tbody @click="removeId($event)">
	      <tr v-for="(items, index) in tableData" :class="{ 'grey': items[5] === '未连接', 'red': items[1] === 'Untitled'}" :key="index">
	        <td v-for="(item, index) in items" :class="{'occu-red': ($route.name === 'DevicePreview' && index === items.length - 1 && item.replace('%', '') > 100), 'occu-yellow': ($route.name === 'DevicePreview' && index === items.length - 1 && item.replace('%', '') > 80 && item.replace('%', '') < 100)}"
	            v-if="!($route.name === 'PersonPreview' && index === 0)" :key="index">{{ item }}
	        </td>
	        <td>
	          <span v-if="$route.name === 'RolePreview'" @click="eEditShow(items[0])"><i class="icon-edit"></i></span>
	          <router-link v-else :to="encodeURI(settingPath + '/' + items[0])"><i class="icon-edit"></i></router-link>
	          <span v-if="$route.name === 'DevicePreview' || $route.name === 'PersonPreview'" @click="detailShow(items[0])"><i class="icon-list"></i></span>
	          <span v-if="$route.name === 'DevicePreview' || $route.name === 'PersonPreview'" @click="tableShow(items[0], items[1])"><i class="icon-table"></i></span>
	          <span><i class="icon-remove" :data-id="items[0]" :data-name="items[1]"></i></span>
	        </td>
	      </tr>
      </tbody>
    </table>
    <pagination :totalPages="totalPages ? totalPages : 1" :current="curPage + 1" @toPage="toPage" @changeSize="changeSize"></pagination>
  </div>
</template>

<script>
  import Pagination from './Pagination.vue'
  export default {
    name: 'tables',
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      theads: {
        type: Array,
        default: () => []
      },
      tableData: {
        type: Array,
        default: () => []
      },
      settingPath: {
        type: String,
        default: ''
      },
      totalPages: {
        type: Number,
        default: 1
      },
      curPage: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        searchText: ''
      }
    },
    computed: {
      showCancel () {
        return this.searchText !== ''
      }
    },
    methods: {
      sortClick (e) {
        let target = e ? e.target : window.event.srcElement
        let prop = target.dataset.prop
        if (target.dataset.direction === 'asc') {
          console.log('按asc顺序排')
          this.$emit('updateData', undefined, undefined, 'asc', prop)
        } else if (target.dataset.direction === 'desc') {
          console.log('按desc顺序排')
          this.$emit('updateData', undefined, undefined, 'desc', prop)
        }
      },
      searchLike () {
        // this.$refs.search.blur()使搜索框失去焦点
        this.$emit('updateData', undefined, undefined, undefined, undefined, this.searchText)
      },
      removeId (e) {
        let target = e ? e.target : window.event.srcElement
        if (target.className === 'icon-remove' && target.dataset.id) {
          let id = target.dataset.id
          let name = target.dataset.name
          console.log('id=' + id)
          this.$emit('removeId', id, name)
        }
      },
      toPage (curPage) {
        this.$emit('updateData', curPage - 1)
      },
      changeSize (size) {
        this.$emit('updateData', undefined, size)
      },
      detailShow (id) {
        console.log('进行详情显示')
        if (this.$route.name === 'DevicePreview') {
          this.$emit('showDeviceDetail', id)
        } else if (this.$route.name === 'PersonPreview') {
          this.$emit('showPersonDetail', id)
        }
      },
      eEditShow (id) {
        console.log('显示edit编辑页面')
        if (this.$route.name === 'RolePreview') {
          this.$emit('showRoleEdit', id)
        }
      },
      tableShow (id, name) {
        if (this.$route.name === 'DevicePreview') {
          this.$emit('showDeviceTable', id, name)
        } else if (this.$route.name === 'PersonPreview') {
          this.$emit('showPersonTable', id, name)
        }
      }
    },
    components: {
      Pagination
    }
  }
</script>

<style lang="stylus" scoped>
  .occu-red
    color #d84c4c
  .occu-yellow
    color #0077d5
  .tables
    margin-top -50px
    .grey
      color #999 !important
    .red
      color #d84c4c
    .search
      position relative
      width 250px
      height 32px
      margin 40px auto 30px 10%
      font-size 16px
      line-height 32px
      .input-search
        position absolute
        top 0
        left 0
        font-size 30px
        line-height 32px
        cursor pointer
        &:active
          color #ccc
      .input-cancel
        position absolute
        top 0
        right 5px
        font-size 20px
        line-height 32px
        color #ccc
        cursor pointer
        &:hover
          color #888
      input
        width 100%
        padding 2px 30px
        box-sizing border-box
        line-height 24px
    table, th, td
      border 1.5px solid #eee
    table
      border-collapse collapse
      margin 0 auto
      max-width 95%
      .count
        padding-right 5px
        text-align right
        font-size 14px
        span
          padding-left 30px
      th, td
        max-width 300px
        height 38px
        /*color #888888*/
      th
        position relative
        min-width 95px
        font-weight normal
        color #000
        background #fafafa
        background-clip padding-box
        padding 0 10px
        a
          position absolute
          right 6px
          font-size 10px
          cursor pointer
          &:first-of-type
            top 6px
          &:last-of-type
            bottom 6px
          &:active
            color #ccc
      td
        text-align center
        padding 0 10px
        background #fff
        a
          text-decoration none
        span
          cursor pointer
        i
          color #2dc5fa
          font-size 28px
        &:not(:last-of-type)
          white-space pre-wrap
          word-break break-all
        &:last-of-type
          white-space nowrap
      .control-disabled
        cursor default
        i
          color #ccc
</style>
