import mongoose from './index'
/************** 定义登录Schema **************/
const musicSchema = new mongoose.Schema({
    musicpath: String
}, {
    collection: 'musicpath'
})
module.exports={ music: mongoose.model('music', musicSchema)}