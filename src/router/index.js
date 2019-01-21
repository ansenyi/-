import Vue from 'vue'
import Router from 'vue-router'
import Menu from '../components/Menu/Menu.vue'
import Login from '../components/Login.vue'
import DevicePage from '../components/Page/DevicePage.vue'
import PersonPage from '../components/Page/PersonPage.vue'
import RolePage from '../components/Page/RolePage.vue'
import Blog from '../components/BLog.vue'
import DevicePreview from '../components/Device/DevicePreview.vue'
import DeviceAdd from '../components/Device/DeviceAdd.vue'
import DeviceArgument from '../components/Device/DeviceArgument.vue'
import DeviceSetting from '../components/Device/DeviceSetting.vue'
import PersonPreview from '../components/Person/PersonPreview.vue'
import PersonSetting from '../components/Person/PersonSetting.vue'
import PersonDeptEdit from '../components/Person/PersonDeptEdit.vue'
import PersonDeptManage from '../components/Person/PersonDeptManage.vue'
import RolePreview from '../components/Role/RolePreview.vue'
import RoleRightAssign from '../components/Role/RoleRightAssign.vue'
import RoleAssign from '../components/Role/RoleAssign.vue'
import NotFound from '../components/NotFound.vue'
import Message from '../components/Message.vue'
import Upload from '../components/Upload.vue'
import History from '../components/History.vue'
// import AboutIrisian from '../components/AboutIrisian.vue'
import Help from '../components/Help.vue'
import Attendance from '../components/Attendance.vue'
import Password from '../components/Password.vue'

Vue.use(Router)

export default new Router({
  base: '/5200/',
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/device',
      name: 'Device',
      component: DevicePage,
      redirect: '/device/preview',
      children: [
        {
          path: 'preview',
          name: 'DevicePreview',
          component: DevicePreview
        },
        {
          path: 'argument',
          name: 'DeviceArgument',
          component: DeviceArgument
        },
        {
          path: 'setting/:deviceId',
          name: 'DeviceSetting',
          component: DeviceSetting,
          props: true
        },
        {
          path: 'add',
          name: 'DeviceAdd',
          component: DeviceAdd
        }
      ]
    },
    {
      path: '/person',
      name: 'Person',
      component: PersonPage,
      redirect: '/person/preview',
      children: [
        {
          path: 'preview',
          name: 'PersonPreview',
          component: PersonPreview
        },
        {
          path: 'department-edit',
          name: 'PersonDeptEdit',
          component: PersonDeptEdit
        },
        {
          path: 'department-manage',
          name: 'PersonDeptManage',
          component: PersonDeptManage
        },
        {
          path: 'setting/:userId',
          name: 'PersonSetting',
          component: PersonSetting,
          props: true
        }
      ]
    },
    {
      path: '/role',
      name: 'Role',
      component: RolePage,
      redirect: '/role/preview',
      children: [
        {
          path: 'preview',
          name: 'RolePreview',
          component: RolePreview
        },
        {
          path: 'right-assign',
          name: 'RoleRightAssign',
          component: RoleRightAssign
        },
        {
          path: 'assign',
          name: 'RoleAssign',
          component: RoleAssign
        }
      ]
    },
    {
      path: '/log',
      name: 'Blog',
      component: Blog
    },
    {
      path: '/message',
      name: 'Message',
      component: Message
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/history',
      name: 'History',
      component: History
    },
    // {
    //   path: '/about-irisian',
    //   name: 'AboutIrisian',
    //   component: AboutIrisian
    // },
    {
      path: '/help',
      name: 'Help',
      component: Help
    },
    {
      path: '/attendance',
      name: 'Attendance',
      component: Attendance
    },
    {
      path: '/password',
      name: 'Password',
      component: Password
    }
  ]
})
