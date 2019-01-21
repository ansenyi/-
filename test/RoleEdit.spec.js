/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import { mount, createLocalVue } from 'vue-test-utils'
import RoleEdit from '@/components/Role/RoleEdit.vue'
import moxios from 'moxios'
import axios from 'axios'
import vueAxios from 'vue-axios'
import './utils/proxy-dataset'

describe('role edit', () => {
  const localVue = createLocalVue()
  localVue.use(vueAxios, axios)
  it('init and new dept and reInit list', async() => {
    moxios.install()
    moxios.stubRequest('queryRole', {
      status: 200,
      response: {
        status: true,
        data: [
          {roleId: 1, roleName: 'a'},
          {roleId: 2, roleName: 'b'}
        ]
      }
    })
    // const $set = (obj, key, value) => {
    //   obj[key] = value
    // }
    const cmp = mount(RoleEdit, {
      localVue
      // $set
    })
    await moxios.wait()
    await cmp.vm.$nextTick()
    await cmp.vm.$nextTick()
    expect(cmp.element).toMatchSnapshot()
    cmp.vm.newRoleName = 'new'
    moxios.stubRequest('addRole', {
      status: 200,
      response: {
        status: true
      }
    })
    cmp.find('.new-role .button').trigger('click')
    // await moxios.wait()
    await moxios.wait()
    // await cmp.vm.$nextTick()
    await moxios.wait()
    await cmp.vm.$nextTick()
    await cmp.vm.$nextTick()
    expect(cmp.vm.newRoleName).toBe('')
    moxios.uninstall()
  })
  it('rename and check name', async() => {
    moxios.install()
    moxios.stubRequest('queryRole', {
      status: 200,
      response: {
        status: true,
        data: [
          {roleId: 1, roleName: 'a'},
          {roleId: 2, roleName: 'b'}
        ]
      }
    })
    // const $set = (obj, key, value) => {
    //   obj[key] = value
    // }
    const cmp = mount(RoleEdit, {
      localVue
      // $set
    })
    await moxios.wait()
    await cmp.vm.$nextTick()
    await cmp.vm.$nextTick()
    moxios.stubRequest('renameRole', {
      status: 200,
      response: {
        status: true
      }
    })
    cmp.find('li p').trigger('click')
    await cmp.vm.$nextTick()
    expect(cmp.find('li p').hasClass('chosen')).toBeTruthy()
    cmp.find('.buttons .button:last-of-type').trigger('click')
    await cmp.vm.$nextTick()
    expect(cmp.find('li p').hasStyle('display', 'none')).toBeTruthy()
    cmp.vm.renameInput = 'new'
    cmp.vm.checkName()
    await moxios.wait()
    await moxios.wait()
    await cmp.vm.$nextTick()
    expect(cmp.vm.renameInput).toBe('')
    expect(cmp.vm.renameRole).toBe('')
  })
  it('delete role', async() => {
    moxios.install()
    moxios.uninstall()
    moxios.stubRequest('queryRole', {
      status: 200,
      response: {
        status: true,
        data: [
          {roleId: 1, roleName: 'a'},
          {roleId: 2, roleName: 'b'}
        ]
      }
    })
    moxios.stubRequest('delRole', {
      status: 200,
      response: {
        status: true
      }
    })
    const cmp = mount(RoleEdit, {
      localVue
      // $set
    })
    await moxios.wait()
    await cmp.vm.$nextTick()
    await cmp.vm.$nextTick()
    cmp.vm.$on('confirmMsg', (msg, callback) => {
      callback()
    })
    cmp.vm.chosenRole = 1
    cmp.find('.buttons .button').trigger('click')
    // await cmp.vm.$nextTick()
    await moxios.wait()
    await moxios.wait()
    console.log('end')
  })
})
