const mongoose = require('./index')
/************** 定义登录Schema **************/
const weiyuSchema = new mongoose.Schema({
    weiyu: String,
    time:{
        type:Date,
        default:Date.now
    },
    headimg:String,
}, { collection: 'weiyu' })
module.exports=Weiyu= mongoose.model('weiyu', weiyuSchema)