/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import { shallow, createLocalVue } from 'vue-test-utils'
import DeviceArgument from '@/components/Device/DeviceArgument.vue'
import moxios from 'moxios'
import axios from 'axios'
import vueAxios from 'vue-axios'
import Bus from '@/common/js/Bus'

describe('device argument', () => {
  const localVue = createLocalVue()
  localVue.use(vueAxios, axios)
  it('save', async() => {
    moxios.install()
    const cmp = shallow(DeviceArgument, {
      localVue,
      data: {
        wiegand: '1',
        outputType: '1',
        matchType: '2',
        delayTime: '4'
      }
    })
    let stub = jest.fn().mockReturnValueOnce(cmp.vm.receiveCheckedList([['1', '2', '3', '4', '5', '6'], ['a', 'b', 'c', 'd', 'e', 'f']]))
    Bus.$on('getCheckedList', stub)
    cmp.vm.saveAllHandler()
    expect(cmp.vm.redAdd).toBe(true)
    expect(cmp.find('label:last-of-type select').hasClass('red')).toBeTruthy()
    expect(stub).toBeCalled()
    expect(cmp.vm.checkedList).toEqual([['1', '2', '3', '4', '5', '6'], ['a', 'b', 'c', 'd', 'e', 'f']])
    moxios.stubRequest('editMulDevice', {
      status: 200,
      response: {
        status: true,
        msg: 'success',
        data: [
          {'1': 0},
          {'2': 1},
          {'4': 1},
          {'6': 0}
        ]
      }
    })
    cmp.vm.protectLock = '1'
    cmp.vm.saveAllHandler()
    // cmp.find('.button').trigger('click')
    // await cmp.vm.$nextTick()
    await moxios.wait()
    await cmp.vm.$nextTick()
    expect(cmp.vm.msg).toHaveLength(3)
    await cmp.vm.$nextTick()
    expect(cmp.element).toMatchSnapshot()
    moxios.uninstall()
  })
})
