/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import { mount, createLocalVue } from 'vue-test-utils'
import PersonDeptEdit from '@/components/Person/PersonDeptEdit.vue'
import moxios from 'moxios'
import axios from 'axios'
import vueAxios from 'vue-axios'
import './utils/proxy-dataset'

describe('person dept edit', () => {
  const localVue = createLocalVue()
  localVue.use(vueAxios, axios)
  it('init and new dept and reInit list', async() => {
    moxios.install()
    moxios.stubRequest('selOrgByParentId', {
      status: 200,
      response: {
        status: true,
        data: [
          {level: 1, orgId: 1, orgName: 'a'},
          {level: 1, orgId: 2, orgName: 'b'},
          {level: 1, orgId: 3, orgName: 'c'}
        ]
      }
    })
    // const $set = (obj, key, value) => {
    //   obj[key] = value
    // }
    const cmp = mount(PersonDeptEdit, {
      localVue
      // $set
    })
    await moxios.wait()
    await cmp.vm.$nextTick()
    await cmp.vm.$nextTick()
    expect(cmp.element).toMatchSnapshot()
    cmp.vm.newDeptName = 'new'
    moxios.stubRequest('addOrg', {
      status: 200,
      response: {
        status: true
      }
    })
    cmp.vm.actives = ['2']
    cmp.vm.chosenDept = {
      level: 1,
      orgId: 2
    }
    cmp.find('.new-dept .button').trigger('click')
    await moxios.wait()
    await moxios.wait()
    await cmp.vm.$nextTick()
    await moxios.wait()
    await cmp.vm.$nextTick()
    await cmp.vm.$nextTick()
    expect(cmp.element).toMatchSnapshot()
    moxios.uninstall()
  })
  it('choose dept', async() => {
    moxios.install()
    moxios.stubRequest('selOrgByParentId', {
      status: 200,
      response: {
        status: true,
        data: [
          {level: 1, orgId: 1, orgName: 'a'},
          {level: 1, orgId: 2, orgName: 'b'},
          {level: 1, orgId: 3, orgName: 'c'}
        ]
      }
    })
    // const $set = (obj, key, value) => {
    //   obj[key] = value
    // }
    const cmp = mount(PersonDeptEdit, {
      localVue
      // $set
    })
    await moxios.wait()
    await cmp.vm.$nextTick()
    await cmp.vm.$nextTick()
    cmp.find('.icon-right').trigger('click')
    await cmp.vm.$nextTick()
    await cmp.vm.$nextTick()
    await moxios.wait()
    await cmp.vm.$nextTick()
    expect(cmp.vm.chosenDept).toEqual({orgId: '1', level: '1'})
    expect(cmp.vm.actives).toEqual(['1'])
    console.log(cmp.vm.deptList)
  })
})
