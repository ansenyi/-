<template>
  <div id="app">
    <router-view></router-view>
    <loading v-if="isLoading"></loading>
    <div class="loading-mask" v-show="isLoading"></div>
  </div>
</template>

<script>
  import Bus from './common/js/Bus'
  import Loading from './components/Loading.vue'
  export default {
    name: 'app',
    data () {
      return {
        messageTimer: null,
        messageRed: false,
        isLoading: false
      }
    },
    created () {
      if (!window.localStorage) {
        alert('您的浏览器尚不支持本系统的部分功能，请换个浏览器试试~')
      }
      console.log(window.myToken)
    },
    mounted () {
      Bus.$on('startMessageTimer', this.startTimer)
      Bus.$on('endMessageTimer', this.endTimer)
      Bus.$on('requireMsg', this.sendMsgRed)
      Bus.$on('resetMsgData', () => {
        this.messageTimer = null
        this.messageRed = false
      })
      Bus.$on('showLoading', () => {
        this.isLoading = true
      })
      Bus.$on('hideLoading', () => {
        this.isLoading = false
      })
      this.startTimer()
    },
    watch: {
      messageRed (newVal) {
        Bus.$emit('hasMessage', newVal)
      }
    },
    methods: {
      sendMsgRed () {
        console.log('发送信息请求sendMsgRed')
        Bus.$emit('hasMessage', this.messageRed)
      },
      startTimer () {
//        if (window.localStorage.JWT_TOKEN && this.$route.name !== 'Login' && !this.messageTimer) {
        if (window.localStorage.getItem(window.myToken) && this.$route.name !== 'Login' && !this.messageTimer) {
          console.log('开始timer')
          this.getMessage()
          this.messageTimer = setInterval(this.getMessage, 600000)
        }
      },
      endTimer () {
        console.log('结束timer')
        clearInterval(this.messageTimer)
        this.messageTimer = null
      },
      getMessage () {
        console.log('得到信息getMessage')
        this.$http.post('getMessage', '')
        .then((res) => {
          console.log('请求getMessage后的数据结果：')
          console.log(res)
          if (res.data.status) {
            this.messageRed = res.data.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
    },
    components: {
      Loading
    }
  }
</script>

<style lang="stylus">
  .loading-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    background transparent
    z-index 998
</style>
