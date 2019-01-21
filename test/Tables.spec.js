/* eslint-disable no-undef,no-unused-vars */
import 'babel-polyfill'
import jest from 'jest-mock'
import { shallow, mount } from 'vue-test-utils'
import Tables from '@/components/Tables.vue'
import Pagination from '@/components/Pagination.vue'

describe('tables', () => {
  function initDeviceTable () {
    const $route = {
      name: 'DevicePreview'
    }
    const cmp = shallow(Tables, {
      mocks: {
        $route
      },
      propsData: {
        placeholder: '按设备名称搜索',
        theads: [{prop: 'deviceId', title: '设备编号'}, {prop: 'deviceName', title: '设备名称'}, {prop: 'protectLock', title: '防拆开关'}, {prop: 'hardwareVersion', title: '硬件版本号'}, {prop: 'online', title: '连接状态'}, {prop: 'ip', title: '通讯地址'}, {title: '设备管理'}],
        tableData: [[1, 'a', '开', 'v1', '未连接', '123'], [2, 'Untitled', '关', 'v1', '已连接', '456']],
        settingPath: '/device/setting'
      }
    })
    return cmp
  }
  function initPersonTable () {
    const $route = {
      name: 'PersonPreview'
    }
    const cmp = shallow(Tables, {
      mocks: {
        $route
      },
      propsData: {
        placeholder: '按姓名搜索',
        theads: [{prop: 'userName', title: '姓名'}, {prop: 'employeeId', title: '工号'}, {prop: 'carNO', title: '卡号'}, {prop: 'orgEntity[\'orgName\']', title: '部门'}, {prop: 'roleEntity[\'roleName\']', title: '角色'}, {title: '人员信息操作'}],
        tableData: [[1, 'a', 11, 111, '营销部', '未分配'], [2, 'b', 22, 222, '已连接', '456']],
        settingPath: '/person/setting'
      }
    })
    return cmp
  }
  it('props type', () => {
    const cmp = shallow(Tables)
    const placeholder = cmp.vm.$options.props.placeholder
    const theads = cmp.vm.$options.props.theads
    const tableData = cmp.vm.$options.props.tableData
    const settingPath = cmp.vm.$options.props.settingPath
    const totalPages = cmp.vm.$options.props.totalPages
    const curPage = cmp.vm.$options.props.curPage
    expect(placeholder.type).toBe(String)
    expect(theads.type).toBe(Array)
    expect(tableData.type).toBe(Array)
    expect(settingPath.type).toBe(String)
    expect(totalPages.type).toBe(Number)
    expect(curPage.type).toBe(Number)
  })
  it('set device table props', () => {
    const cmp = initDeviceTable()
    expect(cmp.element).toMatchSnapshot()
  })
  it('set person table props', () => {
    const cmp = initPersonTable()
    expect(cmp.element).toMatchSnapshot()
  })
  it('search input', () => {
    const cmp = initDeviceTable()
    cmp.setData({searchText: '159'})
    // cmp.update()
    expect(cmp.vm.searchText).toBe('159')
    expect(cmp.contains('.input-cancel')).toBeTruthy()
    cmp.find('.input-cancel').trigger('click')
    // cmp.update()
    expect(cmp.vm.searchText).toBe('')
  })
  describe('updateData', () => {
    const cmp = initDeviceTable()
    const stub = jest.fn()
    cmp.vm.$on('updateData', stub)
    it('searchLike', () => {
      cmp.find('input[type=text]').trigger('blur')
      cmp.update()
      expect(stub).toBeCalled()
    })
    it('sortClick', () => {
      cmp.find('th a i').trigger('click')
      cmp.update()
      expect(stub).toBeCalled()
    })
    it('remove', () => {
      const stup = jest.fn()
      cmp.vm.$on('removeId', stup)
      cmp.find('.icon-remove').trigger('click')
      cmp.vm.$nextTick(() => {
        expect(stup).toBeCalledWith('1')
      })
      cmp.find('tbody tr').trigger('click')
      cmp.vm.$nextTick(() => {
        expect(stup).not.toBeCalled()
      })
      cmp.find('tbody tr td').trigger('click')
      cmp.vm.$nextTick(() => {
        expect(stup).not.toBeCalled()
      })
      cmp.find('tbody tr td router-link').trigger('click')
      cmp.vm.$nextTick(() => {
        expect(stup).not.toBeCalled()
      })
      cmp.find('tbody tr td span').trigger('click')
      cmp.vm.$nextTick(() => {
        expect(stup).not.toBeCalled()
      })
    })
    describe('pagination component', () => {
      const wrapper = mount(Tables, {
        propsData: {
          totalPages: 5,
          curPage: 1
        }
      })
      const pagination = wrapper.find(Pagination)
      it('next page', () => {
        pagination.find('.next').trigger('click')
        cmp.vm.$nextTick(() => {
          expect(stub).toBeCalledWith('1')
        })
      })
      it('to page 3', () => {
        pagination.find('li:nth-of-type(5)').trigger('click')
        cmp.vm.$nextTick(() => {
          expect(stub).toBeCalledWith('1')
        })
      })
    })
  })
})
