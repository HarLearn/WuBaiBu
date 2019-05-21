//app.js
var Bmob = require('/libs/Bmob-1.7.0.min.js');
Bmob.initialize("aa3a765e2bb9ced304ac5f78851ee987", "2f3a040a15e0b253450938bf18c56fae");
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    // Bomb的一键登录
    Bmob.User.auth().then(res => {
      console.log(res)
      console.log('一键登陆成功')
    }).catch(err => {
      console.log(err)
    });

    this.globalData = {}
  },
  globalData: {
    userInfo:''
  }
})
