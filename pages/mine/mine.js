// miniprogram/pages/mine/mine.js
var uInfo = getApp()
// 使用Bomb
var Bmob = require('../../libs/Bmob-1.7.0.min.js');
Bmob.initialize("aa3a765e2bb9ced304ac5f78851ee987", "2f3a040a15e0b253450938bf18c56fae");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    userMoney:0,
    userCredit:0,
    userHead:'',
    acceptOrder:[],
    sendOrder:[],
    tempOrderData:[],
    isHasAccaptOrderData:true,
    isHasSendOrderData:true,
    isShowPop:false,
    popBlockData:[]
  },
  // 弹窗的取消
  cancel:function(){
    this.setData({
      isShowPop:false
    })
  },
  // 显示接收订单的详细信息
  showDetail:function(event){
    console.log("显示接收订单的详细信息");
    console.log(event);
    var that = this;
    let myStartTimeNum = new Date(that.data.acceptOrder[event.currentTarget.id].startTimeNum);
    var StartTimeNum = myStartTimeNum.getFullYear()+"/" + (myStartTimeNum.getMonth() + 1) +"/" + myStartTimeNum.getDate() + " " + myStartTimeNum.getHours()+":"+myStartTimeNum.getMinutes();
    let myEndTimeNum = new Date(that.data.acceptOrder[event.currentTarget.id].startTimeNum);
    var EndTimeNum = myEndTimeNum.getFullYear()+"/" + (myEndTimeNum.getMonth() + 1) +"/" + myEndTimeNum.getDate() + " " + myEndTimeNum.getHours()+":"+myEndTimeNum.getMinutes();

    var tempPopBlockData ={
      title:that.data.acceptOrder[event.currentTarget.id].title,
      detailIntro:that.data.acceptOrder[event.currentTarget.id].detailIntro,
      startTime:StartTimeNum,
      endTime:EndTimeNum,
      startSpace:that.data.acceptOrder[event.currentTarget.id].startPlace,
      endSpace:that.data.acceptOrder[event.currentTarget.id].endPlace,
      onMoney:that.data.acceptOrder[event.currentTarget.id].orderMoney,
      orderName:that.data.acceptOrder[event.currentTarget.id].orderName,
      orderPhone:that.data.acceptOrder[event.currentTarget.id].orderPhone,
      pickUpCode:that.data.acceptOrder[event.currentTarget.id].pickUpCode,
    }
    this.setData({
      popBlockData:tempPopBlockData,
      isShowPop:true
    })
  },
  // 查询数据
  selctMineOrderData:function(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that = this
    // 根据自己当前的位置 创建位置点
    // const point = Bmob.GeoPoint({ latitude: that.data.userLatitude,longitude: that.data.userLongitude })
    // 使用Bomb的条件查询
    const query = Bmob.Query("Orders");
    const queryOriginator = query.equalTo("originator","==",uInfo.globalData.userInfo.objectId); //自己发布的订单
    // query.equalTo("originator","==",uInfo.globalData.userInfo.objectId); //自己发布的订单
    const queryReceiver = query.equalTo("receiver", "==", uInfo.globalData.userInfo.objectId); //自己接收的订单
    // query.equalTo("receiver", "==", uInfo.globalData.userInfo.objectId); //自己接收的订单
    query.or(queryOriginator, queryReceiver); //进行or查询
    query.find().then(res => {
      console.log('mine的查询数据');
      console.log(res)
      that.setData({
        tempOrderData:res
      })
      console.log('进行分类');
      that.classifyOrderData()
    });
    // this.classifyOrderData()
    wx.hideLoading()
  },
  // 对数据进行分类
  classifyOrderData:function(){
    var that = this;
    console.log('对数据分析');
    console.log(that.data.tempOrderData.length);
    var tempAcceptOrder = [];
    var tempSendOrder = [];
    var aId = 0;
    var sId = 0;
    for (let i = 0; i < that.data.tempOrderData.length; i++) {
      console.log('originator');
      console.log(that.data.tempOrderData[i].hasOwnProperty('originator'));
      if(that.data.tempOrderData[i].hasOwnProperty('originator') && (that.data.tempOrderData[i].originator.objectId == uInfo.globalData.userInfo.objectId)){
        console.log("是originator");
        tempSendOrder[sId] = that.data.tempOrderData[i];
        sId++;
      }
      console.log('receiver');
      console.log(that.data.tempOrderData[i].hasOwnProperty('receiver'));
      if (that.data.tempOrderData[i].hasOwnProperty('receiver') && (that.data.tempOrderData[i].receiver.objectId == uInfo.globalData.userInfo.objectId)) {
        console.log('是receiver');
        tempAcceptOrder[aId] = that.data.tempOrderData[i];
        aId++;
      }
    }
    that.setData({
      acceptOrder:tempAcceptOrder,
      sendOrder:tempSendOrder
    });
  },
  //hasOwnProperty() 判断是不是自身属性
  // 显示我的订单
  onMineOrderClick:function(event){
    console.log(event);
    //对数据进行分类
    console.log('对数据进行分析');
    this.classifyOrderData();
  },
  // 跳转到 个人详细页面（mineDetail）
  mineDetail: function () {
    wx.navigateTo({
      url: "../mineDetail/mineDetail"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查询所有用户自己的数据
    this.selctMineOrderData();
    this.setData({
      nickName: uInfo.globalData.userNativeInfo.nickName,
      userHead: uInfo.globalData.userNativeInfo.avatarUrl,
      userMoney:uInfo.globalData.userMoneyId.userMoney,
      userCredit:uInfo.globalData.userMoneyId.userCredit
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 查询所有用户自己的数据
    // this.selctMineOrderData();
    this.setData({
      userMoney:uInfo.globalData.userMoneyId.userMoney,
      userCredit:uInfo.globalData.userMoneyId.userCredit
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that =  this;
    const query = Bmob.Query('Money');
    query.get(uInfo.globalData.userMoneyId.objectId).then(res => {
      console.log("下拉刷新我的页面的佣金和信用")
      console.log(res)
      that.setData({
        userMoney:res.userMoney,
        userCredit:res.userCredit
      })
      wx.stopPullDownRefresh();
    }).catch(err => {
      console.log(err)
    })
    // 刷新用户的数据
    this.selctMineOrderData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})