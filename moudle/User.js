import mongoose from './index'
/************** 定义登录Schema **************/
const loginSchema = new mongoose.Schema({
    username: String,
    password: String,
    time: { type:Date, default:Date.now },
    headimg:String,
    adminname: String,
    visittimes:{ type:Number, default:1 }
}, {
    collection: "login"
})
module.exports=User=mongoose.model('login', loginSchema)