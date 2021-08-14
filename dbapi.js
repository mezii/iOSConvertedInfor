const axios = require("axios").default;

const loginUrl = `http://139.180.128.184:9999/api/auth/signin`;


let token = async function getToken() {
  const data = await axios.post(loginUrl, {
    username: "a1",
    password: "a1",
  });
  return data.data.accessToken;
};
let deviceInfo = async function getDeviceInfo(ipaddress,os,device,url) {
  const token = await this.token();
  const header = {
    "x-access-token": token,
    Network: "Appsflyer",
    Bundle: "com.apple.mobilesafari",
  };
  let bodyJson = {"clientIp" : ipaddress};
  if (os) bodyJson = {...bodyJson,"os": os};
  if (device) bodyJson = {...bodyJson,"device": device};
  const info = await axios.get(url, { headers: header,data: bodyJson });
  return info.data;
};



module.exports = { token, deviceInfo };
