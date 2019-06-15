//app.js
// 引入Bomb包
var Bmob = require('libs/Bmob-1.7.0.min.js');
// 初始化Bomb
Bmob.initialize("aa3a765e2bb9ced304ac5f78851ee987", "2f3a040a15e0b253450938bf18c56fae");
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 使用Bomb的一键登录
    Bmob.User.auth().then(res => {
      console.log(res)
      console.log('一键登陆成功');
      this.globalData.userInfo = res;
      // 判断用户是否可以进行接单
      let IsUserOrder = 0;
      if(res.hasOwnProperty('realName') && res.realName != ''){
        IsUserOrder++;
      }
      if(res.hasOwnProperty('userPhone') && res.userPhone != ''){
        IsUserOrder++;
      }
      if(res.hasOwnProperty('email') && res.email != ''){
        IsUserOrder++;
      }
      this.globalData.UserOrder = IsUserOrder;
      console.log(IsUserOrder);
      if(!res.hasOwnProperty('userMoneyId') || res.userMoneyId.objectId == ''){
        console.log("创建金钱和信用表")
        const query = Bmob.Query('Money');
        query.set("userCredit","100")
        query.set("userMoney","10")
        query.save().then(resMoney => {
          console.log(resMoney)
          let moneyData = {
            objectId:resMoney.objectId,
            userCredit: '100',
            userMoney:'10'
          }
          that.globalData.userMoneyId = moneyData;
          const pointer = Bmob.Pointer('Money')
          const poiID = pointer.set(resMoney.objectId)
          const userquery = Bmob.Query('_User');
          userquery.set('id', res.objectId) //需要修改的objectId
          userquery.set('userMoneyId', poiID)
          userquery.save().then(resUser => {
          console.log(resUser)
          }).catch(resUser => {
          console.log(resUser)
          })
          
        }).catch(errMoney => {
          console.log(errMoney)
        })
      }else{
        const query = Bmob.Query('Money');
        query.get(res.userMoneyId.objectId).then(res => {
          console.log("Money查询结果");
          console.log(res)
          that.globalData.userMoneyId = res;
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      console.log(err)
    });
    
  },
  globalData: {
    userInfo: null,
    userNativeInfo:null,
    userMoneyId:null,
    UserOrder:0
  }
})