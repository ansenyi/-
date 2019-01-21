/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import jest from 'jest-mock'
import { shallow } from 'vue-test-utils'
import Blog from '@/components/Blog.vue'
import Bus from '@/common/js/Bus'

describe('blog', () => {
  it('endDate watch startDate', () => {
    let cmp = shallow(Blog)
    let day = new Date()
    cmp.vm.endDate.setDate(day.getDate() - 2)
    cmp.update()
    expect(cmp.vm.startDate.getDate()).toBe(day.getDate() - 2)
  })
  it('download', () => {
    let cmp = shallow(Blog)
    let stub = jest.fn()
    let stup = jest.fn()
    Bus.$on('getCheckedList', stub)
    Bus.$on('alertMsgShow', stup)
    cmp.vm.downloadBlog()
    cmp.vm.$nextTick(() => {
      expect(stub).toBeCalled()
      expect(stup).toBeCalledWith('请选择设备。')
      console.log('end blog test')
    })
  })
})
