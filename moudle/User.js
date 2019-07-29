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
    time: { type: Date, default: Date.now },
    headimg: String,
    adminname: String,
    visittimes: { type: Number, default: 1 }
}, {
        collection: "login"
    })
module.exports = User = mongoose.model('login', loginSchema)