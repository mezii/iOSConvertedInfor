const axios = require("axios").default;

const ipUrl = "http://pro.ip-api.com/json/?fields=countryCode,lat,lon,timezone,offset,org,&key=DcyaIbvQx69VZNA"
const deviceInfo = async function getDeviceInfo(ipaddress,os,device,url) {
  try {
    
    let bodyJson = {"clientIp" : ipaddress};
    if (os) bodyJson = {...bodyJson,"os": os};
    if (device) bodyJson = {...bodyJson,"device": device};
    const info = await axios.get(url, { data: bodyJson });
    return info.data;
  } catch (error) {
    return error;
  }
};

const requestIpApi = async function getIpAddress(ipaddress){
  try {
      const data = await axios.get(`https://pro.ip-api.com/json/${ipaddress}?fields=countryCode,lat,lon,timezone,offset,isp&key=DcyaIbvQx69VZNA`);
     return data.data
  }catch (error){
    return error;
  }
}



module.exports = { deviceInfo ,requestIpApi};
