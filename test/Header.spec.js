/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import { mount } from 'vue-test-utils'
import Header from '@/components/Header/Header.vue'
import Bus from '@/common/js/Bus'

describe('header', () => {
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

  let localStorage = storageMock()
  it('storage', () => {
    localStorage.setItem('a', 1)
    expect(localStorage.getItem('a')).toBe(1)
  })
  // window.localStorage.getItem = storageMock().getItem
  // window.localStorage.setItem = storageMock().setItem
  function initHeader (routeName) {
    const $route = {
      name: routeName
    }
    const cmp = mount(Header, {
      mocks: {
        $route
      }
    })
    return cmp
  }
  describe('placeholder or menu', () => {
    it('placeholder', () => {
      const cmp = initHeader('Login')
      console.log(cmp.vm.$route.name)
      expect(cmp.contains('#placeholder')).toBeTruthy()
      expect(cmp.contains('#menu')).toBeFalsy()
    })
    it('menu', () => {
      const cmp = initHeader('DevicePreview')
      expect(cmp.contains('#placeholder')).toBeFalsy()
      expect(cmp.contains('#menu')).toBeTruthy()
      expect(cmp.element).toMatchSnapshot()
    })
  })
  it('adminName', () => {
    window.localStorage.setItem('ADMIN_NAME', 'admin')
    const cmp = initHeader('DevicePreview')
    // cmp.update()
    cmp.vm.$nextTick(() => {
      expect(window.localStorage.getItem('ADMIN_NAME')).toBe('admin')
      expect(cmp.vm.adminName).toBe('admin')
      console.log('admin name')
    })
  })
  it('has message', () => {
    const cmp = initHeader('DevicePreview')
    expect(cmp.find('.email').hasStyle('display', 'none')).toBeFalsy()
    Bus.$emit('hasMessage', true)
    // cmp.update()
    // expect(cmp.find('.email-red').hasStyle('display', 'none')).toBeFalsy()
    cmp.vm.$nextTick(() => {
      expect(cmp.find('.email-red').hasStyle('display', 'none')).toBeFalsy()
    })
  })
  it('clear token', () => {
    window.localStorage.setItem('JWT_TOKEN', 'token')
    const cmp = initHeader('DevicePreview')
    cmp.vm.clearToken()
    cmp.vm.$nextTick(() => {
      expect(window.localStorage.getItem('JWT_TOKEN')).toBe(null)
    })
  })
  it('clear name', () => {
    window.localStorage.setItem('ADMIN_NAME', 'admin')
    const cmp = initHeader('DevicePreview')
    cmp.vm.clearName()
    cmp.vm.$nextTick(() => {
      expect(window.localStorage.getItem('ADMIN_NAME')).toBe(null)
      console.log('clear name')
    })
  })
})
