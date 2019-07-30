const router = require('koa-router')()
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const User = require('../moudle/User.js')
const validateRegister = require('../validation/register')

router.post('/login', async ctx => {
  let {
    username,
    password
  } = ctx.request.body;

  const findUserResult = await User.find({
    username: username
  })

  if (findUserResult.length == 0) {
    ctx.status = 404;
    ctx.body = {
      msg: '用户不存在',
      success: false,
      code: 404,
      data: {}
    }
  } else {
 
    let md5 = crypto.createHash('md5');
    //3 digest([encoding])方法计算数据的hash摘要值，encoding是可选参数，不传则返回buff
    let en_data_passwd = md5.update(password).digest('hex');
    if (findUserResult[0].password == en_data_passwd) {/* y验证通过 */
     
      let loginTimes=findUserResult[0].logintimes;
      loginTimes++;
      await  User.findByIdAndUpdate(findUserResult[0]._id,{logintimes:loginTimes,time:new Date()});/* 统计登录次数 */
      const user = {/* jwt生成必须参数 */
        username,
        en_data_passwd
      }
      let token = jwt.sign(user, 'secret', {/* 生成token */
        expiresIn: '48h'
      })

      ctx.status = 200;
      ctx.body = {
        msg: '验证通过',
        success: true,
        code: 200,
        data: { token: "Bearer " + token}
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        msg: '密码错误',
        success: false,
        code: 404,
        data: {}
      }
    }

  }


})

/* 注册 */
router.post('/register', async ctx => {
  const { errors, isValid } = validateRegister(ctx.request.body);/* 表单验证 */
  if (!isValid) {
    ctx.status = 404;
    return ctx.body = errors
  }
  let { username, password } = ctx.request.body;
  const findUserResult = await User.find({ username: username });

  if (findUserResult.length>0) {
    ctx.status = 404;
    ctx.body = {
      msg: '用户名已存在',
      success: false,
      code: 404,
      data: {}
    }
  } else {
    let md5 = crypto.createHash('md5');
    //3 digest([encoding])方法计算数据的hash摘要值，encoding是可选参数，不传则返回buff
    let en_data_passwd = md5.update(password).digest('hex');

    const newUser = new User({
      username: ctx.request.body.username,
      password: en_data_passwd,
      registertime:new Date()
    })
    await newUser.save().then(user => {
      ctx.body = {
        msg: '注册成功',
        success: true,
        code: 200,
        data: {}
      }
    }).catch(err => {
      ctx.body = {
        msg: '注册失败',
        success: false,
        code: 404,
        data: err
      }
    })
  }

})
module.exports = router