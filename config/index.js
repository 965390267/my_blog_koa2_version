const gaodeMapKey="6d1cdeddf1587146fea3938809f5328e";/* 高德地图key */

module.exports=gaodeAddress=(ip)=>{/* 通过ip地址得到详细地址信息 */
  return `https://restapi.amap.com/v3/ip?ip=${ip}&key=${gaodeMapKey}` 
}