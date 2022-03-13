const axios = require("axios").default;


let deviceInfo = async function getDeviceInfo(ipaddress,os,device,url) {

  let bodyJson = {"clientIp" : ipaddress};
  if (os) bodyJson = {...bodyJson,"os": os};
  if (device) bodyJson = {...bodyJson,"device": device};
  const info = await axios.get(url, { data: bodyJson });
  return info.data;
};



module.exports = { deviceInfo };
