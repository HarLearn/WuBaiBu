//miniprogram/pages/home/home.js
var amapFile = require("../../libs/amap-wx.js");
var Bmob = require('../../libs/Bmob-1.7.0.min.js');
Bmob.initialize("aa3a765e2bb9ced304ac5f78851ee987", "2f3a040a15e0b253450938bf18c56fae");
Page({
  add:function(){
    wx.navigateTo({
      url: '../add/add'
    })
  },
 
  /**
   * 页面的初始数据
   */
  data: {
    detail:"box-shadow 向框添加一个或多个阴影。该属性是由逗号分隔的阴影列表，每个阴影由 2-4 个长度值、可选的颜色值以及可选的 inset 关键词来规定。省略长度的值是 0",
    userLocation:'长春工业大学',
    showModal: false,
    qx1:false,
    show:false,
    height:"80%",
    activeName: ['1'],
    blockData:[]
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  // 标记点击事件
  tagAll:function(){
    console.log("点击了 所有 标签")
  },
  tagBigGoods:function(){
    console.log("点击了 大件快递 标签")
  },
  tagSmallGoods:function(){
    console.log("点击了 小件快递 标签")
  },
  tagFood:function(){
    console.log("点击了 外卖 标签")
  },
  tagOther:function(){
    console.log("点击了 其他 标签")
  },
  // 块显示细节
  showDetail:function(){
    this.setData({
      show: true
    }) 
  },
  // 弹窗的取消
  cancel:function(){
    this.setData({
      show: false
    }) 
  },
  // 弹窗的确定按钮
  confirm:function(){
    this.setData({
      show: false
    }) 
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
      }
    })
    // var that = this;
    // var myAmapFun = new amapFile.AMapWX({key:'b6165534b48491562883834b4c4fdbf4'});
    // myAmapFun.getRegeo({
    //   success: function(data){
    //     //成功回调
    //     console.log(data)
    //   },
    //   fail: function(info){
    //     //失败回调
    //     console.log(info)
    //   }
    // })
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
 