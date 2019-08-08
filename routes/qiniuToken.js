const router = require('koa-router')()
var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
accessKey = 'mRJ2s77P9ZvQVefN-UstJeQTaO4APnL1YO8qRQ-M';
secretKey = 'ke5-xQyyfPw1IHCCAMvNb6vWLTeWjhXMQuoxyd79';
bucket = 'first_zzh';
//要上传的空间
router.get('/api/qiniutoken', async (ctx, next) => {

    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let options = {
        scope: bucket,
        expires: 3600 * 24
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    if (uploadToken) {
        ctx.body = { code: 200, success: true, msg: '七牛云token获取成功', data: uploadToken };

    } else {
        ctx.body = { code: 404, success: false, msg: '七牛云token获取失败', data: null };
    }
})

module.exports = router