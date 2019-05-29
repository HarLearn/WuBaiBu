//index.js
//获取应用实例
const app = getApp()
// 引入Bomb包
var Bmob = require('../../libs/Bmob-1.7.0.min.js');
// 初始化Bomb
Bmob.initialize("aa3a765e2bb9ced304ac5f78851ee987", "2f3a040a15e0b253450938bf18c56fae");
Page({
  data: {
    angle:1,
    userInfo: {},
  },
  onLoad: function () {
    
  },
  //跳转到主界面home
  goHomePage:function(event){
    console.log('跳转到主界面');
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  // 获取用户信息
  getUserInfo: function(e) {
    console.log('获得用户的基本信息')
    console.log(e)
    app.globalData.userNativeInfo = e.detail.userInfo
    // Bmob.User.upInfo(e.detail.userInfo)  //此处是否用更细用户信息？？？？？？？
    this.setData({
      userInfo: e.detail.userInfo,
    })
  },
})
