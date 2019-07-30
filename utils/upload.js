// const router = require('koa-router')()
const fs=require('fs')
const path=require('path')

module.exports =function uploadOne(ctx,savePath=''){
 // 上传单个文件
 const file = ctx.request.files['']; // 获取上传文件
 // 创建可读流
 console.log(file);
 
 const reader = fs.createReadStream(file.path);
 let filePath = path.join(__dirname, `../public/${savePath}`) + `/${file.name}`;
 // 创建可写流
 const upStream = fs.createWriteStream(filePath);
 // 可读流通过管道写入可写流
 reader.pipe(upStream);
    return ctx.body ={
        msg: "上传成功！",
        success: true,
        code: 200,
        data:{path:filePath,fileName:file.name}
    };
  }
  // module.exports = function upload(ctx,savePath=''){
  //    // 上传多个文件
    
  //    const files =ctx.request.files; // 获取上传文件
  //    console.log(files);
  //    for (let file of files) {   
  //      // 创建可读流
  //      const reader = fs.createReadStream(file.path);
  //      // 获取上传文件扩展名
  //      let filePath = path.join(__dirname, `../public`) + `/${file.name}`;
  //      // 创建可写流
  //      console.log(file);
       
  //      const upStream = fs.createWriteStream(filePath);
  //      // 可读流通过管道写入可写流
  //      reader.pipe(upStream);
  //    }
  //   return ctx.body ={
  //       msg: "上传成功！",
  //       success: true,
  //       code: 200,
  //       data:{path:filePath,fileName:file.name}
  //   };

  //   }


