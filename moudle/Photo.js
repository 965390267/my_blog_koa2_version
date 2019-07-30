const mongoose = require('./index')
/************** 定义登录Schema **************/
const photoSchema = new mongoose.Schema({
    imgpath: String
}, {
    collection: 'photolist'
})
module.exports=Photo=mongoose.model('photo', photoSchema)