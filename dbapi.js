const axios = require("axios").default;

const loginUrl = `http://139.180.128.184:9999/api/auth/signin`;
const deviceInfoUrl = `http://139.180.128.184:9999/api/fakeinfo/`;
let token = async function getToken() {
  const data = await axios.post(loginUrl, {
    username: "a1",
    password: "a1",
  });
  return data.data.accessToken;
};
let deviceInfo = async function getDeviceInfo() {
  const token = await this.token();
  const header = {
    "x-access-token": token,
    Network: "Appsflyer",
    Bundle: "com.apple.mobilesafari",
  };
  const info = await axios.get(deviceInfoUrl, { headers: header });
  return info.data;
};

module.exports = { token, deviceInfo };
