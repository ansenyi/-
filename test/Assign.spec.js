/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import jest from 'jest-mock'
import { mount, createLocalVue } from 'vue-test-utils'
import Assign from '@/components/Assign.vue'
import RoleAssign from '@/components/Role/RoleAssign.vue'
import RoleRightAssign from '@/components/Role/RoleRightAssign.vue'
import PersonDeptManage from '@/components/person/PersonDeptManage.vue'
import moxios from 'moxios'
import axios from 'axios'
import vueAxios from 'vue-axios'
import './utils/proxy-dataset'

describe('assign', () => {
  const localVue = createLocalVue()
  localVue.use(vueAxios, axios)
  function initAssign (page, routeName, data) {
    const $route = {
      name: routeName,
      params: {
        deviceName: ''
      }
    }
    const cmp = mount(page, {
      localVue,
      mocks: {
        $route
      },
      data: data
    })
    return cmp
  }
  describe('role assign', () => {
    it('mock created', async() => {
      moxios.install()
      moxios.stubRequest('roleUserManagePage', {
        status: 200,
        response: {
          status: true,
          data: [[{userId: 2, userName: 'b'}], [{roleId: 1, roleName: 'a'}]]
        }
      })
      const cmp = initAssign(RoleAssign, 'RoleAssign')
      const assign = cmp.find(Assign)
      await moxios.wait()
      await assign.vm.$nextTick()
      await cmp.vm.$nextTick()
      expect(assign.element).toMatchSnapshot()
      expect(assign.vm.leftList).toHaveLength(1)
      moxios.uninstall()
    })
    it('left click and to unassigned', async() => {
      moxios.install()
      moxios.stubRequest('roleUserManagePage', {
        status: 200,
        response: {
          status: true,
          data: [[{userId: 2, userName: 'b'}], [{roleId: 1, roleName: 'a'}]]
        }
      })
      const cmp = initAssign(RoleAssign, 'RoleAssign')
      const assign = cmp.find(Assign)
      await moxios.wait()
      await assign.vm.$nextTick()
      await cmp.vm.$nextTick()
      assign.vm.actives = ['0']
      assign.find('.left-column').find('.icon-right').trigger('click')
      expect(assign.vm.chosenLeft).toBe('1')
      expect(assign.vm.actives).toHaveLength(0)
      assign.vm.actives = ['0']
      assign.find('.left-column').find('p').trigger('click')
      expect(assign.vm.chosenLeft).toBe('1')
      expect(assign.vm.actives).toHaveLength(0)
      assign.vm.leftList = [{id: 1, name: 'a', children: [{id: 11, name: 'aa'}]}]
      assign.vm.actives = ['0']
      await assign.vm.$nextTick()
      assign.find('.left-column').find('input[type=checkbox]').trigger('click')
      await assign.vm.$nextTick()
      expect(assign.find('.left-column').contains('.chosen-option')).toBeTruthy()
      console.log('left click end')
      moxios.stubRequest('editUserInRole', {
        status: 200,
        response: {
          status: true
        }
      })
      assign.find('.buttons .button').trigger('click')
      await moxios.wait()
      await assign.vm.$nextTick()
      expect(assign.vm.leftList[0].children).toHaveLength(0)
      expect(assign.vm.rightList[1].id).toBe('11')
      console.log('unassigned end')
      moxios.uninstall()
    })
    it('to assigned', async() => {
      moxios.install()
      moxios.stubRequest('roleUserManagePage', {
        status: 200,
        response: {
          status: true,
          data: [[{userId: 2, userName: 'b'}], [{roleId: 1, roleName: 'a'}]]
        }
      })
      const cmp = initAssign(RoleAssign, 'RoleAssign')
      const assign = cmp.find(Assign)
      await moxios.wait()
      await assign.vm.$nextTick()
      await cmp.vm.$nextTick()
      assign.vm.actives = ['0']
      assign.vm.chosenLeft = '1'
      await assign.vm.$nextTick()
      assign.find('.right-column').find('input[type=checkbox]').trigger('click')
      await assign.vm.$nextTick()
      expect(assign.find('.right-column').contains('.chosen-option')).toBeTruthy()
      console.log('right click end')
      moxios.stubRequest('editUserInRole', {
        status: 200,
        response: {
          status: true
        }
      })
      assign.find('.buttons .button:last-of-type').trigger('click')
      await moxios.wait()
      await assign.vm.$nextTick()
      expect(assign.vm.rightList).toHaveLength(0)
      console.log('assigned end')
      moxios.uninstall()
    })
  })
  describe('role right assign', () => {
    it('init', async() => {
      moxios.install()
      moxios.stubRequest('roleDeviceManagePage', {
        status: 200,
        response: {
          status: true,
          data: [[{roleId: 1, roleName: 'a'}], [{deviceId: 2, deviceName: 'b'}]]
        }
      })
      const cmp = initAssign(RoleRightAssign, 'RoleRightAssign')
      const assign = cmp.find(Assign)
      await moxios.wait()
      await assign.vm.$nextTick()
      await cmp.vm.$nextTick()
      expect(cmp.element).toMatchSnapshot()
      moxios.uninstall()
    })
  })
  describe('dept manage', () => {
    it('init', async() => {
      moxios.install()
      moxios.stubRequest('orgManagePage', {
        status: 200,
        response: {
          status: true,
          data: [[{orgId: 1, orgName: 'a'}], [{userId: 2, userName: 'b'}]]
        }
      })
      const cmp = initAssign(PersonDeptManage, 'PersonDeptManage')
      const assign = cmp.find(Assign)
      await moxios.wait()
      await assign.vm.$nextTick()
      await cmp.vm.$nextTick()
      expect(cmp.element).toMatchSnapshot()
      moxios.uninstall()
    })
  })
})
