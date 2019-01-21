/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import { mount, createLocalVue } from 'vue-test-utils'
import PersonSetting from '@/components/Person/PersonSetting.vue'
import moxios from 'moxios'
import axios from 'axios'
import vueAxios from 'vue-axios'
import Bus from '@/common/js/Bus'

describe('person setting', () => {
  const localVue = createLocalVue()
  localVue.use(vueAxios, axios)
  it('init and save', async() => {
    moxios.install()
    moxios.stubRequest('queryRole', {
      status: 200,
      response: {
        status: true,
        data: [{roleId: 1, roleName: 'a'}, {roleId: 2, roleName: 'b'}]
      }
    })
    moxios.stubRequest('selOrgByParentId', {
      status: 200,
      response: {
        status: true,
        data: [{orgId: 1, orgName: 'a', parentId: 1}, {orgId: 2, orgName: 'b', parentId: 2}]
      }
    })
    moxios.stubRequest('getUser', {
      status: 200,
      response: {
        status: true,
        data: {
          userId: 123,
          userName: 'sam',
          employeeId: '1345',
          carNO: '789',
          orgEntity: {
            orgName: 'aa',
            parentId: 1,
            orgId: 1
          },
          roleEntity: {}
        }
      }
    })
    const cmp = mount(PersonSetting, {
      localVue
    })
    await cmp.vm.$nextTick()
    await moxios.wait()
    await moxios.wait()
    await moxios.wait()
    await moxios.wait()
    await cmp.vm.$nextTick()
    expect(cmp.vm.orgId).toBe(1)
    expect(cmp.element).toMatchSnapshot()
    cmp.find('#dept').trigger('change', {
      parentId: '2'
    })
    await cmp.vm.$nextTick()
    await moxios.wait()
    await cmp.vm.$nextTick()
    expect(cmp.vm.orgId).toBe('请选择')
    cmp.vm.orgId = '2'
    cmp.find('.button').trigger('click')
    await cmp.vm.$nextTick()
    expect(cmp.vm.redAdd).toBe(true)
    expect(cmp.find('#role').hasClass('red')).toBeTruthy()
    cmp.vm.roleId = 2
    let stub = jest.fn()
    cmp.vm.$on('alertMsg', stub)
    cmp.vm.redAdd = false
    moxios.stubRequest('editUser', {
      status: 200,
      response: {
        msg: 'success'
      }
    })
    cmp.find('.button').trigger('click')
    await cmp.vm.$nextTick()
    await moxios.wait()
    await cmp.vm.$nextTick()
    expect(cmp.vm.redAdd).toBe(false)
    expect(stub).toBeCalledWith('success')
    moxios.uninstall()
  })
})
