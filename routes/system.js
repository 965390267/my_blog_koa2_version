const router = require('koa-router')()
const Admin = require('../moudle/System.js')
const os = require('os');
const WebSocket = require('ws');

router.prefix('/api');

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


router.post('/recordid', async ctx => { //提交底部备案信息
   let newrecordid = new Admin({
      recordid: ctx.request.body.tag,
   });

   // 保存数据newAccount数据进mongoDB
   await newrecordid.save().then(data => {
      ctx.body = { code: 200, success: true, msg: '备案信息提交成功', data: data }// 备案信息提交成功
   }).catch(err => {
      ctx.body = { code: 404, success: false, msg: '数据库错误' + err };
   })


});



function getSystemMessage() {
   var dealTime = (seconds) => {
      var seconds = seconds | 0;
      var day = (seconds / (3600 * 24)) | 0;
      var hours = ((seconds - day * 3600) / 3600) | 0;
      var minutes = ((seconds - day * 3600 * 24 - hours * 3600) / 60) | 0;
      var second = seconds % 60;
      (day < 10) && (day = '0' + day);
      (hours < 10) && (hours = '0' + hours);
      (minutes < 10) && (minutes = '0' + minutes);
      (second < 10) && (second = '0' + second);
      return [day, hours, minutes, second].join(':');
   };

   var dealMem = (mem) => {
      var G = 0,
         M = 0,
         KB = 0;
      (mem > (1 << 30)) && (G = (mem / (1 << 30)).toFixed(2));
      (mem > (1 << 20)) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2));
      (mem > (1 << 10)) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2));
      return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B';
   };
   //cpu架构
   const arch = os.arch();
   //操作系统内核
   const kernel = os.type();
   //操作系统平台
   const pf = os.platform();
   //系统开机时间
   const uptime = os.uptime();
   //主机名
   const hn = os.hostname();
   //主目录
   const hdir = os.homedir();
   //内存
   const totalMem = os.totalmem();
   const freeMem = os.freemem();
   //cpu
   const cpus = os.cpus();
   let cpuMes = []
   cpus.forEach((cpu, idx, arr) => {
      var times = cpu.times;
      let cpusingle = {
         cpucore: ["cpu核心", idx + 1],
         cpumodel: ["型号", cpu.model],
         speed: ["频率", `${cpu.speed}MHz`],
         rota: ["使用率", `${((1 - times.idle / (times.idle + times.user + times.nice + times.sys + times.irq)) * 100).toFixed(2)}%`]
      }
      cpuMes.push(cpusingle);
   });

   //网卡
   const networksObj = os.networkInterfaces();
   const system = {
      cpuFramework: ["cpu架构：", arch],
      operatingSystemKernel: ["操作系统内核：", kernel],
      platform: ["平台：", pf],
      bootUpTime: ["开机时间：", dealTime(uptime)],
      hostName: ["主机名：", hn],
      homeDir: ['主目录：', hdir],
      memMes: { totalMem: ["内存大小：", dealMem(totalMem)], freeMem: ["空闲内存：", dealMem(freeMem)] },
      cpuMes: cpuMes,
      networksMes: networksObj
   }
   return system;
}



const wss = new WebSocket.Server({ port: 8888 });
let timer=null;
wss.on('connection', ws => {

   ws.on('message', msg => {
      console.log('server receive msg：', msg);
   });
   ws.on('close', function() {
     clearInterval(timer)
  });
  ws.on('error', function() {
   clearInterval(timer)
  });
  timer=  setInterval(() => {
      wss.clients.forEach(function each(client) {
         client.send(JSON.stringify(getSystemMessage()));
      });

   }, 2000)
});


module.exports = router;
