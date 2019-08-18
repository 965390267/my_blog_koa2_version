const mongoose = require('./index')
const visitSchema = new mongoose.Schema({//访问者客户端信息
    ip: String,
    area:Object,
    time:{
        type:Date,
        default:Date.now
    },
    browerType:String,  
}, { collection: 'visit' })

module.exports=Visit= mongoose.model('visit', visitSchema)