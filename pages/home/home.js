//miniprogram/pages/home/home.js
var uInfo = getApp()
// 高德地图
var amapFile = require("../../libs/amap-wx.js");
// 使用Bomb
var Bmob = require('../../libs/Bmob-1.7.0.min.js');
Bmob.initialize("aa3a765e2bb9ced304ac5f78851ee987", "2f3a040a15e0b253450938bf18c56fae");
// 生成二维码
var wxbarcode = require('../../utils/index.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userLocation: '点击选择地址',
    userLatitude:43.817001,
    userLongitude:125.323628,
    showModal: false,
    isShowPop: false,
    height: "80%",
    orderConfigData:[],
    userMoneyIdre:'',
    isShowOrderConfig:false,
    popBlockData:{},
    blockData:[],
    tempBigData:[],
    colorList:['#7232dd','#FF6666','#FF9966','#336699','#99CCFF'],
    isPlain:[false,true,true,true,true],
    isShowQR:false,
    isHasOrderData:true,
  },
  // 用户选择自己所在的位置
  onUserAddress: function (event) {
    var that = this
    wx.chooseLocation({
      success(res) {
        that.setData({
          userLongitude: res.longitude,
          userLatitude: res.latitude,
          userLocation: res.name,
        })
        that.selctData() //查询数据 根据位置刷新数据
      },
      fail(event) {
        console.log('home页面用户地址获取失败')
      }
    })
  },
  // 显示自己的二维码
  isShowQR:function(event){
    this.setData({
      isShowQR: true
    })
  },
  //关闭二维码
  cancelShowQR:function(){
    this.setData({
      isShowQR: false
    })
  },
  // 扫描二维码  还未开发完成
  onScanQR:function(event){
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log('扫一扫')
        console.log(res)
        // res.result  //获得的匹配结果
        const query = Bmob.Query("Orders");
        query.equalTo("originator","==", uInfo.globalData.userInfo.objectId);
        query.equalTo("receiver","==", res.result);
        query.equalTo("isComplete","==", false);
        query.find().then(orderres => {
          console.log('扫码的数据');
          console.log(orderres)
          const userQuery = Bmob.Query("_User");
          userQuery.equalTo("objectId","==", res.result);
          userQuery.find().then(userRes => {
            console.log('接收者的数据');
            console.log(userRes)
            that.setData({
              orderConfigData:orderres,
              userMoneyIdre:userRes[0].userMoneyId.objectId,
              isShowOrderConfig:true
            })
          });
        });
      }
    })
  },
  //取消订单确认提示框的显示
  cancelConfigOrder:function(event){
    this.setData({
      isShowOrderConfig:false
    })
  },
  //确定订单已经收到  还未进行开发
  onClickOrder:function(event){
    var that = this
    console.log(event);
    // event.id 对应订单的id
    
    // 保存修改的数据  标志着订单已经完成结束
    const query = Bmob.Query('Orders');
    query.set('id', event.target.id) //需要修改的objectId
    query.set('isComplete', true)
    query.set('orderState', '订单完成')
    query.save().then(res => {
      console.log('订单完成  成功');
      console.log(res)
      
      let orderData = that.data.orderConfigData;
      console.log(orderData)
      console.log(event.target.dataset.orderid)
      orderData[event.target.dataset.orderid].isComplete = true;
      that.setData({
        orderConfigData:orderData
      })
      var userCreditCha= parseInt(uInfo.globalData.userMoneyId.userCredit) + 1
      uInfo.globalData.userMoneyId.userCredit = userCreditCha
      const queryMon = Bmob.Query('Money');
      queryMon.set('id', uInfo.globalData.userMoneyId.objectId) //需要修改的objectId
      queryMon.set('userCredit', userCreditCha.toString())
      queryMon.save().then(resMon => {
        console.log(resMon)
        const query = Bmob.Query('Money');
        query.get(that.data.userMoneyIdre).then(resReData => {
          // 查询接收者佣金信息
          console.log(resReData)
          let userRECreditCha= parseInt(resReData.userCredit) + 1
          let userREMoney = parseInt(resReData.userMoney) + parseInt(that.data.orderConfigData[ event.target.dataset.orderid].orderMoney)
          const queryReMon = Bmob.Query('Money');
          queryReMon.set('id', that.data.userMoneyIdre) //需要修改的objectId
          queryReMon.set('userMoney', userREMoney.toString())
          queryReMon.set('userCredit', userRECreditCha.toString())
          queryReMon.save().then(resReMon => {
            console.log(resReMon)
            wx.showToast({
              title: '订单完成',
              icon: 'none',
              duration: 1500,
              mask:true
            })
          }).catch(errReMon => {
          console.log(errReMon)
          })
        }).catch(err => {
          console.log(err)
        })
        
      }).catch(errMon => {
      console.log(errMon)
      })

    }).catch(err => {
      console.log('订单完成 失败');
      console.log(err)
      wx.showToast({
        title: '确认订单失败',
        icon: 'none',
        duration: 1500,
        mask:true
      })
    })
  },
  // 跳转到添加页面
  add: function () {
    wx.navigateTo({
      url: '../add/add'
    })
  },
  // 标记的点击事件
  isShowCode: function (event) {
    var that = this
    console.log(event)
    //根据对应 id 展示数据
    this.filterData(event.currentTarget.id)
  },
  // 块显示细节
  showDetail: function (event) {
    var that = this
    console.log(event)
    console.log(event.currentTarget.id)
    console.log(that.data.blockData[event.currentTarget.id])
    let myStartTimeNum = new Date(that.data.blockData[event.currentTarget.id].startTimeNum);
    var StartTimeNum = myStartTimeNum.getFullYear()+"/" + (myStartTimeNum.getMonth() + 1) +"/" + myStartTimeNum.getDate() + " " + myStartTimeNum.getHours()+":"+myStartTimeNum.getMinutes();
    let myEndTimeNum = new Date(that.data.blockData[event.currentTarget.id].startTimeNum);
    var EndTimeNum = myEndTimeNum.getFullYear()+"/" + (myEndTimeNum.getMonth() + 1) +"/" + myEndTimeNum.getDate() + " " + myEndTimeNum.getHours()+":"+myEndTimeNum.getMinutes();
    // 详细显示数据
    var popData = {
      title:that.data.blockData[event.currentTarget.id].title,
      detailIntro:that.data.blockData[event.currentTarget.id].detailIntro,
      startTime:StartTimeNum,
      endTime:EndTimeNum,
      startSpace:that.data.blockData[event.currentTarget.id].startPlace,
      endSpace:that.data.blockData[event.currentTarget.id].endPlace,
      onMoney:that.data.blockData[event.currentTarget.id].orderMoney,
      isAccept:that.data.blockData[event.currentTarget.id].isAccept,
      orderName:that.data.blockData[event.currentTarget.id].orderName,
      orderPhone:that.data.blockData[event.currentTarget.id].orderPhone,
      pickUpCode:that.data.blockData[event.currentTarget.id].pickUpCode,
      orderId:that.data.blockData[event.currentTarget.id].objectId
    }
    console.log("输出数据是：")
    console.log(popData)
    this.setData({
      isShowPop: true,
      popBlockData:popData
    })
  },
  // 弹窗的取消
  cancel: function () {
    this.setData({
      isShowPop: false
    })
  },
  // 弹窗的确定按钮  同意接单
  confirm: function () {
    var that = this
    // 创建 pointer 对象
    const pointer = Bmob.Pointer('_User')
    const poiID = pointer.set(uInfo.globalData.userInfo.objectId)
    // 对数据库进行修改  用户已经接单
    const query = Bmob.Query('Orders');
    query.set('id', that.data.popBlockData.orderId) //需要修改的objectId
    query.set('receiver', poiID)
    query.set('isAccept', true)
    query.set('isShow', false)
    query.set("orderState",'正在派送中..')
    query.save().then(res => {
      console.log('修改成功');
      let testBlock = that.data.popBlockData;
      testBlock.isAccept = true;
      that.setData({
        popBlockData: testBlock
      })
      console.log(res)
      wx.showToast({
        title: '接单成功',
        icon: 'success',
        duration: 1500,
        mask:true
      })
      that.selctData()
    }).catch(err => {
      console.log("修改失败");
      console.log(err)
      wx.showToast({
        title: '接单失败',
        icon: 'success',
        duration: 1500,
        mask:true
      })
    
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({key:'b6165534b48491562883834b4c4fdbf4'});
    myAmapFun.getRegeo({
      success: function(data){
        //成功回调
        console.log('高德地图标志');
        console.log(data);
        //获取用户的当前位置
        that.setData({
          userLocation:data[0].desc,
          userLatitude:data[0].latitude,
          userLongitude:data[0].longitude
        })
        that.selctData() //查询数据
      },
      fail: function(info){
        //失败回调
        console.log('高德地图获取位置失败')
        console.log(info)
      }
    })
    // 生成二维码
    console.log('生成二维码');
    wxbarcode.qrcode('qrcode', uInfo.globalData.userInfo.objectId, 420, 420);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 查询数据 把所有数据存入临时数据集(tempBigData)
    // this.selctData()
  },
  // 查询数据库中的数据
  selctData:function(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that = this
    // 根据自己当前的位置 创建位置点
    const point = Bmob.GeoPoint({ latitude: that.data.userLatitude,longitude: that.data.userLongitude })
    // 使用Bomb的条件查询
    const query = Bmob.Query("Orders");
    query.equalTo("isShow","==", true);  //是否已经审核通过   排除没有通过审核的
    query.equalTo("endTimeNum",">",new Date().getTime()) //排除过期的订单
    query.equalTo("originator","!=",uInfo.globalData.userInfo.objectId) //排除自己发布的订单
    query.withinKilometers("addressPoint", point, 2);  //10指的是公里  查询离自己范围内的订单
    query.find().then(res => {
      console.log("查询数据")
      console.log(res)
      that.setData({
        tempBigData:res,
        blockData:res
      })
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    });
    wx.hideLoading()
  },
  // 在数据中查询符合条件的数据用于展示
  filterData:function(id){
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    console.log('进行数据筛选');
    if(id == '0'){
      console.log("展示所有数据");
      // 把所有数据展示出来
      that.setData({
        blockData:that.data.tempBigData,
        isPlain:[false,true,true,true,true]
      })
      console.log('数据设置完成');
      
    }else{
      console.log("展示的数据条件是",id)
      let tempData = [];
      let plainData = [];
      let j = 0;
      for(let i = 0; i < that.data.tempBigData.length;i++){//筛选符合条件的数据
        if(that.data.tempBigData[i].goodsClassify == id){
          tempData[j] = that.data.tempBigData[i];
          j++;
        }
      }
      for(let pi = 0;pi <= 4; pi++){
        if(pi == id){
          plainData[pi] = false;
          console.log("id是",id);
        }else{
          plainData[pi] = true;
        }
      }
      // 对符合条件的数据进行展示
      that.setData({
        blockData:tempData,
        isPlain:plainData
      })
    }
    wx.hideLoading()
  },
  // 判读数据是否为空
  isHasOrderData:function(event){
    console.log("判断数据是否为空")
    console.log(event);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 展示所有数据
    // this.filterData('0') //不知道为啥不行
    
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
    this.selctData();
    wx.stopPullDownRefresh()
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
