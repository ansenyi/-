<template>
  <assign :leftTitle="leftTitle" :rightTitle="rightTitle" :initPost="initPost" :leftPre="leftPre" :rightPre="rightPre" :queryLeft="queryLeft" :queryRight="queryRight"
                        :childrenPost="childrenPost" :leftMsg="leftMsg" :theLeftMsg="theLeftMsg" :rightMsg="rightMsg" :savePost="savePost" @alertMsg="alertMsg"></assign>
</template>

<script>
//  import Bus from '../../common/js/Bus'
  import Assign from '../Assign.vue'
  export default {
    name: 'role-right-assign',
    data () {
      return {
        leftTitle: '已有角色',
        rightTitle: '设备列表',
        initPost: '',
        leftPre: 'role',
        rightPre: 'device',
        queryLeft: 'findRoleNoRoot',
        queryRight: 'selDeviceByNameLike',
        childrenPost: 'queryDeviceByRole',
        leftMsg: '请选择要移除的设备。',
        theLeftMsg: '请选择角色。',
        rightMsg: '请选择要添加的设备。',
        savePost: 'editDeviceInRole'
      }
    },
    created () {
      document.title = '权限分配 — 虹膜门禁管理系统'
    },
//    mounted () {
//      if (this.$route.params.deviceName) {
//        Bus.$emit('deviceSearchLike', this.$route.params.deviceName)
//      }
//    },
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
