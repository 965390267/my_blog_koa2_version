const mongoose = require('./index')
/************** 定义登录Schema **************/
const weiyuSchema = new mongoose.Schema({
    weiyu: String,
    time: String,
    headimg:String,
    timenumber: Number
}, { collection: 'weiyu' })
module.exports=Weiyu= mongoose.model('weiyu', weiyuSchema)