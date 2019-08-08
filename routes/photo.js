const router = require('koa-router')()
// const Music=require('../moudle/Music.js')
const uploadOne = require('../utils/upload')
const fs = require('fs');
const path = require('path');
const media = path.join(__dirname, '../public/images')

router.prefix('/api');

router.get('/client/photo', async (ctx, next) => {
    let p = new Promise(function (resolve, reject) {
        fs.readdir(media, (err, musicnames) => {
            if (err) {
                reject(err)
            }
            if (musicnames) {
                let musicsrc, musicarr = [];
                musicnames.forEach((music) => {
                    musicsrc = 'images/' + music;
                    musicarr.push({ 'path': musicsrc, 'filename': music })
                })
                resolve(musicarr)
            }
        })
    })
    await p.then(res => {
        return ctx.body = { code: 200, success: true, msg: '获取图片列表成功', data: res };
    }).catch(err => {
        return ctx.body = { code: 404, success: false, msg: '获取图片列表失败', data: err };
    })
})
router.post('/uploadphoto', async ctx => {
    uploadOne(ctx, 'images')
})

router.post('/deletephoto', async ctx => {
    fs.unlink('public/images/' + req.body.photoname, () => {
        ctx.body = { code: 200, success: true, msg: '图片删除成功' };
    })
})

module.exports = router