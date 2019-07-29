const router = require('koa-router')()
const fs=require('fs')
const path=require('path')
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})
router.post('/api/upload', async (ctx, next) => {

 // 上传多个文件
 const files = ctx.request.files.file; // 获取上传文件
 for (let file of files) {
   // 创建可读流
   const reader = fs.createReadStream(file.path);
   // 获取上传文件扩展名
   let filePath = path.join(__dirname, '../public') + `/${file.name}`;
   // 创建可写流
   const upStream = fs.createWriteStream(filePath);
   // 可读流通过管道写入可写流
   reader.pipe(upStream);
 }
return ctx.body ={
    msg: "上传成功！",
    success: true,
    code: 200,
    data:{path:filePath,fileName:file.name}
};

})
router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})


module.exports = router
