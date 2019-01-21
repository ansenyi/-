<template>
  <page>
    <nav class="section" v-show="this.$route.name !== 'DeviceSetting'">
      <p v-if="this.$route.name === 'DeviceSetting'" class="title">修改设备信息</p>
      <p v-else class="title">设备管理</p>
      <router-link to="/device/preview" :style="{color: previewColor}">设备预览</router-link> |
      <router-link to="/device/add" :style="{color: addColor}">设备添加</router-link> |
      <router-link to="/device/argument" :style="{color: argumentColor}">设备参数批量修改</router-link>
    </nav>
  </page>
</template>

<script>
  import Page from './Page.vue'
  export default {
    name: 'device-page',
    computed: {
      previewColor () {
        return this.$route.name === 'DevicePreview' ? '#fff' : '#2dc5fa'
      },
      addColor () {
        return this.$route.name === 'DeviceAdd' ? '#fff' : '#2dc5fa'
      },
      argumentColor () {
        return this.$route.name === 'DeviceArgument' ? '#fff' : '#2dc5fa'
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus" scoped>
  .section
    padding-left 28px
</style>
