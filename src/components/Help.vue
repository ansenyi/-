<template>
  <div class="help-page">
    <page>
      <p class="title">帮助</p>
      <div slot="container" class="container center">
        <div class="video-container">
          <div class="video-list">
            <div class="video-title">
              <h4>目录</h4>
              <hr />
            </div>
            <div class="list-wrapper" v-bar>
              <ul @click="listClick($event)">
                <li class="first-step" :data-index="index" v-for="(items, index) in titleList" :key="index">
                  <p>
                    <i class="icon-right" v-show="actives.indexOf(index) === -1"></i>
                    <i class="icon-down" v-show="actives.indexOf(index) !== -1"></i>
                    {{ items.title }}
                  </p>
                  <ul v-show="actives.indexOf(index) !== -1">
                    <li class="second-step" v-for="(item, index) in items.secList" :key="index">
                      <p>{{ item }}</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="player-wrapper">
            <div class="player-title">
              <h4>{{ videoTitle }}</h4>
              <hr />
            </div>
            <video-player  class="vjs-custom-skin"
                           ref="videoPlayer"
                           :options="playerOptions">
            </video-player>
          </div>
        </div>
      </div>
    </page>
  </div>
</template>

<script>
  import Page from '../components/Page/Page.vue'
  import 'vue-video-player/src/custom-theme.css'
  import 'video.js/dist/video-js.css'
  export default {
    name: 'help',
    data () {
      return {
        playerOptions: {
          height: '360',
          width: '640',
          language: 'zh-CN',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: 'video/mp4',
            src: '../../static/标题-1.mp4'
          }],
          poster: '../../static/标题1-1.png'
        },
        titleList: [{title: '标题1', secList: ['标题1-1', '标题1-2', '标题1-3', '标题1-4']}, {title: '标题2', secList: ['标题2-1', '标题2-2', '标题2-3']}, {title: '标题3', secList: ['标题3-1', '标题3-2', '标题3-3']}], // {title: '', secList: []}
        actives: [0, 2], // index
        videoTitle: '标题1-1'
      }
    },
    mounted () {
      this.playerOptions.sources[0].src = '../../static/标题1-2.mp4'
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      listClick (e) {
        let target = e ? e.target : window.event.srcElement
        let item
        switch (target.tagName.toLowerCase()) {
          case 'i': item = target.parentNode.parentNode
            break
          case 'p' : item = target.parentNode
            break
          default : return
        }
        let index = parseInt(item.dataset.index)
        if (item.classList.contains('first-step')) {
          this.actives.indexOf(index) > -1 ? this.actives.splice(this.actives.indexOf(index), 1) : this.actives.push(index)
        } else if (item.classList.contains('second-step')) {
          console.log(item.querySelector('p').innerHTML)
          this.videoTitle = item.querySelector('p').innerHTML
          this.playerOptions.sources[0].src = '../../static/' + item.querySelector('p').innerHTML + '.mp4'
          this.playerOptions.poster = '../../static/' + item.querySelector('p').innerHTML + '.png'
        }
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" scoped>
  .help-page
    .video-container
      display flex
      width 880px
      height 420px
      margin 0 auto
      overflow hidden
      border-radius 2px
      box-shadow 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
      .video-list
        flex 0 0 240px
        height 420px
        background #333538
        color #fff
        font-size 18px
        font-weight lighter
        .video-title
          h4
            margin 15px auto 7px
            font-size 20px
            font-weight lighter
          hr
            margin 0
            height 1.5px
            border none
            background #292a2d
        .list-wrapper
          height 420px
          ul
            list-style none
            margin 0
            padding 0
            text-align left
            li
              p
                display block
                margin 0
                padding 8px 0 8px 20px
                &:hover
                  background lighten(#333538, 20%)
              >ul li p
                padding-left 43px
                background darken(#333538, 20%)
      .player-wrapper
        flex 0 0 640px
        .player-title
          h4
            margin 15px auto 7px 10px
            text-align left
            font-size 20px
            font-weight lighter
          hr
            margin 0 0 16px
</style>
