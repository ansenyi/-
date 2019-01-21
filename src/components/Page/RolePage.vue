<template>
  <page>
    <nav class="section">
      <p class="title">角色管理</p>
      <router-link to="/role/preview" :style="{color: previewColor}">角色预览</router-link> |
      <router-link to="/role/right-assign" :style="{color: rightAssignColor}">权限分配</router-link> |
      <router-link to="/role/assign" :style="{color: roleAssignColor}">角色分配</router-link>
    </nav>
  </page>
</template>

<script>
  import Page from './Page.vue'
  export default {
    name: 'role-page',
    computed: {
      previewColor () {
        return this.$route.name === 'RolePreview' ? '#fff' : '#2dc5fa'
      },
      rightAssignColor () {
        return this.$route.name === 'RoleRightAssign' ? '#fff' : '#2dc5fa'
      },
      roleAssignColor () {
        return this.$route.name === 'RoleAssign' ? '#fff' : '#2dc5fa'
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="stylus">

</style>
