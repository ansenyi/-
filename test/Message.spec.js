/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import { mount, createLocalVue } from 'vue-test-utils'
import Message from '@/components/Message.vue'
import moxios from 'moxios'
import axios from 'axios'
// import Vue from 'vue'
import vueAxios from 'vue-axios'
// import vueRouter from 'vue-router'

describe('message', () => {
  const localVue = createLocalVue()
  localVue.use(vueAxios, axios)
  // localVue.use(vueRouter)
  it('init', () => {
    moxios.install()
    const cmp = mount(Message, {
      localVue,
      data: {
        newPersons: [{userId: 1, userName: 'a', employeeId: 11, carNO: 111}, {userId: 2, userName: 'b', employeeId: 22, carNO: 222}],
        noRolePersons: [{userId: 1, userName: 'a', employeeId: 11, carNO: 111}, {userId: 2, userName: 'b', employeeId: 22, carNO: 222}],
        noRoleDevices: [{deviceId: 0, deviceName: 'a'}, {deviceId: 1, deviceName: 'b'}],
        onlineDevices: [{deviceId: 0, deviceName: 'a'}, {deviceId: 1, deviceName: 'b'}],
        outlineDevices: [{devId: 1, userName: 'a', employeeId: 11, carNO: 111}, {userId: 2, userName: 'b', employeeId: 22, carNO: 222}],
        show1: true,
        show2: true,
        show3: true,
        show4: true,
        show5: true
      }
    })
    // cmp.vm.$http = axios
    expect(cmp.element).toMatchSnapshot()
    moxios.uninstall()
  })
})
