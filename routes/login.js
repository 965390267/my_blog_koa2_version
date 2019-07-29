const router = require('koa-router')()
const jwt = require('jsonwebtoken');
const fs = require('fs')
const path = require('path')
const User=require('../moudle/User')
router.post('/api/login', async (ctx, next) => {
    let {
        username,
        password
    } = ctx.request.body;
    let md5 = crypto.createHash('md5');
    //3 digest([encoding])方法计算数据的hash摘要值，encoding是可选参数，不传则返回buff
    let en_data_passwd = md5.update(password).digest('hex');
   const findUserResult= await User.findOne({
        username:username,
        password:password
    })
    if(findUserResult.length>0){

    }else{
        
    }
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
})