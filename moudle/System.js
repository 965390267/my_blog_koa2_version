const mongoose = require('./index')
const adminSchema = new mongoose.Schema({//底部备案信息模型
    recordid: String,
   
}, { collection: 'admin' })

module.exports=Admin= mongoose.model('admin', adminSchema)