/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import jest from 'jest-mock'
import { shallow } from 'vue-test-utils'
import Page from '@/components/Page/Page.vue'
import Bus from '@/common/js/Bus'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import vueAxios from 'vue-axios'

describe('page', () => {
  it('alertMsgShow', () => {
    const cmp = shallow(Page)
    cmp.vm.$nextTick(() => {
      expect(cmp.vm.showConfirm).toBe(false)
      expect(cmp.element).toMatchSnapshot()
      Bus.$emit('alertMsgShow', 'show')
      cmp.vm.$nextTick(() => {
        expect(cmp.element).toMatchSnapshot()
      })
    })
  })
  it('alertMsg', () => {
    const cmp = shallow(Page)
    expect(cmp.find('.alert').hasStyle('display', 'none')).toBeTruthy()
    cmp.vm.alertMsg('alert')
    cmp.vm.$nextTick(() => {
      expect(cmp.find('.alert').hasStyle('display', 'none')).toBeFalsy()
      expect(cmp.vm.alertMessage).toBe('alert')
      cmp.find('.alert .confirm-button').trigger('click')
      cmp.vm.$nextTick(() => {
        expect(cmp.vm.showAlert).toBe(false)
      })
    })
  })
  it('confirm hidden', () => {
    const cmb = shallow(Page)
    expect(cmb.find('.show-confirm').hasStyle('display', 'none')).toBeTruthy()
    expect(cmb.find('.mask').hasStyle('display', 'none')).toBeTruthy()
  })
  it('confirm show', async() => {
    let stub = jest.fn()
    const cmp = shallow(Page)
    cmp.vm.confirmMsg('confirm', stub)
    await cmp.vm.$nextTick()
    console.log('after')
    expect(cmp.element).toMatchSnapshot()
    expect(cmp.find('.show-confirm').hasStyle('display', 'none')).toBeFalsy()
    expect(cmp.find('.mask').hasStyle('display', 'none')).toBeFalsy()
  })
  it('confirm button', async() => {
    let stub = jest.fn()
    const cmp = shallow(Page)
    cmp.vm.confirmMsg('confirm', stub)
    await cmp.vm.$nextTick()
    cmp.find('.show-confirm .confirm-left').trigger('click')
    await cmp.vm.$nextTick()
    expect(cmp.element).toMatchSnapshot()
  })
  it('cancel button', async() => {
    let stub = jest.fn()
    const cmp = shallow(Page)
    cmp.vm.confirmMsg('confirm', stub)
    await cmp.vm.$nextTick()
    cmp.find('.show-confirm .cancel-right').trigger('click')
    cmp.vm.$nextTick(() => {
      expect(cmp.vm.showConfirm).toBe(false)
      console.log('end page test')
    })
  })
  describe('select version', () => {
    // beforeEach(() => {
    //   moxios.install()
    // })
    // afterEach(() => {
    //   moxios.uninstall()
    // })
    it('select hidden', () => {
      const cmb = shallow(Page)
      expect(cmb.find('.show-select').hasStyle('display', 'none')).toBeTruthy()
      expect(cmb.find('.mask').hasStyle('display', 'none')).toBeTruthy()
    })
    console.log('select version')
    it('select show', async () => {
      let foo = jest.fn()
      let stub = jest.fn().mockReturnValueOnce(() => foo())
      Vue.use(vueAxios, axios)
      moxios.install()
      const cmp = shallow(Page)
      cmp.vm.selectVersion('1.2', stub())
      await cmp.vm.$nextTick()
      console.log('select show in')
      expect(cmp.find('.show-select').hasStyle('display', 'none')).toBeFalsy()
      expect(cmp.find('.mask').hasStyle('display', 'none')).toBeFalsy()
      // expect(cmp.vm.versionList[0]).toBe('1.2')
      moxios.uninstall()
    })
    it('confirm button', () => {
      let foo = jest.fn()
      let stub = jest.fn().mockReturnValueOnce(() => foo())
      Vue.use(vueAxios, axios)
      moxios.install()
      const cmp = shallow(Page)
      cmp.vm.selectVersion('1.2', stub())
      cmp.vm.versionList.push('1.1')
      cmp.vm.version = '1.1'
      cmp.find('.show-select .confirm-left').trigger('click')
      cmp.vm.$nextTick(() => {
        // expect(stup).toBeCalledWith('1.1')
        expect(stub).toBeCalled()
        // expect(stub).toBeCalledWith('1.1')
        expect(foo).toBeCalled()
        expect(cmp.find('.show-confirm').hasStyle('display', 'none')).toBeTruthy()
        console.log('confirm button')
      })
      moxios.uninstall()
    })
  })
})
