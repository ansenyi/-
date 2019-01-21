import Vue from 'vue'
export const searchLike = function (input, list, likeList, property, path, option) {
  console.log('property的值为：')
  console.log(property)
  input = input.replace(/(^\s*)|(\s*$)/g, '')
  if (input === '') {
    list.forEach((item) => {
      likeList.push(item.id)
    })
    return likeList
  }
  return Vue.axios.post(path, JSON.stringify(option))
    .then((res) => {
      if (res.data.status) {
        likeList = []
        console.log('res.data.data的数据为：')
        console.log(res.data.data)
        res.data.data.forEach((item) => {
          likeList.push(item[property])
        })
        return likeList
      }
    }).catch((err) => {
      console.log(err)
    })
}

export const _debounce = function (fn) {
  console.log('进入到了_debounce函数中')
  let timer = null
  return function (...params) {
    clearTimeout(timer)
    timer = setTimeout(function () {
      console.log('_debounce setTimeout')
      fn.apply(this, params)
    }, 500)
  }
}

export const getBLen = function (str) {
  if (JSON.stringify(str) === '{}') {
    return 0
  }
  if (typeof str !== 'string') {
    str += ''
  }
  return str.replace(/[^\x00-\xff]/g, 'ab').length
}
