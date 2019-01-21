/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import { shallow } from 'vue-test-utils'
import Login from '@/components/Login.vue'
import moxios from 'moxios'
import Vue from 'vue'
import axios from 'axios'
import vueAxios from 'vue-axios'
import jest from 'jest-mock'

describe('login', () => {
  Vue.use(vueAxios, axios)
  function storageMock () {
    let storage = {}
    return {
      setItem: function (key, value) {
        storage[key] = value || ''
      },
      getItem: function (key) {
        return key in storage ? storage[key] : null
      },
      removeItem: function (key) {
        delete storage[key]
      },
      get length () {
        return Object.keys(storage).length
      },
      key: function (i) {
        let keys = Object.keys(storage)
        return keys[i] || null
      }
    }
  }
  // noinspection JSAnnotator
  window.localStorage = storageMock()
  function initLogin () {
    const $router = {
      replace: jest.fn()
    }
    const wrapper = shallow(Login, {
      mocks: {
        $router
      }
    })
    return wrapper
  }
  it('token', async() => {
    const cmp = initLogin()
    cmp.vm.saveToken('token')
    await cmp.vm.$nextTick()
    expect(window.localStorage.getItem('JWT_TOKEN')).toBe('token')
  })
  it('login method', async() => {
    moxios.install()
    const cmp = initLogin()
    // cmp.vm.$http = axios
    cmp.vm.adminName = 'admin'
    cmp.vm.password = 'admin'
    moxios.stubRequest('login', {
      status: 200,
      headers: {
        'Authorization': 'token'
      },
      response: {
        status: true
      }
    })
    cmp.find('.confirm-button').trigger('click')
    console.log('click')
    await cmp.vm.$nextTick()
    await moxios.wait()
    expect(window.localStorage.getItem('JWT_TOKEN')).toBe('token')
    expect(window.localStorage.getItem('ADMIN_NAME')).toBe('admin')
    console.log('login')
    moxios.uninstall()
  })
})
