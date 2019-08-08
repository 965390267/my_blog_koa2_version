const router = require('koa-router')()
const Admin = require('../moudle/System.js')

router.prefix('/api');
router.get('client/systemmessage', async ctx => { //浏览器信息

   let agent = ctx.headers["user-agent"];
   ctx.body = { code: 200, success: true, msg: '浏览器信息', data: { 'agent': agent, 'loginip': ctx.ip, 'hostname': ctx.host } };// 浏览器信息


});
router.get('/client/recordid', async ctx => { //获取底部备案信息
   let result = await Admin.findOne({
      recordid: ctx.request.body.recordmes
   })
   if (result) {
      ctx.body = { code: 200, success: true, msg: '获取备案信息成功', data: { 'record': data } };// 获取备案信息成功        
   } else {
      ctx.body = { code: 404, success: false, msg: '数据库错误', data: result };
   }
});


router.post('/Authentication/recordid', async ctx => { //提交底部备案信息
   let newrecordid = new Admin({
      recordid: ctx.request.body.tag,
   });
   let agent = ctx.request.body.name;
   // 保存数据newAccount数据进mongoDB
   await newrecordid.save().then(data => {
      ctx.body = { code: 200, success: true, msg: '备案信息提交成功', data: { 'agent': agent } }// 备案信息提交成功
   }).catch(err => {
      ctx.body = { code: 404, success: false, msg: '数据库错误' + err };
   })


});
module.exports = router;
