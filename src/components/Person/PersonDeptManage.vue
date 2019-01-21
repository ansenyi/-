<template>
  <assign :leftTitle="leftTitle" :rightTitle="rightTitle" :initPost="initPost" :leftPre="leftPre" :rightPre="rightPre" :queryLeft="queryLeft" :queryRight="queryRight"
                        :childrenPost="childrenPost" :leftMsg="leftMsg" :theLeftMsg="theLeftMsg" :rightMsg="rightMsg" :savePost="savePost" @alertMsg="alertMsg">
  </assign>
</template>

<script>
  import Assign from '../Assign.vue'
  export default {
    name: 'person-dept-manage',
    data () {
      return {
        leftTitle: '已有部门',
        rightTitle: '未分配人员',
        initPost: 'orgManagePage',
        leftPre: 'org',
        rightPre: 'user',
        queryLeft: 'queryOrgLike',
        queryRight: 'queryUserLikeNoOrg',
        childrenPost: 'selUserByOrg',
        leftMsg: '请选择要解除分配的人员。',
        theLeftMsg: '请选择部门。',
        rightMsg: '请选择要分配的人员。',
        savePost: 'editUserInOrg'
      }
    },
    created () {
      document.title = '部门管理 — 虹膜门禁管理系统'
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
