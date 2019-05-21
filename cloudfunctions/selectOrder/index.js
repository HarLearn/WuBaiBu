// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'wubaibu'
})
const _ = db.command
const wxContext = cloud.getWXContext()
// 云函数入口函数
exports.main = async (event, context) =>{
  try{
    console.log('进入云函数')
    return await db.collection('Order').where({
      location: db.Geo.Point(125.39167, 43.99454)
    }).get()
  }catch(e){
    console.log(e)
  }
}