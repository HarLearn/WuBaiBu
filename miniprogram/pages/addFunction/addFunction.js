// pages/addFunction/addFunction.js

const code = `// 云函数入口函数
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  return {
    sum: event.a + event.b
  }
}`

Page({

  data: {
    result: '',
  },

  onLoad: function (options) {

  },

  copyCode: function() {
    wx.setClipboardData({
      data: code,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  testFunction() {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        a: 1,
        b: 2
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        console.log(res)
        this.setData({
          result: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  // 添加数据
  testLoginFunction() {
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        console.log(res)
        this.setData({
          result: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  // 查询数据
  testSelectFunction() {
    console.log("点击了查询数据")
    wx.cloud.callFunction({
      name: 'selectOrder',
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        console.log(res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  // 修改数据
  testUpdateFunction() {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        console.log(res)
        this.setData({
          result: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  // 删除数据
  testdeleteFunction() {
    wx.cloud.callFunction({
      name: 'deleteOrder',
      data: {
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        console.log(res)
        this.setData({
          result: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },

})

