const router = require('koa-router')()
var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
const accessKey = 'mRJ2s77P9ZvQVefN-UstJeQTaO4APnL1YO8qRQ-M';
const secretKey = 'ke5-xQyyfPw1IHCCAMvNb6vWLTeWjhXMQuoxyd79';
//要上传的空间
router.get('/api/client/qiniutoken', async (ctx, next) => {
  let bucket= ctx.query.bucket||'blog_content';
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let options = {
        scope: bucket,
        expires: 3600 * 24
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    if (uploadToken) {
        ctx.body = { code: 200, success: true, msg: `七牛云token获取成功,仓库地址${bucket}`, data: uploadToken };

    } else {
        ctx.body = { code: 404, success: false, msg: '七牛云token获取失败', data: null };
    }
})

module.exports = router