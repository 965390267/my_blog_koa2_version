const router = require('koa-router')()
// const Music=require('../moudle/Music.js')
const uploadOne=require('../utils/upload')
const fs = require('fs');
const path = require('path');
const media = path.join(__dirname, '../public/music')
router.prefix('/api');
router.get('/music', async ctx => {
    let p= new Promise(function(resolve,reject){
        fs.readdir(media, (err, musicnames) => {   
            if (err) {
            reject(err)
            } 
            if(musicnames) {
                let musicsrc, musicarr = [];
                musicnames.forEach((music) => {
                    musicsrc = 'music/' + music;
                    musicarr.push({ 'path': musicsrc, 'filename': music })
                })
                resolve(musicarr)
            }
        })
    })
    await p.then(res=>{
        return ctx.body={ code: 200, success: true, msg: '获取音乐成功',data:res };
    }).catch(err=>{
        return  ctx.body= { code: 404, success: false, msg:'获取音乐错误',data:err };
    })
})
router.post('/uploadmusic',async ctx=>{
    uploadOne(ctx,'music')
})

router.post('/deletemusic',async ctx=>{
    fs.unlink('public/music/'+req.body.photoname,()=>{
       ctx.body={code:200,success:true,msg:'歌曲删除成功'};
    }) 
})

module.exports = router