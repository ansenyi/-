/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import { mount, createLocalVue } from 'vue-test-utils'
import DeviceSetting from '@/components/Device/DeviceSetting.vue'
import moxios from 'moxios'
import axios from 'axios'
import vueAxios from 'vue-axios'

describe('device setting', () => {
  const localVue = createLocalVue()
  localVue.use(vueAxios, axios)
  it('init and controlCallBack', async() => {
    moxios.install()
    moxios.stubRequest('getDevice', {
      status: 200,
      response: {
        status: true,
        data: {
          deviceName: 'device',
          wiegand: 1,
          outputType: 2,
          matchType: 2,
          delayTime: 4,
          protectLock: 0,
          outputMsg: '',
          softwareVersion: '2.0',
          privilege: 1
        }
      }
    })
    const cmp = mount(DeviceSetting, {
      localVue,
      propsData: {
        deviceId: 'a'
      }
    })
    await cmp.vm.$nextTick()
    await moxios.wait()
    expect(cmp.element).toMatchSnapshot()
    moxios.stubRequest('terminalController', {
      status: 200,
      response: {
        status: true,
        data: [
          {'a': 0}
        ]
      }
    })
    cmp.vm.controlCallBack('强制升级', 3, '1.1')()
    await moxios.wait()
    await cmp.vm.$nextTick()
    expect(cmp.vm.softwareVersion = '1.1')
    expect(cmp.vm.msg[0]).toEqual({detail: '版本回退：1.1', status: '成功'})
    console.log('end controlCallBack')
    moxios.uninstall()
  })
  it('save', async() => {
    moxios.install()
    moxios.stubRequest('getDevice', {
      status: 200,
      response: {
        status: true,
        data: {
          deviceName: 'device',
          wiegand: 1,
          outputType: 2,
          matchType: 2,
          delayTime: 4,
          protectLock: 0,
          outputMsg: '',
          softwareVersion: '2.0',
          privilege: 1
        }
      }
    })
    const cmp = mount(DeviceSetting, {
      localVue,
      propsData: {
        deviceId: 'a'
      }
    })
    await cmp.vm.$nextTick()
    await moxios.wait()
    cmp.vm.deviceName = 'device1'
    cmp.vm.wiegand = '0'
    cmp.vm.outputType = '0'
    cmp.vm.saveEditHandler()
    // cmp.find('.save-back-button').find('.button').trigger('click')
    expect(cmp.find('label[for=out]').find('input:last-of-type').hasClass('red')).toBeTruthy()
    moxios.stubRequest('editDevice', {
      status: 200,
      response: {
        status: true,
        data: [
          {'a': 0}
        ]
      }
    })
    cmp.vm.output = 'msg'
    cmp.vm.protectLock = '1'
    cmp.vm.saveEditHandler()
    // cmp.find('.save-back-button').find('.button').trigger('click')
    await moxios.wait()
    await cmp.vm.$nextTick()
    // expect(cmp.vm.redAdd).toBe(false)
    expect(cmp.vm.initial.deviceName).toBe('device1')
    console.log('end save')
  })
})
