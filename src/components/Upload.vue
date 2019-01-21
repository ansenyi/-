<template>
  <div class="upload">
    <page>
      <!--<p class="title">上传软件</p>-->
      <div slot="container" class="container center">
        <form class="form-container">
          <h4 class="form-title">上传软件信息</h4>
          <label for="add-file">
            <span>软件<span style="color: #d84c4c;font-size: 20px;">*</span>：</span>
            <div id="add-file">
              <input type="file" id="file" accept=".apk" class="inputfile inputfile-6" @change="getAPKFile($event)" @focus="addFocus($event)" @blur="removeFocus($event)" alt="浏览器不支持本上传组件。"/>
              <label ref="addFile" for="file" :class="redAdd && fileName === '' ? 'red' : ''"><span>{{ fileName }}</span> <i><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></i></label>
            </div>
          </label>
          <label for="version">
            <span>版本<span style="color: #d84c4c;font-size: 20px;">*</span>：</span>
            <input ref="version" type="text" id="version" v-model="version" :class="redAdd && version === '' ? 'red' : ''" autocomplete="off" />
          </label>
          <label for="limit" class="select-label">
            最低版本：
            <select id="limit" v-model="limit">
              <option disabled selected v-show="false" value="请选择">请选择</option>
              <option :value="version">当前版本</option>
              <option v-for="(item, index) in versionList" :key="index" :value="item">{{ item }}</option>
            </select>
            <i class="select-down icon-down"></i>
          </label>
          <label for="description">
            软件描述：
            <textarea id="description" v-model="description" cols="23" rows="6"></textarea>
          </label>
        </form>
        <div class="buttons">
          <button class="button" v-show="!loading" @click="uploadFile">上传</button>
          <button class="button disabled-button" v-show="loading">正在上传...</button>
          <button class="button" @click="$router.go(-1) || $router.push('/')">返回</button>
        </div>
      </div>
    </page>
  </div>
</template>

<script>
  import Bus from '../common/js/Bus'
  import Page from './Page/Page.vue'
  import { getBLen } from '../common/js/util'
  export default {
    name: 'upload',
    data () {
      return {
        fileName: '',
        version: '',
        description: '',
        limit: '请选择',
        versionList: [],
        redAdd: false,
        file: null,
        loading: false
      }
    },
    created () {
      document.title = '软件上传 — 虹膜门禁管理系统'
      this.$http.post('queryAllVersion', '').then((res) => {
        if (res.data.status) {
          this.versionList = this.sortVersion(res.data.data)
        }
      }).catch(err => console.log(err))
    },
    mounted () {
      let options = document.querySelectorAll('option[disabled=disabled]')
      if (options.length > 0 && (navigator.userAgent.indexOf('Trident') > -1 || navigator.userAgent.indexOf('Edge') > -1)) {
        for (let i = 0; i < options.length; i++) {
          options[i].style.display = 'block'
        }
      }
    },
    methods: {
      getAPKFile (e) {
        let target = e ? e.target : window.event.srcElement
        this.file = target.files[0]
        this.fileName = target.value.split('\\').pop()
      },
      addFocus (e) {
        let target = e ? e.target : window.event.srcElement
        target.classList.add('has-focus')
      },
      removeFocus (e) {
        let target = e ? e.target : window.event.srcElement
        target.classList.remove('has-focus')
      },
      uploadFile () {
        console.log('upload')
        this.description = this.description.replace(/(^\s*)|(\s*$)/g, '')
        this.version = this.version.replace(/(^\s*)|(\s*$)/g, '')
//        if (this.fileName === '') {
//          this.$refs.addFile.classList.add('red')
//        }
//        if (this.version === '') {
//          this.$refs.version.classList.add('red')
//        }
        if (this.fileName === '' || this.version === '') {
          this.redAdd = true
          return
        }
        let limit = ''
        if (this.limit !== '请选择') {
          limit = this.limit
        }
        if (getBLen(this.version) > 32) {
          this.$emit('alertMsg', '版本超出长度！')
          return
        }
        if (getBLen(this.description) > 256) {
          this.$emit('alertMsg', '软件描述超出长度！')
          return
        }
        let formData = new FormData()
        formData.append('apk', this.file)
        console.log(this.version)
        formData.append('apkVersion', this.version)
        formData.append('apkDesc', this.description)
        formData.append('minVersion', limit)
        console.log('上传')
        this.loading = true
        this.$http.post('uploadApk', formData, {
          timeout: 200000,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((res) => {
          console.log(res)
          this.loading = false
          if (res.status === 200) {
            this.redAdd = false
            Bus.$emit('alertMsgShow', res.data.msg)
            this.$http.post('queryAllVersion', '').then((res) => {
              if (res.data.status) {
                this.versionList = this.sortVersion(res.data.data)
              }
            }).catch(err => console.log(err))
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
          Bus.$emit('alertMsgShow', '上传失败，请重试。')
        })
      },
      sortVersion (arr) {
        let sorted = []
        let unsorted = []
        let re = /^\d+(\.\d+)*$/g
        arr.forEach(v => re.test(v) ? sorted.push(v.match(re)[0]) : unsorted.push(v))
        console.log(sorted)
        sorted.sort((x, y) => {
          x = String(x).split('.')
          y = String(y).split('.')
          for (let i = 0; i < x.length; i++) {
//            console.log(x[i])
//            console.log(y[i])
            if (parseInt(x[i]) < parseInt(y[i])) {
//              console.log('return 1')
              return 1
            } else if (parseInt(x[i]) > parseInt(y[i])) {
              return -1
            }
          }
          if (x.length < y.length) {
            return 1
          }
          return 0
        })
        return sorted.concat(unsorted)
      }
//      clearRed (e) {
//        let target = e ? e.target : window.event.srcElement
//        if (target.tagName.toLowerCase() === 'span' || target.tagName.toLowerCase() === 'svg') {
//          target = this.$refs.addFile
//        }
//        if (this.redAdd && target.classList.contains('red')) {
//          console.log('remove')
//          target.classList.remove('red')
//        }
//      },
//      addRed (e) {
//        let target = e ? e.target : window.event.srcElement
//        this.version = this.version.replace(/(^\s*)|(\s*$)/g, '')
//        if (this.redAdd && this.version === '') {
//          target.classList.add('red')
//        }
//      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/stylus/mixin.styl'
  @import '../common/stylus/input-file.css'
  formWidth = 560px
  .container
    padding-top 20vh
    .form-container
      display inline-block
      form-container(formWidth)
      height 320px
      margin 0 auto
      >label
        width 290px
        margin 7px auto
        #version
          text-align left
        &:first-of-type
          height 30px
          line-height 30px
          font-size 16px
          vertical-align middle
          #add-file
            display inline-block
            width 200px
            height 22px
        &:last-of-type
          margin-top 14px
          textarea
            width 200px
            height 112px
            box-sizing border-box
            border none
            align-self flex-start
      label[for=version]
        >span
          align-self center
      .select-label
        select-label()
        &:before
          right 0
          width 200px
        .select-down
          top 8px
          right 4px
    .buttons
      display inline-block
      margin-left 75px
      vertical-align bottom
      .button
        display block
        margin 75px 0
        background #0077d5
      .disabled-button
        cursor default
        color #eee
        background #999
</style>
