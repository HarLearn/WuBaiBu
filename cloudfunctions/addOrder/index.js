// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'wubaibu'
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('Order').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        // 用户填写的数据
        orederMesage:event.addOrderData,
        // 添加地址
        // location: db.Geo.Point(event.orderLongitude, event.orderLatitude),
        location:{
          type: 'Point',
          coordinates: [event.orderLongitude, event.orderLatitude]
        },
        orderAddressName:event.orderAddress,
        // 订单的发起人和接收人
        belongTo:{
          originator:wxContext.OPENID,
          receiver:'',
        },
        // 是否显示用户发送的数据
        operation:{
          isShow:false,
        }
      }
    })
  } catch (e) {
    console.error(e)
  }

}