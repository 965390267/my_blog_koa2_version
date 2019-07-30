const router = require('koa-router')()
// const Music=require('../moudle/Music.js')
const uploadOne=require('../utils/upload')
const Article = require('../moudle/Article.js')


router.prefix('/api');
router.post('/articleimg', async (ctx, next) => {
    uploadOne(ctx,'articleimg')
})

router.post('/viewarticlenums', async ctx => {//文章观看次数提交获取窗口
    let getid=ctx.request.body.artid;
    let result= await Article.findById(getid)
    if(result){
        let visitnums=result.visitnumber;
        visitnums++;
        let update= await Article.findByIdAndUpdate(getid, {visitnumber:visitnums})
        if(update){
           ctx.body={ code: 200, success: true, msg: '观看次数提交成功',data:update };
        }else{
            ctx.body={code:404,success:false,msg:'获取文章查看次数失败',data:update}; 
        }
    }else{
        ctx.body={code:404,success:false,msg:'获取文章查看次数失败',data:result}; 
    }
})

router.post('/getarticle', async ctx=> { //获取文章的接口             
    let pageSize =ctx.request.body.pageSize; //一页多少条
    let currentPage = ctx.request.body.currentPage;  //当前第几页
    let skipnum = (currentPage - 1) * pageSize;   //跳过数
  
    let result= await Article.find().skip(skipnum).limit(pageSize).sort({ submittime: -1 })
    if(result){
        let countResult= await Article.count()
        if(countResult){
            ctx.body={code:200,success:true,msg:'获取文章成功信息',count:countResult, data:result}
        }else{
           ctx.body={code:404,success:false,msg:'获取文章数量失败',data:result};         
        }
    }else{
            ctx.body={code:404,success:false,msg:'获取文章失败信息',data:result};      
    }
})

router.get('/getarticlemostnew', async ctx => { //获取最新6篇文章的接口
  
    let result= await Article.find().limit(6).sort({ submittime: -1 })
    if(result){
       ctx.body={code:200,success:true,msg:'获取最新文章成功信息',data:result}
    }else{
        ctx.body={code:404,success:false,msg:'获取最新文章失败信息',data:result};    
    }
})

router.get('/getarticlemosthot', async ctx => { //获取最热，观看次数最多的6篇文章的接口
    let result= await Article.find().limit(6).sort({ visitnumber: -1 })
    if(result){
       ctx.body={code:200,success:true,msg:'获取最热文章成功信息',data:result}
    }else{
        ctx.body={code:404,success:false,msg:'获取最热文章失败信息',data:result};    
    }
})


router.post('/getarticlenext', async ctx=> { //获取下一篇文章的接口
    let currenttime = ctx.request.body.time;
    let result= await Article.find({time: { $lt: currenttime } }).limit(1).sort({ time: -1 })
    if(result){
        ctx.body={code: 200, success: true, msg: '获取下一篇文章成功信息', data: result };
    }else{
     ctx.body={  code: 404, success: false, msg: '获取下一篇文章失败信息',data: result  };
    }
})

router.post('/getarticlelast', async ctx=> { //获取上一篇文章的接口
    let currenttime = ctx.request.body.time;
    let result= await Article.find({time: { $gt: currenttime } }).limit(1).sort({ time:1 })
    if(result){
        ctx.body={code: 200, success: true, msg: '获取上一篇文章成功信息', data: result };
    }else{
     ctx.body={  code: 404, success: false, msg: '获取上一篇文章失败信息',data: result  };
    }
})


router.get('/getarticlenums', async ctx=> { //获取文章的总篇数接口
    let countResult= await Article.count()
    if(countResult){
        ctx.body={code:200,success:true,msg:'获取文章成功信息', data:countResult}
    }else{
       ctx.body={code:404,success:false,msg:'获取文章数量失败',data:countResult};         
    }
})

router.post('/getarticlebyid',async ctx=> { //通过ID获取文章的接口
    let id=ctx.request.body.id; 
    let result= await Article.findById(id);
    if(result){
        ctx.body={code:200,success:true,msg:'获取文章成功信息', data:result}
    }else{
        ctx.body={code:404,success:false,msg:'获取文章失败信息',data:result}; 
    }
})

router.get('/getarticlefile',async ctx => { //获取文章存档的接口,采用MongoDB的聚合操作对数据进行统计,使用方法—根据_id的值查找相关的数量统计给num_s
    let result= await Article.aggregate([{ $group: { _id: "$submityearandmonth",num_s: { $sum: 1 } } }])
   if(result){
    ctx.body={code:200,success:true,msg:'获取文章存档成功信息', data:result}
   }else{
    ctx.body={code:404,success:false,msg:'获取文章存档失败信息',data:result};          
   }
  
})

router.get('/getaboutarticle',async ctx => { //获取文章相关文档的接口
    let result= await Article.aggregate([{ $group: { _id: "$submityearandmonth",abouts:{$push:"$title"},aboutsid:{$push:"$_id"} } }])
    if(result){
        ctx.body={code:200,success:true,msg:'获取文章存档成功信息', data:result}
       }else{
        ctx.body={code:404,success:false,msg:'获取文章存档失败信息',data:result};          
       }
})

router.get('/getarticleclass',async ctx => { //获取文章分类的接口
    let result= await Article.aggregate([{ $group: { _id: "$title", num_s: { $sum: 1 } } }])
    if(result){
        ctx.body={code:200,success:true,msg:'获取文章分类成功', data:result}
       }else{
        ctx.body={code:404,success:false,msg:'获取文章分类失败信息',data:result};          
       }
})

router.get('/getarticletag',async ctx => { //获取文章标签的接口
    let result= await Article.aggregate([{ $group: { _id: "$tag",num_s:{$sum:1}}}])
    if(result){
        ctx.body={code:200,success:true,msg:'获取文章标签成功', data:result}
       }else{
        ctx.body={code:404,success:false,msg:'获取文章标签失败信息',data:result};          
       }
})

router.get('/deletearticle',async ctx => { //删除文章的接口
    let conditions = { '_id': ctx.request.body.artid }
    let result= await Article.remove(conditions)
    if(result){
        ctx.body={code:200,success:true,msg:'删除文章成功', data:result}
       }else{
        ctx.body={code:404,success:false,msg:'删除文章数据库失败',data:result};          
       }
})

router.post('/createarticle',async ctx => { //发送文章的接口
    let body= {tag,column,Abbreviation,ArticleImg,author,time,title,article}=ctx.request.body;
    let submityear=new Date().getFullYear();
    let  submitmonth=new Date().getMonth()+1;
    submitmonth<10?submitmonth='0'+submitmonth:submitmonth;
    let newAccount = new Article({
        servertimeStemp:new Date().getTime(),
        submityearandmonth: Number(submityear+submitmonth),  
        ...body
    });
    // 保存数据newAccount数据进mongoDB
   let result=await  newAccount.save();
    if(result){
        ctx.body={code:200,success:true,msg:'文章提交成功', data:result}
       }else{
        ctx.body={code:404,success:false,msg:'文章提交数据库失败',data:result};          
       }
});


router.post('/putlikenums',async ctx=> { //文章给赞数量统计的接口,先通过id找到文章，然后在通过回复的id找到相应的回复内容，不能直接通过回复id找到内层对象
    let article_id = ctx.request.body.id;
    let recieve_id = ctx.request.body.recieveid;
    let dbindex = ctx.request.body.dbindex;
    let result= await Article.findById(article_id)
    if(result){
               let likes = result.leavemessage[dbindex].likenums;
                likes++
                let comment = [{ "likenums": likes }];
                let updata= await Article.findByIdAndUpdate(article_id, { $set: { leavemessage: comment }})
                if(updata){                 
                  ctx.body= {code: 200,success: true,msg: '文章给赞数量增加成功',data: [updata.leavemessage[dbindex].likenums] };              
                }else{
                  ctx.body={ code: 404,  success: false, msg: '服务器数据库错误' + updata }
                }
    }else{
        ctx.body= {code: 404, success: false, msg: '服务器数据库错误' + result};
    }
})

router.get('/getarticlenewcomments',async ctx => { //获取文章最新评论的接口
    let method = ctx.method.toUpperCase();
    let proxy_url = 'http://changyan.sohu.com/api/2/topic/comments?client_id=cytMXY367&topic_id=5014934906';
    let options = {
        headers: {
            "Connection": "*"
        },
        url: proxy_url,
        method: method,
        json: true,
        body: ctx.request.body
    };
    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            res.json(data)
        }
    }
    request(options, callback);
})

module.exports=router;