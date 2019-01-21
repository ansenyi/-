/* eslint-disable no-undef */
// import moxios from 'moxios'
// import Vue from 'vue'
// import axios from 'axios'
// import vueAxios from 'vue-axios'
import jest from 'jest-mock'
import 'babel-polyfill'
import { mount } from 'vue-test-utils'
import DeviceList from '@/components/DeviceList.vue'

describe('device list', () => {
  function initComponent () {
    let $http = {
      post: jest.fn().mockReturnValueOnce({then: jest.fn().mockReturnValueOnce({catch: jest.fn()})})
    }
    let cmp = mount(DeviceList, {
      mocks: {
        $http
      },
      data: ({
        deviceList: [{id: '1', name: 'a'}, {id: '2', name: 'b'}],
        deviceLikeList: ['1', '2']
      })
    })
    return cmp
  }
  it('init list', () => {
    let cmp = initComponent()
    expect(cmp.element).toMatchSnapshot()
    expect(cmp.isVueInstance()).toBe(true)
    expect(cmp.findAll('li')).toHaveLength(2)
    expect(cmp.find('li label').text()).toBe('a')
    expect(cmp.contains('li input[type=checkbox]')).toBe(true)
  })
  it('chosen device list', () => {
    let cmp = initComponent()
    cmp.find('li input[type=checkbox]').trigger('click')
    console.log('chosen device list before')
    console.log('after await')
    // expect(cmp.vm.chosenDeviceList).toEqual([{id: '1', name: 'a'}])
    cmp.vm.$nextTick(() => {
      expect(cmp.element).toMatchSnapshot()
      console.log('chosen device list')
    })
    // expect(cmp.contains('.chosen-option')).toBe(true)
    // expect(cmp.find('.chosen-option').text()).toBe('a')
    // expect(cmp.contains('.chosen-cancel')).toBe(true)
  })
  it('deviceClick', () => {
    let cmp = initComponent()
    let stub = jest.fn()
    cmp.setMethods({deviceClick: stub})
    let checkbox = cmp.find('li input[type=checkbox]')
    checkbox.trigger('click')
    expect(cmp.vm.deviceClick).toBeCalled()
  })
  it('choose', () => {
    let cmp = initComponent()
    let checkbox = cmp.find('li input[type=checkbox]')
    checkbox.trigger('click')
    // cmp.update()
    cmp.vm.$nextTick(() => {
      console.log('choose')
      expect(cmp.vm.chosenDeviceList).toHaveLength(1)
      expect(checkbox.element.getAttribute('checked')).toBe(true)
    })
  })
  it('search input', () => {
    let cmp = initComponent()
    cmp.find('input[type=text]').trigger('change', {
      searchInput: '123'
    })
    expect(cmp.contains('.input-cancel')).toBe(true)
    cmp.find('.input-cancel').trigger('click')
    cmp.update()
    expect(cmp.find('input[type=text]').text()).toBe('')
  })
  it('select all', () => {
    let cmp = initComponent()
    let selectAll = cmp.find('.box-content p')
    expect(selectAll.text()).toBe('全选')
    selectAll.trigger('click')
    // cmp.update()
    cmp.vm.$nextTick(() => {
      expect(cmp.element).toMatchSnapshot()
      console.log('select all end')
    })
    // await cmp.vm.$nextTick()
    // await cmp.vm.$nextTick()
    // await cmp.vm.$nextTick()
    // expect(cmp.vm.chosenDeviceList).toHaveLength(2)
    // expect(cmp.findAll('.chosen-option')).toHaveLength(2)
    // cmp.vm.$nextTick(() => {
    // })
  })
  it('unselect all', () => {
    let cmp = initComponent()
    let selectAll = cmp.find('.box-content p')
    expect(selectAll.text()).toBe('全选')
    selectAll.trigger('click')
    cmp.vm.$nextTick(() => {
      let unselectAll = cmp.findAll('.box-content p')[1]
      expect(unselectAll.text()).toBe('全不选')
      unselectAll.trigger('click')
      cmp.vm.$nextTick(() => {
        console.log('101')
        expect(cmp.element).toMatchSnapshot()
        expect(cmp.find('.chosen-option')).toBeFalsy()
      })
    })
  })
  it('chosen device list', () => {
    let cmp = initComponent()
    cmp.find('li input[type=checkbox]').trigger('click')
    cmp.vm.$nextTick(() => {
      cmp.find('.chosen-cancel').trigger('click')
      cmp.vm.$nextTick(() => {
        console.log('112')
        expect(cmp.find('chosen-option')).toBeFalsy()
      })
    })
  })
  it('device like list', () => {
    let cmp = initComponent()
    cmp.setData({
      deviceLikeList: [2]
    })
    // cmp.update()
    expect(cmp.find('li:first-of-type').hasStyle('display', 'none')).toBeTruthy()
  })
  it('checkedList()', () => {
    let cmp = initComponent()
    cmp.vm.sendCheckedList = jest.fn()
    console.log('ending deviceList test')
    cmp.find('li input[type=checkbox]').trigger('click')
    cmp.vm.$nextTick(() => {
      expect(cmp.vm.sendCheckedList).toBeCalledWith([['1'], ['a']])
      console.log('end deviceList test')
    })
  })
})
