<template>
  <div class="center">
    <h2>404</h2>
    <p>抱歉，您所访问的页面不存在，请重新加载~</p>
    <p><a href="javascript:;" @click="$router.go(0)"><i class="icon-refresh"></i>刷新网页</a><router-link to="/menu"><i class="icon-left"></i>返回首页</router-link></p>
  </div>
</template>

<script>
  export default {
    name: 'not-found',
    created () {
      document.title = '页面不存在'
    }
  }
</script>

<style lang="stylus" scoped>
  .center
    margin-top 24vh
    font-size 20px
    h2
      margin 0
      font-size 90px
      font-weight 500
      color rgba(#0077d5, .8)
      text-shadow -2px -2px 7px darken(#0077d5, 40%)
    p
      &:first-of-type
        font-size 22px
        color #333538
      a
        height 22px
        line-height 22px
        &:first-of-type
          margin-left -10px
        &:last-of-type
          margin-left 40px
        display inline-block
        padding 5px 8px 5px 5px
        border 1px solid #0077d5
        border-radius 3px
        color #333538
        cursor pointer
        text-decoration none
      i
        cursor pointer
        color #0077d5
      .icon-refresh
        margin 5px
        font-size 15px
        font-weight normal
      .icon-left
        font-size 20px
        line-height 20px
    // div
      // background url('./Menu/y-role.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, .7)
</style>
