/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import jest from 'jest-mock'
import { mount } from 'vue-test-utils'
import Pagination from '@/components/Pagination.vue'

describe('pagination', () => {
  function initComponent () {
    const wrapper = mount(Pagination, {
      propsData: {
        totalPages: 100,
        current: 5
      }
    })
    return wrapper
  }

  describe('props', () => {
    describe('type and default', () => {
      const totalPages = mount(Pagination).vm.$options.props.totalPages
      const current = mount(Pagination).vm.$options.props.current
      it('type Number', () => {
        expect(totalPages.type).toBe(Number)
        expect(current.type).toBe(Number)
      })
      it('default value', () => {
        expect(totalPages.default).toBe(1)
        expect(current.default).toBe(1)
      })
    })
    describe('set props', () => {
      const wrapper = initComponent()
      it('props value', () => {
        expect(wrapper.vm.totalPages).toBe(100)
        expect(wrapper.vm.current).toBe(5)
      })
    })
  })

  describe('select size emit event', () => {
    it('select change', () => {
      const wrapper = initComponent()
      const stub = jest.fn()
      wrapper.setMethods({selectSize: stub})
      const el = wrapper.find('select').trigger('change')
      expect(stub).toBeCalled()
    })
  })

  describe('watcher curPage', () => {
    let cmp = initComponent()
    let spy = jest.spyOn(console, 'log')
    afterEach(() => {
      spy.mockClear()
    })
    // it('is not called if value is empty (trimmed)', () => {
    //   cmp.setProps({current: ''})
    //   // cmp.setData({curPage: ''})
    //   cmp.vm.$nextTick(() => {
    //     expect(spy).not.toBeCalled()
    //     // next()
    //   })
    // })
    // it('is not called if values are the same', () => {
    //   cmp.setData({curPage: 5})
    //   cmp.vm.$nextTick(() => {
    //     spy.mockClear()
    //     cmp.setData({curPage: 5})
    //     cmp.vm.$nextTick(() => {
    //       spy = jest.spyOn(console, 'log')
    //       expect(spy).not.toBeCalled()
    //       // next()
    //     })
    //   })
    // })
    it('is called with the new value in other cases', () => {
      cmp.setData({curPage: 4})
      cmp.vm.$nextTick(() => {
        expect(spy).toBeCalled()
        // next()
      })
    })
    it('emit toPage', () => {
      const stub = jest.fn()
      cmp.vm.$on('toPage', stub)
      cmp.setData({curPage: 4})
      cmp.vm.$nextTick(() => {
        expect(stub).toBeCalledWith(4)
        // next()
      })
    })
  })

  describe('Simple Cases', () => {
    // false
    it('success', () => {
      const wrapper = initComponent()
      wrapper.update()
      expect(wrapper.element).toMatchSnapshot()
      expect(wrapper.findAll('li')).toHaveLength(11)
      expect(wrapper.find('li:first-of-type').hasClass('prev')).toBeTruthy()
      expect(wrapper.find('li:first-of-type').hasStyle('display', 'none')).toBeFalsy()
      expect(wrapper.find('li:last-of-type').hasStyle('display', 'none')).toBeFalsy()
      expect(wrapper.find('li:nth-of-type(2) span').text()).toBe('1')
      expect(wrapper.find('li:nth-of-type(3) span').text()).toBe('...')
      expect(wrapper.find('li:nth-of-type(3)').hasStyle('display', 'none')).toBeFalsy()
      expect(wrapper.find('li:nth-of-type(4) span').text()).toBe('3')
      expect(wrapper.find('.active').text()).toBe('5')
      expect(wrapper.find('li:nth-of-type(7) span').text()).toBe('6')
      expect(wrapper.find('li:nth-of-type(9) span').text()).toBe('...')
      expect(wrapper.find('li:nth-of-type(10) span').text()).toBe('100')
    })
    it('simulate next and prev button event right', () => {
      const wrapper = initComponent()
      wrapper.setProps({current: 4})
      // wrapper.update()
      expect(wrapper.findAll('li')).toHaveLength(11)
      expect(wrapper.find('.active').text()).toBe('4')
      expect(wrapper.find('li:nth-of-type(4)').text()).toBe('2')
      expect(wrapper.find('li:nth-of-type(8)').text()).toBe('6')
      expect(wrapper.find('li:nth-of-type(9)').text()).toBe('...')
      wrapper.setProps({current: 5})
      expect(wrapper.find('.active').text()).toBe('5')
    })
    it('simulate click page element', () => {
      const wrapper = initComponent()
      wrapper.setProps({current: 3})
      expect(wrapper.vm.prevClipped).toBeFalsy()
    })

    it('set last page 10', () => {
      const cmp = mount(Pagination, {
        propsData: {
          totalPages: 10,
          current: 10
        }
      })
      expect(cmp.find('li:last-of-type').hasStyle('display', 'none')).toBeTruthy()
      // 8
      expect(cmp.find('li:nth-of-type(4)').text()).toBe('8')
      expect(cmp.find('li:nth-of-type(7)').text()).toBe('10')
    })

    it('set totalPages 5', () => {
      const cmp = mount(Pagination, {
        propsData: {
          totalPages: 5,
          current: 1
        }
      })
      expect(cmp.element).toMatchSnapshot()
      expect(cmp.vm.prevClipped).toBeFalsy()
      // true
      // expect(cmp.findAll('.ellipsis')[0].hasStyle('display', 'none')).toBeTruthy()
      // expect(cmp.findAll('.ellipsis')[1].hasStyle('display', 'none')).toBeFalsy()
      expect(cmp.vm.nextClipped).toBeTruthy()
      expect(cmp.find('li:last-of-type').hasStyle('display', 'none')).toBeFalsy()
      cmp.setProps({current: 2})
      cmp.update()
      expect(cmp.vm.prevClipped).toBeFalsy()
      expect(cmp.vm.nextClipped).toBeFalsy()
      cmp.setProps({current: 3})
      cmp.update()
      expect(cmp.vm.prevClipped).toBeFalsy()
      expect(cmp.vm.nextClipped).toBeFalsy()
      cmp.setProps({current: 4})
      cmp.update()
      expect(cmp.vm.prevClipped).toBeFalsy()
      expect(cmp.vm.nextClipped).toBeFalsy()
      cmp.setProps({current: 5})
      cmp.update()
      expect(cmp.vm.prevClipped).toBeTruthy()
      expect(cmp.vm.nextClipped).toBeFalsy()
      expect(cmp.find('li:first-of-type').hasStyle('display', 'none')).toBeFalsy()
    })

    it('set totalPages 4', () => {
      const cmp = mount(Pagination, {
        propsData: {
          totalPages: 4,
          current: 1
        }
      })
      expect(cmp.vm.prevClipped).toBeFalsy()
      expect(cmp.vm.nextClipped).toBeFalsy()
    })
  })
})
