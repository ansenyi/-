<template>
  <div class="menu">
    <myHeader></myHeader>
    <div class="list">
      <router-link to="/device" class="item device-img"></router-link>
      <router-link to="/person" class="item person-img"></router-link>
      <br>
      <router-link to="/role" class="item role-img"></router-link>
      <router-link to="/log" class="item log-img"></router-link>
    </div>
  </div>
</template>

<script>
  import myHeader from '../Header/Header.vue'
  export default {
    name: 'menu',
    components: {
      myHeader
    },
    created () {
      document.title = '虹膜门禁管理系统'
    }
  }
</script>

<style lang="stylus" scoped>
  .menu
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background url('../../assets/background.png') no-repeat center center / cover
    .list
      margin-top 24vh
      text-align center
      line-height 90px
      .item
        display inline-block
        width 150px
        height 150px
        &:nth-of-type(2), &:nth-of-type(4)
          margin-left 40px
        &:nth-of-type(3)
          margin-left -5px
      .device-img
        background url('./w-device.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, 0.7)
        &:hover
          background url('./b-device.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, 0.7)
      .person-img
        background url('./w-person.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, 0.7)
        &:hover
          background url('./b-person.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, 0.7)
      .role-img
        background url('./w-role.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, 0.7)
        &:hover
          background url('./b-role.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, 0.7)
      .log-img
        background url('./w-log.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, 0.7)
        &:hover
          background url('./b-log.png') no-repeat center center / 100% 100%, rgba(51, 53, 56, 0.7)
</style>
