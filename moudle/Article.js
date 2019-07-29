import mongoose from './index'
/************** 定义模式文章Schema **************/
const articleschema = new mongoose.Schema({
    id: Number,
    column:String,
    thumbnail:String,
    picsrc: String,
    title: String,
    author: String,
    time:{ type:Number, default:Date.now },
    article: String,
    tag: String,
    submityearandmonth:{ type:Number, default:201801},
    submittime:{ type:Number, default:Date.now},
    visitnumber: { type:Number, default:1 },
    leavemessage:[{username:String,msg:String,time:{ type:Number, default:Date.now},likenums:{ type:Number, default:1},replay:[{username:String,msg:String,time:{ type:Number, default:Date.now}}]}]

}, {
    collection: "article"
})
module.exports={article: mongoose.model('article', articleschema)}