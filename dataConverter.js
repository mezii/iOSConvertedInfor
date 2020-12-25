const fs = require("fs");
let llData = async function getllData() {
  const data = await fs.readFileSync("./data.txt", {
    encoding: "utf8",
    flag: "r",
  });
  const dataArr = data.split("\n");
  return {
    ddInfo: dataArr[Math.floor(Math.random() * dataArr.length + 1)].split(
      "----"
    ),
  };
};
let llDataForReplacement = async function getllDataForReplacement(json) {
  const data = await this.llData();
  console.log(data);
  json["SerialNumber"] = data.ddInfo[0];
  json["UniqueDeviceID"] = data.ddInfo[6];
  json["IMEI"] = data.ddInfo[1];
  json["REGION"] = "LL/A";
  json["WifiAddressData"] = data.ddInfo[3];
  json["BluetoothAddress"] = data.ddInfo[4];
  json["ECID"] = data.ddInfo[5];
  json["MLBSN"] = data.ddInfo[7];
  //
  let model_arr;
  switch (json["ProductType"]) {
    case "iPhone8,1":
      model_arr =
        "MKQL2, MKQ72, MKR12, MKRE2, MKRW2, MKT92, ML7E2,MN0P2, MN172, MN1K2, MN1U2, MN1Y2,MKQC2, MKQQ2, MKR52, MKRJ2, MKT12, MKTE2, ML7J2,MKQG2, MKQV2, MKR92, MKRP2, MKT52, MKTJ2, ML7N2,MKQM2, MKQ82, MKRF2, MKRX2, MKR22, MKTA2, ML7F2,MN0V2, MN192, MN1L2, MN1V2, MN202,MKQD2, MKQR2, MKR62, MKRK2, MKT22, MKTF2, ML7K2,MKQH2, MKQW2, MKRA2, MKRQ2, MKT62, MKTK2, ML7P2,MKQ62, MKQK2, MKQY2, MKRD2, MKRT2, MKT82, ML7D2, NKQJ2,MN0N2, MN162, MN1G2, MN1Q2, MN1X2,MKQA2, MKQP2, MKR42, MKRH2, MKT02, MKTD2, ML7H2,MKQF2, MKQU2, MKR82, MKRM2, MKT42, MKTH2, ML7M2,MKQ52, MKQJ2, MKQX2, MKRC2, MKRR2, MKT72, ML7C2,MN0M2, MN132, MN1E2, MN1M2, MN1W2, MKQN2, MKQ92, MKR32, MKRG2, MKRY2, MKTC2, ML7G2,MKQE2, MKQT2, MKR72, MKRL2, MKT32, MKTG2, ML7L2";
    case "iPhone8,2":
      model_arr =
        "MKTN2, MKU32, MKUN2, MKV62, MKVQ2, MKW72, ML6D2, MKTT2, MKU82, MKUV2, MKVD2, MKVX2, MKWD2, ML6H2, MKTX2, MKUF2, MKV12, MKVH2, MKW22, MKWH2, ML6M2, MKU52, ML6E2, MKTP2, MKUP2, MKV72, MKVU2, MKW82, MKU92, ML6J2, MKTU2, MKUW2, MKVE2, MKVY2, MKWE2, MKUG2, MKV22, ML6N2, MKVJ2, MKTY2, MKTM2, MKU22, MKUJ2, MKV52, MKVP2, MKW62, ML6C2, MKTR2, MKU72, MKUU2, MKV92, MKVW2, MKWC2, ML6G2, MKU12, ML6A2, MKV32, MKTL2, MKUH2, MKVN2, MKW52, MKU62, ML6F2, MKTQ2, MKUQ2, MKV82, MKVV2, MKW92, ML642, MKUD2, ML6K2, MKTV2, MKUX2, MKVF2, MKW02, MKWF2";
    case "iPhone8,4":
      model_arr =
        "MLXH2, MLXW2, MLY12, MLY52, MLY92, MLXM2, MP8D2, MP8R2, MP8H2, MP8M2, MP7V2, MP842, MLXK2, MLXY2, MLY32, MLY72, MLYC2, MLXP2, MP952, MP9J2, MP992, MP9E2, MP802, MP882, MLXJ2, MLXX2, MLY22, MLY62, MLYA2, MLXN2, MLXL2, MLY02, MLY42, MLY82, MLYD2, MLXQ2, MLLM2, MLLV2, MLLX2, MLM02, MLM32, MLLP2, MP8C2, MP8Q2, MP8G2, MP8L2, MP7U2, MP832, MP8A2, MP8P2, MP8F2, MP8K2, MP7T2, MP822, MLM42, MLM62, MLMA2, MLMD2, MLMF2, MLMH2, MP932, MP9G2, MP972, MP9C2, MP7X2, MP862";
    case "iPhone9,1":
      model_arr =
        "MN8G2, MNAC2, MNAY2, MNCE2, MNGQ2, MN8L2, MNAJ2, MNC32, MNCK2, MNGX2, MN8R2, MNAQ2, MNC82, MNCQ2, MN8J2, MNAE2, MNC12, MNCG2, MN8N2, MNAL2, MNC52, MNCM2, MNH02, MN8U2, MNAV2, MNCA2, MNCT2, MN8Q2, MNAP2, MNC72, MNCP2, MN8W2, MNAX2, MNCD2, MNCV2, MPRV2, MPRT2, MPRH2, MPRL2, MPRW2, MPRU2, MPRJ2, MPRM2, MN8K2, MNAF2, MNC22, MNCJ2, MN8P2, MNAM2, MNC62, MNH12, MNCN2, MN8V2, MNAW2, MNCC2, MNCU2, MN8H2, MNAD2, MNC02, MNCF2, MN8M2, MNAK2, MNC42, MNCL2, MN8T2, MNAU2, MNC92, MNCR2";
      break;
    case "iPhone9,2":
      model_arr =
        "MNQH2, MNR12, MNR52, MNR92, MNRJ2, MN482, MN5T2, MN642, MN6F2, MNFP2, MN4E2, MN5Y2, MN692, MN6L2, MNFV2, MNQK2, MNR32, MNR72, MNRC2, MNRL2, MN4J2, MN612, MN6C2, MN6N2, MN4L2, MN632, MN6E2, MN6Q2, MPRA2, MPR92, MPR52, MPR62, MN4C2, MN5W2, MN672, MN6J2, MNFT2, MNQJ2, MNR22, MNR62, MNRA2, MNRK2, MN492, MN5U2, MN652, MN6G2, MNFQ2";
    case "iPhone9,3":
      model_arr =
        "MN9D2, MN9U2, MN8X2,MN9H2, MN9Y2, MN922,MN9N2, MNA62, MN972,MN9K2, MNA32, MN942,MN9M2, MNA52, MN962,MN9T2, MNAA2, MN9C2,MPRP2, MPRR2,MN9G2, MN9X2, MN912,MN9L2, MNA42, MN952,MN9E2, MN9V2,MN9E2, MN9V2,MN9P2, MNA72";
      break;
    case "iPhone9,4":
      model_arr =
        "MNQR2, MNQW2, MNQM2,MN522, MN5G2, MN4M2,MN592, MN5M2, MN4W2,MNQU2, MNQY2, MNQP2,MN552, MN5J2, MN4Q2,MN5D2, MN5P2, MN4Y2,MN572, MN5L2, MN4V2,MN5F2, MN5R2,MPQW2, MPQY2,MPR72, MPR82, MNQV2, MNR02, MNQQ2, MN562, MN5K2, MN4U2, MN5E2, MN5Q2, MNQT2, MNQX2, MNQN2,MN532, MN5H2, MN4P2,MN5C2, MN5N2, MN4X2, MN502";
      break;
    case "iPhone10,1":
      model_arr =
        "MQ6M2, MQ742, MQ772, MQ7H2, MQ802, MQ832, MQ6L2, MQ732, MQ762, MQ7G2, MQ7Y2, MQ822, MQ6K2, MQ722, MQ752, MQ7F2, MQ7X2, MQ812, MRRK2, MRRR2, MRRT2, MRRL2, MRRW2, MRRX2";
      break;
    case "iPhone10,2":
      model_arr =
        "MQ8F2, MQ9F2, MQ982,MQ8J2, MQ9C2, MQ9J2,MQ8E2, MQ9E2, MQ972,MQ8H2, MQ9A2, MQ9H2,MQ8D2, MQ9D2, MQ962,MQ8G2, MQ9G2, MQ992,MRTG2, MRTJ2, MRT72,MRTH2, MRTK2, MRT82";
      break;
    case "iPhone10,3":
      model_arr =
        "MQCT2, MQCL2, MQAY2, MQA62,MQCW2, MQCP2, MQC22, MQA92,MQCR2, MQCK2, MQAX2, MQA52,MQCV2, MQCN2, MQC12, MQA82";
    case "iPhone10,4":
      model_arr =
        "MQ6J2, MQ6X2, MQ712, MQ7E2, MQ7T2, MQ7W2, MQ6H2, MQ6W2, MQ702, MQ7D2, MQ7R2, MQ7V2, MQ6G2, MQ6V2, MQ6Y2, MQ7C2, MQ7Q2, MQ7U2, MRRM2, MRRP2, MRRQ2, MRRN2, MRRU2, MRRV2";
      break;
    case "iPhone10,5":
      model_arr =
        "MQ8N2, MQ8V2, MQ922,MQ8R2, MQ8Y2, MQ952,MQ8M2, MQ8U2, MQ912,MQ8Q2, MQ8X2, MQ942,MQ8L2, MQ8T2, MQ902,MQ8P2, MQ8W2, MQ932,MRTC2, MRTE2, MRT92,MRTA2, MRTD2, MRTF2";
      break;
    case "iPhone10,6":
      model_arr =
        "MQAK2, MQAR2, MQAD2, MQAN2, MQAV2, MQAG2, MQAJ2, MQAQ2, MQAC2, MQAM2, MQAU2, MQAF2";
      break;

    default:
      model_arr =
        "MQAK2, MQAR2, MQAD2, MQAN2, MQAV2, MQAG2, MQAJ2, MQAQ2, MQAC2, MQAM2, MQAU2, MQAF2";
  }
  const array_Model = model_arr.replace(/ /g, "").split(/,/);
  const fk_model_number =
    array_Model[Math.floor(Math.random() * array_Model.length)];
  const ddInfo = {
    FK_REGION: "LL/A",
    FK_BUILDVERSION: json["BuildVersion"],
    FK_PRODUCT_VERSION: json["ProductVersion"],
    FK_BLUETOOTH_ADDR: json["BluetoothAddress"],
    FK_HARDWARE_PLATFORM: json["HardwarePlatform"],
    FK_IMEI: json["IMEI"],
    FK_WIFI_ADDR: json["WifiAddressData"],
    FK_MODEL_NUMBER: fk_model_number + "LL/A",
    FK_SN: json["SerialNumber"],
    FK_MLBSN: json["MLBSN"],
    FK_UDID: json["UniqueDeviceID"],
    FK_MT: json["ProductType"],
    FK_HARDWAREMODEL: json["HWModelStr"],
    FK_ECID: json["ECID"],
    FK_ENABLE: true,
  };
  json["ddData"] = ddInfo;

  return json;
};
module.exports = { llData, llDataForReplacement };
