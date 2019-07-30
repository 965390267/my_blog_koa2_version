const mongoose = require('./index')

/************** 定义登录Schema **************/
const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now
    },
    headimg: String,/*头像 */
    adminname: String,
    logintimes: {/* 登录次数 */
        type: Number,
        default: 0
    },
    registertime: {/* 注册时间 */
        type: Date,
        default: Date.now
    }
}, {
    collection: "login"
})
module.exports = User = mongoose.model('login', loginSchema)