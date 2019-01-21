<template>
  <assign :leftTitle="leftTitle" :rightTitle="rightTitle" :initPost="initPost" :leftPre="leftPre" :rightPre="rightPre" :queryLeft="queryLeft" :queryRight="queryRight"
                        :childrenPost="childrenPost" :leftMsg="leftMsg" :theLeftMsg="theLeftMsg" :rightMsg="rightMsg" :savePost="savePost" @alertMsg="alertMsg"></assign>
</template>

<script>
  import Assign from '../Assign.vue'
  export default {
    name: 'role-assign',
    data () {
      return {
        leftTitle: '已有角色',
        rightTitle: '无角色人员列表',
        initPost: 'roleUserManagePage',
        leftPre: 'role',
        rightPre: 'user',
        queryLeft: 'findAllRole',
        queryRight: 'queryUserLikeNoRole',
        childrenPost: 'selUsersByRole',
        leftMsg: '请选择要解除分配的人员。',
        theLeftMsg: '请选择角色。',
        rightMsg: '请选择要分配的人员。',
        savePost: 'editUserInRole'
      }
    },
    created () {
      document.title = '角色分配 — 虹膜门禁管理系统'
    },
    methods: {
      alertMsg (msg) {
        this.$emit('alertMsg', msg)
      }
    },
    components: {
      Assign
    }
  }
</script>

<style>

</style>
