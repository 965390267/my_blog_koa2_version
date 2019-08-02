const router = require('koa-router')()
const Weiyu = require('../moudle/Weiyu.js')
const uploadOne=require('../utils/upload')

router.prefix('/api');
router.post('/postweiyu',async ctx=> {
    var newweiyu = new Weiyu({
        weiyu:ctx.request.body.weiyu,
        time:ctx.request.body.time,
        headimg:ctx.request.body.headimg,
        timenumber: new Date(ctx.request.body.time).getTime()
    })
    let result=await newweiyu.save();
    if(result){
    ctx.body={code:200,success:true,msg:'微语提交成功',data:result}
    }else{
       
    ctx.body={code:404,success:false,msg:'数据库错误',data:result};
       
    }
})

router.get('/client/getweiyu', async ctx=> { //获取微语的接口
   let result=await Weiyu.find().sort({ timenumber: -1 });
   if(result){
    ctx.body={code:200,success:true,msg:'微语获取成功',data:result};
   }else{
    ctx.body={code:404,success:false,msg:'数据库错误',data:result};
   }
});

router.get('/client/getthreeweiyu', async ctx => { //获取3条微语的接口

    let result=await Weiyu.find().limit(3).sort({ timenumber: -1 })
    if(result){
        ctx.body={code:200,success:true,msg:'微语获取成功',data:result};
       }else{
        ctx.body={code:404,success:false,msg:'数据库错误',data:result};
       }
});

router.post('/deleteweiyu', async ctx => {
    var conditions = { '_id': req.body.weiyuid }
    let result=await Weiyu.remove(conditions)
    if(result){
        ctx.body={code:200,success:true,msg:'微语删除成功',data:result};
       }else{
        ctx.body={code:404,success:false,msg:'数据库错误',data:result};
       }
})


router.post('/weiyuimg',async ctx=> { //微语的标题图片上传
    uploadOne(ctx,'images')
})

module.exports=router;