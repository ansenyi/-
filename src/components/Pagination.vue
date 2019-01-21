<template>
  <div class="pagination">
    <label for="page" class="select-label">
      <select id="page" class="select-size" ref="selectSize" @change="selectSize">
        <option value="5">每页10条</option>
        <option value="20">每页20条</option>
        <option value="30">每页30条</option>
      </select>
      <i id="first" class="select-down icon-down"></i>
    </label>
    <ul class="page-list">
      <li class="prev" v-show="curPage !== 1" @click="prevPage">
        <span><i class="icon-prev"></i></span>
      </li>
      <li class="first" v-show="totalPages > 1" @click="goPage(1)">
        <span :class="{'active': curPage === 1}">1</span>
      </li>
      <li class="ellipsis" v-show="prevClipped"><span>...</span></li>
      <li v-for="index in pages" :key="index" @click="goPage(index)">
        <span :class="{'active': curPage === index}">{{ index }}</span>
      </li>
      <li class="ellipsis" v-show="nextClipped"><span>...</span></li>
      <li class="last" @click="goPage(totalPages)">
        <span :class="{'active': curPage === totalPages}">{{ totalPages }}</span>
      </li>
      <li class="next" v-show="curPage !== totalPages" @click="nextPage">
        <span><i class="icon-next"></i></span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'pagination',
    props: {
      totalPages: {
        type: Number,
        default: 1,
        validator: i => i > 0
      },
      current: {
        type: Number,
        default: 1,
        validator: i => i > 0
      }
    },
    data () {
      return {
        nextClipped: false,
        prevClipped: false,
        curPage: this.current
      }
    },
    computed: {
      pages () {
        let ret = []
        this.curPage = this.current
        if (this.curPage > 3) {
          // 当前页码大于三时，显示当前页码的前2个
          ret.push(this.curPage - 2)
          ret.push(this.curPage - 1)
          this.prevClipped = this.curPage > 4
        } else {
          this.prevClipped = false
          for (let i = 2; i < this.curPage; i++) {
            ret.push(i)
          }
        }
        if (this.curPage !== this.totalPages && this.curPage !== 1) {
          ret.push(this.curPage)
        }
        if (this.curPage < (this.totalPages - 2)) {
          // 显示当前页码的后2个
          ret.push(this.curPage + 1)
          ret.push(this.curPage + 2)
          // 当前页与最后一页差距3以上时显示省略号
          this.nextClipped = this.curPage < (this.totalPages - 3)
        } else {
          this.nextClipped = false
          for (let i = (this.curPage + 1); i < this.totalPages; i++) {
            ret.push(i)
          }
        }
        return ret
      }
    },
    watch: {
      curPage (newVal) {
        console.log('当前页面currentPage：' + newVal)
        this.$emit('toPage', newVal)
        // this.$forceUpdate()
      }
    },
    methods: {
      selectSize () {
        let select = this.$refs.selectSize
        let index = select.selectedIndex
        let size = select[index].value
        this.$emit('changeSize', size)
      },
      prevPage () {
        this.curPage--
      },
      nextPage () {
        this.curPage++
      },
      goPage (index) {
        if (index !== this.curPage) {
          this.curPage = index
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/mixin.styl'
  .pagination
    display flex
    justify-content center
    align-items center
    margin-top 20px
    .select-label
      select-label()
      &:before
        top 0
        right 0
        width 94px
        height 26px
        border-radius 3px
      .select-size
        height 26px
        color #444
        border 1px solid #999
        border-radius 3px
      .select-down
        top 4px
        right 4px
        color #999
    .page-list
      display flex
      li
        list-style none
        color #666
        //padding 0 3px
        &:not(.ellipsis)
          span
            display block
            min-width 24px
            height 25px
            margin 0 4px
            line-height 25px
            text-align center
            border 1px solid #999
            border-radius 3px
            text-shadow 0 1px 0 #fff
            cursor pointer
            background #fff
            i
              line-height 25px
          .active, span:hover
            color #fff
            background #0077d5
            /*border 1px solid #0077d5*/
</style>
