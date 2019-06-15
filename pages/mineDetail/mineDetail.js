// pages/mineDetail/mineDetail.js

// 获取全局变量
var app = getApp()
// 引入Bomb包
var Bmob = require('../../libs/Bmob-1.7.0.min.js');
// 初始化Bomb
Bmob.initialize("aa3a765e2bb9ced304ac5f78851ee987", "2f3a040a15e0b253450938bf18c56fae");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName:'',
    sex:'',
    birthday:'',
    personalIntro:'',
    userPhone:'',
    email:'',
    userShool:'',
    shoolLatitude:43.99335,
    shoolLongitude:125.39173,
    userAcademy:'',
    userMajor:'',
    isShowSex:false,
    sexList:['男','女'],
    isShowBirthday:false,
    currentDate: new Date().getTime(),
    minDate:new Date(1900,10,1).getTime(),
    isUpdate:false,
    isUserCount:0
  },
  // 确定用户的生日
  onConfirmBirthday:function(event){
    console.log('生日是');
    console.log(event);
    let birth = new Date(event.detail)
    let birthString =  birth.getFullYear()+"/" + (birth.getMonth() + 1) +"/" + birth.getDate()
    console.log(birthString);
    this.setData({
      isShowBirthday:false,
      birthday: birthString,
      isUpdate:true
    })
  },
  // 关闭用户生日选择弹窗
  onCancelBirthday:function(){
    this.setData({
      isShowBirthday:false
    })
  },
  // 确定用户的性别选择
  onConfirmSex:function(event){
    console.log(event);
    this.setData({
      isShowSex:false,
      sex : event.detail.value,
      isUpdate:true
    })
  },
  // 关闭用户性别选择弹窗
  onCancelSex:function(event){
    this.setData({
      isShowSex:false
    })
  },
  //获得用户的专业
  getUserMajor:function(event){
    console.log('获得用户的专业');
    console.log(event.detail.value);
    this.data.userMajor = event.detail.value;
    this.data.isUpdate = true;
  },
  // 获得用户的所在学院
  getUserAcademy:function(event){
    console.log('获得用户的所在学院');
    this.data.userAcademy = event.detail.value;
    this.data.isUpdate = true;
  },
  // 获得用户的所在学校
  getUserShool:function(event){
    var that = this
    console.log('获得用户的所在学校');
    wx.chooseLocation({
      success:function(event){
        console.log("选择地址成功")
        console.log(event);
        that.setData({
          userShool:event.name,
          shoolLatitude:event.latitude,
          shoolLongitude:event.longitude,
          isUpdate:true
        })
      },
      fail:function(res){
        console.log("选择地址失败")
        console.log(res);
        
      }
    })
    this.data.userShool = event.detail.value
  },
  // 获取用户的邮箱
  getEmail:function(event){
    console.log('获取用户的邮箱');
    var re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (re.test(event.detail.value)) {
      console.log("邮箱是合法的");
      this.setData({
        email: event.detail.value,
        isUpdate:true
      })
    } else {
      wx.showToast({
        title: '邮箱输入不合法',
        icon: 'none',
        duration: 2500
      })
    }
  },
  //获得用户的手机号
  getUserPhone:function(event){
    console.log('获得用户的手机号');
    var re = /^1\d{10}$/
    if (re.test(event.detail.value)) {
      console.log("手机号是合法的");
      this.setData({
        userPhone: event.detail.value,
        isUpdate:true
      })
    } else {
      wx.showToast({
        title: '手机号输入不合法',
        icon: 'none',
        duration: 2500
      })
    }
  },
  //获得用户的个人简介
  getPersonalIntro:function(event){
    console.log('获得用户的个人简介');
    this.data.personalIntro = event.detail.value;
    this.data.isUpdate = true;
  },
  //获得用户的生日
  getBirthday:function(event){
    console.log('获得用户的生日');
    this.setData({
      isShowBirthday:true
    })
  },
  //获得用户的性别
  getSex:function(event){
    console.log('获得用户的性别');
    this.setData({
      isShowSex:true
    })
  },
  // 获得用户的真实姓名
  getRealName:function(event){
    console.log('获得用户的真实姓名');
    this.data.realName = event.detail.value;
    this.data.isUpdate = true;
  },
  // 保存用户的数据
  saveMineDetail:function(event){
    var that = this;
    console.log('保存用户的数据');
    console.log(this.data)
    console.log(app.globalData.userInfo.objectId)
    if(this.data.isUpdate){
      console.log("进入保存用户的数据");
      
      // 判断数据是否是
      if(that.data.realName != '' && that.data.userPhone != '' && that.data.email != ''){
        that.data.isUserCount = 3;
      }
      // 修改用户的一条数据
      var pointll = {
        latitude: that.data.shoolLatitude,
        longitude: that.data.shoolLongitude
      }
      const point = Bmob.GeoPoint(pointll) //添加地址
      const query = Bmob.Query('_User');
      query.set('id', app.globalData.userInfo.objectId) //需要修改的objectId
      query.set('realName', that.data.realName)
      query.set('userSex', that.data.sex)
      query.set('userBirthday', that.data.birthday.toString())
      query.set('userPersonalIntro', that.data.personalIntro)
      query.set('userPhone', that.data.userPhone)
      query.set('email', that.data.email)
      query.set('userShool', that.data.userShool)
      query.set('userAcademy', that.data.userAcademy)
      query.set('userMajor', that.data.userMajor)
      query.set('userShoolGeo', point)
      query.save().then(res => {
      console.log(res)
      console.log('更新用户信息完成')
      // 更新全局数据域
      app.globalData.userInfo.realName = that.data.realName;
      app.globalData.userInfo.userSex = that.data.sex;
      app.globalData.userInfo.userBirthday = that.data.birthday.toString();
      app.globalData.userInfo.userPersonalIntro = that.data.personalIntro;
      app.globalData.userInfo.userPhone = that.data.userPhone;
      app.globalData.userInfo.email = that.data.email;
      app.globalData.userInfo.userShool = that.data.userShool;
      app.globalData.userInfo.userAcademy = that.data.userAcademy;
      app.globalData.userInfo.userMajor = that.data.userMajor;
      app.globalData.UserOrder = that.data.isUserCount;
      wx.showToast({
        title: '信息保存成功',
        icon: 'none',
        duration: 2500
      })
      }).catch(err => {
        console.log(err)
        console.log("用户信息更新失败");
        wx.showToast({
          title: '信息保存失败',
          icon: 'none',
          duration: 2500
        })
      })
    }else{
      wx.showToast({
        title: '没有信息进行修改',
        icon: 'none',
        duration: 2500
      })
    }
    
  },
  // 判断json对象中是否含有所需要的属性
  isJsonPar:function(){
    console.log("初始化用户信息");
    // 判断是否含有真实姓名
    if(!app.globalData.userInfo.hasOwnProperty('realName')){
      app.globalData.userInfo.realName = '';
    }
    // 判断是否含有用户性别
    if(!app.globalData.userInfo.hasOwnProperty('userSex')){
      app.globalData.userInfo.userSex = '';
    }
    // 判断是否含有用户的生日
    if(!app.globalData.userInfo.hasOwnProperty('userBirthday')){
      app.globalData.userInfo.userBirthday = '';
    }
    // 判断是否含有用户的个人介绍
    if(!app.globalData.userInfo.hasOwnProperty('userPersonalIntro')){
      app.globalData.userInfo.userPersonalIntro = '';
    }
    // 判断是否含有用户的手机号
    if(!app.globalData.userInfo.hasOwnProperty('userPhone')){
      app.globalData.userInfo.userPhone = '';
    }
    // 判断是否含有用户的邮箱
    if(!app.globalData.userInfo.hasOwnProperty('email')){
      app.globalData.userInfo.email = '';
    }
    // 判断是否含有用户的学校
    if(!app.globalData.userInfo.hasOwnProperty('userShool')){
      app.globalData.userInfo.userShool = '';
    }
    // 判断是否含有用户的学院
    if(!app.globalData.userInfo.hasOwnProperty('userAcademy')){
      app.globalData.userInfo.userAcademy = '';
    }
    // 判断是否含有用户的专业
    if(!app.globalData.userInfo.hasOwnProperty('userMajor')){
      app.globalData.userInfo.userMajor = '';
    }
    this.setData({
      realName:app.globalData.userInfo.realName,
      sex:app.globalData.userInfo.userSex,
      birthday:app.globalData.userInfo.userBirthday,
      personalIntro:app.globalData.userInfo.userPersonalIntro,
      userPhone:app.globalData.userInfo.userPhone,
      email:app.globalData.userInfo.email,
      userShool:app.globalData.userInfo.userShool,
      userAcademy:app.globalData.userInfo.userAcademy,
      userMajor:app.globalData.userInfo.userMajor,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isJsonPar()
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