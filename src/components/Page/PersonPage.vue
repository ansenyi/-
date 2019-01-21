<template>
  <page>
    <nav class="section" v-show="this.$route.name !== 'PersonSetting'">
      <p v-if="this.$route.name === 'PersonSetting'" class="title">修改人员信息</p>
      <p v-else class="title">人员管理</p>
      <router-link to="/person/preview" :style="{color: previewColor}">人员预览</router-link> |
      <router-link to="/person/department-edit" :style="{color: editColor}">部门编辑</router-link> |
      <router-link to="/person/department-manage" :style="{color: manageColor}">部门管理</router-link>
    </nav>
  </page>
</template>

<script>
  import Page from './Page.vue'
  export default {
    name: 'person-page',
    computed: {
      previewColor () {
        return this.$route.name === 'PersonPreview' ? '#fff' : '#2dc5fa'
      },
      editColor () {
        return this.$route.name === 'PersonDeptEdit' ? '#fff' : '#2dc5fa'
      },
      manageColor () {
        return this.$route.name === 'PersonDeptManage' ? '#fff' : '#2dc5fa'
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus">

</style>
