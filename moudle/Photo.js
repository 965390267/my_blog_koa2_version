import mongoose from './index'
/************** 定义登录Schema **************/
const photoSchema = new mongoose.Schema({
    imgpath: String
}, {
    collection: 'photolist'
})
module.exports={ photo: mongoose.model('photo', photoSchema)}