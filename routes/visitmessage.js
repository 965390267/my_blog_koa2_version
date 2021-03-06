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
    let useIpGetAddressRequest = conf(IP);//'39.128.15.92'
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



router.post('/client/visitmessagelist', async ctx => { //获取用户信息的接口，带分页             
    let pageSize = ctx.request.body.pageSize; //一页多少条
    let currentPage = ctx.request.body.currentPage;  //当前第几页
    let skipnum = (currentPage - 1) * pageSize;   //跳过数

    let result = await Visit.find().skip(skipnum).limit(pageSize).sort({time: -1 })
    if (result) {
        let countResult = await Visit.count()
        if (countResult) {
            ctx.body = { code: 200, success: true, msg: '获取访问者信息成功', count: countResult, data: result }
        } else {
            ctx.body = { code: 404, success: false, msg: '获取访问者信息失败', data: result };
        }
    } else {
            ctx.body = { code: 404, success: false, msg: '获取访问者信息失败', data: result };
    }
})
module.exports = router;
