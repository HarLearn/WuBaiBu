// miniprogram/pages/add/add.js
// 此页面还未开发完成，一些安全检测没有增加到里面，好多环节没有优化
Page({
  data: {
    isCodeShow: true,
    isShowTime:false,
    title: '',
    detailIntro: '',
    startTime: new Date().toLocaleString().replace(/:\d{1,2}$/,' '),
    endTime: new Date().toLocaleString().replace(/:\d{1,2}$/,' '),
    startTimeNum: '',
    endTimeNum: '',
    isStartTime:true,
    startPlace: '',
    endPlace: '',
    goodsClassify: '',
    orderName:'',
    orderPhone:'',
    pickUpCode:'',
    orderMoney:'',
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    isPlain:[false,true,true,true],
    orderLongitude:43.9909,
    orderLatitude:125.385,
    orderAddress:'',
  },
  // 需求输入函数
  onTitleBlur:function(event){
    console.log(event)
    this.setData({
      title:event.detail.value,
    })
  },
  // 详细描述
  onDetailIntroBlur:function(event){
    console.log(event)
    this.setData({
      detailIntro:event.detail.value,
    })
  },
  // 开始时间
  onStartTime:function(event){
    console.log(event)
    this.setData({
      isShowTime:true,
      isStartTime:true
    })
  },
  // 结束时间
  onEndTime:function(event){
    console.log(event)
    this.setData({
      isShowTime:true,
      isStartTime:false
    })
  },
  // 弹窗的确认按钮
  onConfirmTime:function(event){
    if(this.data.isStartTime){
      this.setData({
        startTimeNum:event.detail,
        startTime: new Date(event.detail).toLocaleString().replace(/:\d{1,2}$/,' '),
        isShowTime:false
      })
    }else{
      this.setData({
        endTimeNum:event.detail,
        endTime: new Date(event.detail).toLocaleString().replace(/:\d{1,2}$/,' '),
        isShowTime:false
      })
    }
  },
  // 弹窗的取消按钮
  onCancelTime:function(event){
    this.setData({
      isShowTime:false
    })
  },
  // 开始地方
  onStartPlace:function(event){
    console.log(event)
    this.setData({
      startPlace: event.detail.value,
    })
  },
  // 目的地
  onEndPlace:function(event){
    console.log(event)
    this.setData({
      endPlace: event.detail.value,
    })
  },
  //订单所在位置
  onOrderAddress:function(event){
    var that = this
    wx.chooseLocation({
      success(res){
        that.setData({
          orderLongitude:res.longitude,
          orderLatitude:res.latitude,
          orderAddress:res.name,
        })
      },
      fail(event){
        console.log('地址获取失败')
      }
    })
  },
  // 联系人
  onOrderNameBlur:function(event){
    console.log(event)
    this.setData({
      orderName: event.detail.value,
    })
  },
  // 联系人电话
  onOrderPhoneBlur:function(event){
    console.log(event)
    this.setData({
      orderPhone: event.detail.value,
    })
  },
  // 取货码
  onPickUpCodeBlur:function(event){
    console.log(event)
    this.setData({
      pickUpCode: event.detail.value,
    })
  },
  // 佣金
  onOrderMoneyBlur:function(event){
    console.log(event)
    this.setData({
      orderMoney: event.detail.value,
    })
  },
  // 提交并保存
  sumbitOrder:function(event){
    var that = this
    console.log("点击了提交按钮")
    console.log(event)
    console.log('输出所有表单数据')
    console.log(this.data)
    // 设置保存的数据
    var sendData = {
      title: this.data.title,
      detailIntro: this.data.detailIntro,
      startTimeNum: this.data.startTimeNum,
      endTimeNum: this.data.endTimeNUm,
      startPlace: this.data.startPlace,
      endPlace: this.data.endPlace,
      goodsClassify: this.data.goodsClassify,
      orderName:this.data.orderName,
      orderPhone:this.data.orderPhone,
      pickUpCode:this.data.pickUpCode,
      orderMoney:this.data.orderMoney,
    }
    wx.cloud.callFunction({
      name: 'addOrder',
      data: {
        addOrderData:sendData,
        orderLongitude:that.data.orderLongitude,
        orderLatitude:that.data.orderLatitude,
        orderAddress:that.data.orderAddress,
      },
      success: res => {
        wx.showToast({
          title: '发布成功',
        })
        wx.navigateBack({
          delta: 1
        })
        console.log(res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '发布失败',
        })
        console.error('[云函数] [addOrder] 调用失败：', err)
      }
    })
  },
  // 是否显示取货码 并对物品分类
  isShowCode:function(event){
    console.log(event)
    let id = event.currentTarget.id
    if(id == 0){//大件快递
      this.setData({
        isCodeShow:true,
        isPlain:[false,true,true,true],
        goodsClassify:0
      })
    }else if(id == 1){ //小件快递
      this.setData({
        isCodeShow:true,
        isPlain:[true,false,true,true],
        goodsClassify:1
      })
    }else if(id == 2){ //外卖
      this.setData({
        isCodeShow:false,
        isPlain:[true,true,false,true],
        goodsClassify:2
      })
    }else if(id == 3){ //其他
      this.setData({
        isCodeShow:false,
        isPlain:[true,true,true,false],
        goodsClassify:3
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     console.log(res)
    //     console.log('获取地址')
    //     this.data.orderLongitude = res.longitude
    //     this.data.orderLatitude = res.latitude
    //   },
    //   fail(event) {
    //     console.log("获取地址失败")
    //   }
    // })
  },
});