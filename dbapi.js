const axios = require("axios").default;

const ipUrl = "http://pro.ip-api.com/json/?fields=countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query&key=DcyaIbvQx69VZNA"
let deviceInfo = async function getDeviceInfo(ipaddress,os,device,url) {

  let bodyJson = {"clientIp" : ipaddress};
  if (os) bodyJson = {...bodyJson,"os": os};
  if (device) bodyJson = {...bodyJson,"device": device};
  const info = await axios.get(url, { data: bodyJson });
  return info.data;
};

let requestIpApi = async function getIpAddress(ipaddress){
  const data = await axios.get(`https://pro.ip-api.com/json/${ipaddress}?fields=countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query&key=DcyaIbvQx69VZNA`);
  console.log(data.data);
  return data.data
}



module.exports = { deviceInfo ,requestIpApi};
