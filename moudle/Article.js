const mongoose = require('./index')
/************** 定义模式文章Schema **************/
const articleschema = new mongoose.Schema({
    id: Number,
    column:String,/* @parm {个人,转载} */
    Abbreviation:String,/* @note {列表缩略图} */
    ArticleImg: String,/* @note {文章内图片} */
    title: String,
    author: String,
    time:{ type:Number, default:Date.now },
    article: String,
    tag: String,
    submityearandmonth:{ type:Number, default:201801},
    servertimeStemp:{ type:Date, default:Date.now},
    visitnumber: { type:Number, default:1 },
    leavemessage:[{username:String,msg:String,time:{ type:Number, default:Date.now},likenums:{ type:Number, default:1},replay:[{username:String,msg:String,time:{ type:Number, default:Date.now}}]}]

}, {
    collection: "article"
})
module.exports=Article= mongoose.model('article', articleschema)