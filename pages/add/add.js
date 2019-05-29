// miniprogram/pages/add/add.js
/**
 * 此页面还未开发完成，一些安全检测没有增加到里面，好多环节没有优化 如果内容为空时没有进行判断
 */
// 获取全局变量
var uInfo = getApp()
// 引入Bomb包
var Bmob = require('../../libs/Bmob-1.7.0.min.js');
// 初始化Bomb
Bmob.initialize("aa3a765e2bb9ced304ac5f78851ee987", "2f3a040a15e0b253450938bf18c56fae");

Page({
  data: {
    isCodeShow: true,
    isShowTime: false,
    title: '',
    detailIntro: '',
    startTime: '',
    endTime: '',
    startTimeNum: '',
    endTimeNum: '',
    isStartTime: true,
    startPlace: '',
    endPlace: '',
    orderLongitude: 43.9909,
    orderLatitude: 125.385,
    orderAddress: '',
    goodsClassifyName:'小件快递',
    goodsClassify: '2',
    orderName: '',
    orderPhone: '',
    pickUpCode: '',
    orderMoney: '',
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2029, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    isPlain: [false, true, false, true,true],
    isFieldError:[false,false,false,false,false,false,false]
  },
  // 需求输入函数
  onTitleBlur: function (event) {
    console.log(event)
    this.setData({
      title: event.detail.value,
    })
  },
  // 详细描述
  onDetailIntroBlur: function (event) {
    console.log(event)
    this.setData({
      detailIntro: event.detail.value,
    })
  },
  // 开始时间
  onStartTime: function (event) {
    console.log(event)
    this.setData({
      isShowTime: true,
      isStartTime: true
    })
  },
  // 结束时间
  onEndTime: function (event) {
    console.log(event)
    this.setData({
      isShowTime: true,
      isStartTime: false
    })
  },
  // 时间弹窗的确认按钮
  onConfirmTime: function (event) {
    console.log("选择的时间是",event.detail);
    console.log(event);
    let myDate = new Date(event.detail);
    var time = myDate.getFullYear()+"/" + (myDate.getMonth() + 1) +"/" + myDate.getDate() + " " + myDate.getHours()+":"+myDate.getMinutes();
    console.log(time);
    if (this.data.isStartTime) { //开始时间
      this.setData({
        startTimeNum: event.detail,
        startTime: time,
        isShowTime: false,
      })
    } else {
      this.setData({
        endTimeNum: event.detail,
        endTime: time,
        isShowTime: false,
      })
    }
  },
  // 弹窗的取消按钮
  onCancelTime: function (event) {
    this.setData({
      isShowTime: false
    })
  },
  // 开始地方
  onStartPlace: function (event) {
    console.log(event)
    this.setData({
      startPlace: event.detail.value,
    })
  },
  // 目的地
  onEndPlace: function (event) {
    console.log(event)
    this.setData({
      endPlace: event.detail.value,
    })
  },
  //订单所在位置
  onOrderAddress: function (event) {
    var that = this
    wx.chooseLocation({
      success(res) {
        that.setData({
          orderLongitude: res.longitude,
          orderLatitude: res.latitude,
          orderAddress: res.name,
        })
      },
      fail(event) {
        console.log('地址获取失败')
      }
    })
  },
  // 联系人
  onOrderNameBlur: function (event) {
    console.log(event)
    this.setData({
      orderName: event.detail.value,
    })
  },
  // 联系人电话
  onOrderPhoneBlur: function (event) {
    console.log(event)
    // 判断手机号输入是否规范
    var re = /^1\d{10}$/
    if (re.test(event.detail.value)) {
      console.log("手机号是合法的")
      this.setData({
        orderPhone: event.detail.value,
      })
    } else {
      wx.showToast({
        title: '手机号输入不合法',
        icon: 'none',
        duration: 2500
      })
    }
    
  },
  // 取货码
  onPickUpCodeBlur: function (event) {
    console.log(event)
    this.setData({
      pickUpCode: event.detail.value,
    })
  },
  // 佣金
  onOrderMoneyBlur: function (event) {
    console.log(event)
    if(parseInt(event.detail.value) <= parseInt(uInfo.globalData.userMoneyId.userMoney)){
      this.setData({
        orderMoney: parseInt(event.detail.value),
      })
    }else{
      console.log("设置金额超出自己能力范围");
      wx.showToast({
        title: '你的佣金超出自己能力范围了',
        icon: 'none',
        duration: 2500
      })
    }
    
  },
  // 提交并保存
  sumbitOrder: function (event) {
    var that = this
    console.log("点击了提交按钮")
    console.log(event)
    console.log('输出所有表单数据')
    console.log(this.data)
    // 需求  开始时间 结束时间  开始地点 结束地点 联系人  联系人电话 佣金 地址
    if(!this.data.title || !this.data.startTimeNum || !this.data.endTimeNum || !this.data.startPlace || !this.data.endPlace || !this.data.orderName || !this.data.orderPhone || !this.data.orderMoney || !this.data.orderAddress){
      console.log("有未填写的内容");
      wx.showToast({
        title: '带*的都要填写吆',
        icon: 'none',
        duration: 2500
      })
      console.log(this.data);
    }else{
      console.log("所有内容已经填写");
      if(this.data.startTimeNum > this.data.endTimeNum){
        wx.showToast({
          title: '开始时间要小于结束时间幺',
          icon: 'none',
          duration: 2500
        })
      }else{
        //检查内容是否 有违禁内容
        let content  = that.data.title + that.data.detailIntro + that.data.detailIntro + ' ';
        Bmob.checkMsg(content).then(res => {
          console.log(content);
          console.log("内容是否合规");
          console.log(res)
          if(res.hasOwnProperty('msg')){
            // 开始进行存储数据
            let addressDetail = {
              latitude:this.data.orderLatitude,
              longitude:this.data.orderLongitude
            }
            // 创建point联系
            const pointer = Bmob.Pointer('_User')
            const poiID = pointer.set(uInfo.globalData.userInfo.objectId)
            //创建位置节点
            const addressPoint = Bmob.GeoPoint(addressDetail)
        
            const query = Bmob.Query('Orders');
            query.set("title",this.data.title)
            query.set("detailIntro",this.data.detailIntro)
            query.set("startTimeNum",new Date(that.data.startTimeNum).getTime())
            query.set("endTimeNum",new Date(that.data.endTimeNum).getTime())
            query.set("startPlace",this.data.startPlace)
            query.set("endPlace",this.data.endPlace)
            query.set("goodsClassify",this.data.goodsClassify)
            query.set("goodsClassifyName",this.data.goodsClassifyName)
            query.set("orderName",this.data.orderName)
            query.set("orderPhone",this.data.orderPhone)
            query.set("pickUpCode",this.data.pickUpCode)
            query.set("orderMoney",this.data.orderMoney.toString())
            query.set("addressPoint",addressPoint)
            query.set("addressName",this.data.orderAddress)
            query.set("isShow",true)
            query.set("isComplete",false)
            query.set("isAccept",false)
            query.set("orderState",'等待接单')
            query.set("originator",poiID)
            query.save().then(res => {
              console.log('数据添加成功')
              console.log(res)
              var userMoneyCha= parseInt(uInfo.globalData.userMoneyId.userMoney) - parseInt(that.data.orderMoney)
              uInfo.globalData.userMoneyId.userMoney = userMoneyCha
              const queryMon = Bmob.Query('Money');
              queryMon.set('id', uInfo.globalData.userMoneyId.objectId) //需要修改的objectId
              queryMon.set('userMoney', userMoneyCha.toString())
              queryMon.save().then(resMon => {
              console.log(resMon)
                wx.showToast({
                  title: '订单发布成功',
                  icon: 'none',
                  duration: 2500,
                  success:function(event){
                    console.log("订单发布成功提示框成功");
                    // 返回到首页
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }).catch(errMon => {
              console.log(errMon)
              })
              

            }).catch(err => {
              console.log('数据添加失败')
              console.log(err)
              wx.showToast({
                title: '订单发布失败',
                icon: 'none',
                duration: 2500
              })
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
  // 是否显示取货码 并对物品分类  此处写的像屎一样  有时时间进行优化
  isShowCode: function (event) {
    console.log(event)
    let id = event.currentTarget.id
    var plain = []
    var goodClassify = 1
    var isCodedShow = false
    var ClassifyName = ['占位','大件快递','小件快递','外卖','其他']
    for(let i = 1;i<=4;i++){ //设置标签是否被选中
      if(i == id){
        plain[i] = false
        goodClassify = id
        if(id <=2){
          isCodedShow = true
        }
      }else{
        plain[i] = true
      }
    }
    this.setData({
      isCodeShow: isCodedShow,
      isPlain:plain,
      goodsClassify: goodClassify,
      goodsClassifyName: ClassifyName[goodClassify]
    })
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