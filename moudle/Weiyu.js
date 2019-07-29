import mongoose from './index'
/************** 定义登录Schema **************/
const weiyuSchema = new mongoose.Schema({
    weiyu: String,
    time: String,
    headimg:String,
    timenumber: Number
}, { collection: 'weiyu' })
module.exports={weiyu: mongoose.model('weiyu', weiyuSchema)}