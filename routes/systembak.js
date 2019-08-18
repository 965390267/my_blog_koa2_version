const router = require('koa-router')()
const Admin = require('../moudle/System.js')
const os = require('os');
router.prefix('/api');
router.get('/systemmessage', async ctx => { //浏览器信息

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


router.post('/recordid', async ctx => { //提交底部备案信息
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



router.get('/client/servermessage', async ctx => { //获取底部备案信息
   // let result = await Admin.findOne({
   //    recordid: ctx.request.body.recordmes
   // })
   console.log('9999');
   
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
   console.log("cpu架构：" + arch);

   //操作系统内核
   const kernel = os.type();
   console.log("操作系统内核：" + kernel);

   //操作系统平台
   const pf = os.platform();
   console.log("平台：" + pf);

   //系统开机时间
   const uptime = os.uptime();
   console.log("开机时间：" + dealTime(uptime));

   //主机名
   const hn = os.hostname();
   console.log("主机名：" + hn);

   //主目录
   const hdir = os.homedir();
   console.log("主目录：" + hdir);
 
   //内存
   const totalMem = os.totalmem();
   const freeMem = os.freemem();
   console.log("内存大小：" + dealMem(totalMem) + ' 空闲内存：' + dealMem(freeMem));

   //cpu
   const cpus = os.cpus();
   console.log('*****cpu信息*******');
   
   let cpuMes=[]
   cpus.forEach((cpu, idx, arr) => {
     
      var times = cpu.times;
      let cpusingle={
         cpucore:["cpu核心",idx+1],
         cpumodel:["型号",cpu.model],
         speed:["频率",`${cpu.speed}MHz`],
         rota:["使用率",`${((1 - times.idle / (times.idle + times.user + times.nice + times.sys + times.irq)) * 100).toFixed(2)}%`]
      }
      cpuMes.push(cpusingle);
      // console.log(`cpu${idx}：`);
      // console.log(`型号：${cpu.model}`);
      // console.log(`频率：${cpu.speed}MHz`);
      // console.log(`使用率：${((1 - times.idle / (times.idle + times.user + times.nice + times.sys + times.irq)) * 100).toFixed(2)}%`);
   });

   //网卡
   console.log('*****网卡信息*******');
   const networksObj = os.networkInterfaces();
   for (let nw in networksObj) {
      let objArr = networksObj[nw];
      console.log(`\r\n${nw}：`);
      objArr.forEach((obj, idx, arr) => {
         // console.log(`地址：${obj.address}`);
         // console.log(`掩码：${obj.netmask}`);
         // console.log(`物理地址：${obj.mac}`);
         // console.log(`协议族：${obj.family}`);
      });
   }
   const system = { 
      cpuFramework: ["cpu架构：", arch],
       operatingSystemKernel: ["操作系统内核：", kernel], 
       platform: ["平台：", pf], 
       bootUpTime: ["开机时间：", dealTime(uptime)] ,
       hostName:["主机名：",hn],
       homeDir:['主目录：',hdir],
       memMes:{totalMem:["内存大小：",dealMem(totalMem)],freeMem:["空闲内存：",dealMem(freeMem)]},
       cpuMes:cpuMes,
       networksMes:networksObj
      }

      ctx.body = { code: 200, success: true, msg: '获取服务器信息成功', data: system };// 获取备案信息成功        
});



module.exports = router;
