const router = require('koa-router')()
const axios = require('axios')
const Visit = require('../moudle/Visit.js')
const conf = require('../config')
const brower = require('../utils/browertype.js')
router.prefix('/api');


router.get('/client/visitmessage', async ctx => {
    /**
   * 获取用户ip
   */
    function getClientIp(req) {
        try {
            return req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
        } catch (e) {
            logger.info("getClientIp error");
            return "";
        }
    }
    let IP = getClientIp(ctx.req);
    let useIpGetAddressRequest = conf('39.128.15.92');//'39.128.15.92'
    let result = await axios.get(useIpGetAddressRequest)
    let userAgent = ctx.req.headers[`user-agent`];
    let browertype = brower('\'' + userAgent + '\'')
    if (result.data) {/* 通过ip向高德api请求拿到详细地理位置 */

        let visit = new Visit({
            ip: IP,
            area: result.data,
            browerType: browertype
        });

        let savedata = await visit.save()

        if (savedata) {
            ctx.body = { code: 200, success: true, msg: '访问者信息保存成功', data: savedata }// 备案信息提交成功
        } else {
            ctx.body = { code: 404, success: false, msg: '数据库保存错误' + savedata };
        }
    } else {
        ctx.body = { code: 404, success: false, msg: '请求错误' + result };
    }
})


router.get('/client/visitmessagelist', async ctx => {
    let result = await Visit.find();
    if (result) {
        ctx.body = { code: 200, success: true, msg: '获取访问者浏览成功', data: result }
    } else {
        ctx.body = { code: 404, success: false, msg: '获取访问者浏览失败', data: result };
    }
})
module.exports = router;
