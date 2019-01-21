/* eslint-disable no-undef,no-global-assign,no-native-reassign */
import 'babel-polyfill'
import App from '@/App.vue'
import jest from 'jest-mock'
import { shallow } from 'vue-test-utils'
import Bus from '@/common/js/Bus'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import vueAxios from 'vue-axios'

describe('app', () => {
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

  moxios.install()
  moxios.stubRequest('getMessage', {
    status: 200,
    response: {
      status: true,
      data: true
    }
  })
  const $route = {
    name: 'DevicePreview'
  }
  let cmp = shallow(App, {
    mocks: {
      $route,
      setInterval: jest.fn().mockReturnValueOnce(true)
    }
  })
  it('bus on startMessageTimer', () => {
    window.localStorage.setItem('JWT_TOKEN', 'token')
    window.localStorage.JWT_TOKEN = 'token'
    let stub = jest.fn()
    cmp.vm.getMessage = stub
    Bus.$emit('startMessageTimer')
    cmp.vm.$nextTick(() => {
      console.log(cmp.vm.$route.name)
      console.log(window.localStorage.JWT_TOKEN)
      expect(stub).toBeCalled()
      expect(cmp.vm.messageTimer).not.toBeNull()
      Bus.$emit('endMessageTimer')
      cmp.vm.$nextTick(() => {
        expect(cmp.vm.messageTimer).toBeNull()
        console.log('bus on startMessageTimer')
      })
    })
  })
  it('bus emit hasMessage', () => {
    let stub = jest.fn()
    Bus.$on('hasMessage', stub)
    cmp.vm.messageRed = true
    cmp.vm.$nextTick(() => {
      expect(stub).toBeCalledWith(true)
      console.log('bus emit hasMessage')
    })
  })
  moxios.uninstall()
})
