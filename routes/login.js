const router = require('koa-router')()
const jwt = require('jsonwebtoken');
const crypto =require('crypto')
const User=require('../moudle/User.js')
router.post('/api/login', async (ctx, next) => {
    let {
        username,
        password
    } = ctx.request.body;
    let md5 = crypto.createHash('md5');
    //3 digest([encoding])方法计算数据的hash摘要值，encoding是可选参数，不传则返回buff
    let en_data_passwd = md5.update(password).digest('hex');
    console.log(username,password);
    
   const findUserResult= await User.findOne({
        username:username,
        password:password
    })


    if(findUserResult){
        const user = {
            username,
            password
        }
        let token = jwt.sign(user, 'secret', {
            expiresIn: 3600
        })
        return ctx.body = {
            msg: '',
            success: true,
            code: 200,
            token: "Bearer " + token
        }
    }else{
        return ctx.body = {
            msg: '用户不存在',
            success: true,
            code: 400,
            data:{}
        }
    }
    

})

module.exports = router