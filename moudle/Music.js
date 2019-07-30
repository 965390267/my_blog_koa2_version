const mongoose = require('./index')
/************** 定义登录Schema **************/
const musicSchema = new mongoose.Schema({
    musicpath: String
}, {
    collection: 'musicpath'
})
module.exports=Music= mongoose.model('music', musicSchema)