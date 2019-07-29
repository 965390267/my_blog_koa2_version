const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaBody=require('koa-body');//文件上传中间件
const compress = require('koa-compress'); //压缩
const koajwt = require('koa-jwt');
// const index = require('./routes/index')
const users = require('./routes/users')
const login = require('./routes/login')


// compress data
app.use(compress({
  filter: function (content_type) { //只有在请求的content-type中有gzip类型，我们才会考虑压缩，因为zlib是压缩成gzip类型的
      return /text/i.test(content_type);
  },
  threshold: 2048, //阀值，当数据超过2kb的时候，可以压缩
  flush: require('zlib').Z_SYNC_FLUSH
}));

//使用
app.use(async(ctx, next) => {
  ctx.compress = true; //是否压缩数据
  await next();
});


// error handler
onerror(app)
app.use(koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));


app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// 验证jsonwebtoken是否过期的中间件，在login接口后面执行，除了login接口的请求外，其他接口都需要验证token
app.use(koajwt({
  secret: 'secret'
}).unless({
   path: [/\/register/, /\/login/]
}));

// routes
// app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods());

app.use(login.routes(),login.allowedMethods());



app.use(async(ctx, next)=>{
  return next().catch((err) => {
      if (401 == err.status) {
        ctx.status = 401;
          ctx.body = {
              status:401,
              msg:'登录过期，请重新登录'
          }
      } else {
          throw err;
      }
  });
});

// error-handling
app.on('error', (err, ctx) => {
 
  console.error('server error', err, ctx)
});

module.exports = app
