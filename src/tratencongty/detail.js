const cheerio = require('cheerio'); // khai báo module cheerio
const mysql = require('mysql');
const request = require('request-promise'); // khai báo module request-promise

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company_info"
});

// \n            Địa chỉ: 280 khu phố Lộc Du, Phường Trảng Bàng, Thị xã Trảng Bàng, Tỉnh Tây Ninh
const extractAddress = (data) => {
  data = data.replace('\n', '');
  data = data.trim();
  if (data.indexOf(':') !==-1) {
    data = data.split(':')[1];
  }
  return data.trim();
}

// "\n            Đại diện pháp luật: Nguyễn Tấn Phát"
const extractOwner = (data) => {
  data = data.replace('\n', '');
  data = data.trim();
  if (data.indexOf(':') !==-1) {
    data = data.split(':')[1];
  }
  return data.trim();
}

// "                                    Ngày cấp giấy phép: 08/02/2023"
const extractSignDate = (data) => {
  data = data.replace('\n', '');
  data = data.trim();
  if (data.indexOf(':') !==-1) {
    data = data.split(':')[1];
  }
  return data.trim();
}

// Ngày hoạt động: 08/02/2023 (<em>Đã hoạt động 22 giờ</em>)"
const extractActiveDate = (data) => {
  data = data.replace('\n', '');
  data = data.trim();
  if (data.indexOf(':') !==-1) {
    data = data.split(':')[1];
  }
  const indexNgoac = data.indexOf('(');
  if (indexNgoac !== -1) {
    data = data.substr(0, indexNgoac - 1);
  }
  return data.trim();
}

//             Trạng thái: Đang hoạt động
const extractStatus = (data) => {
  data = data.trim();
  if (data.indexOf(':') !==-1) {
    data = data.split(':')[1]
  }
  return data.trim();
}

//
const extractType = (data) => {
  const lastIndex = data.lastIndexOf(':')
  if (lastIndex !== -1) {
    data = data.substr(lastIndex + 1);
  }
  return data.trim();
}
// Điện thoại trụ sở: <img src=\"data:image/png;base64,iVBORw0KGgo
const extractPhoneImg = (data) => {
  data = data.trim();
  const indexSrc = data.indexOf('<img');
  if (indexSrc === -1) {
    // khong co image phone
    return null
  }
  data = data.substr(indexSrc);
  return data;
}

const execute = async () => {
  try {
    const url = 'https://www.tratencongty.com/company/121acb5cb-cong-ty-tnhh-tm-dv-tong-hop-va-xay-dung-tan-phat/';
    console.log('Start crawler: ', url);
    const response = await request(url);
    const $ = cheerio.load(response);
    const dataRaw = $('.jumbotron').first();
    const name = dataRaw.find('h4').text();
    let tax_code = '';
    dataRaw.find('a').each((index, el) => {
      if (index === 1) {
        tax_code = $(el).text();
      }
    })
    const data_raw = dataRaw.toString();
    const spreadData = data_raw.split('<br>');
    const type = extractType(spreadData[0]);
    const address = extractAddress(spreadData[2]);
    const owner = extractOwner(spreadData[3]);
    const sign_date = extractSignDate(spreadData[4]);
    const active_date = extractActiveDate(spreadData[5]);
    const image = extractPhoneImg(spreadData[6]) || url;
    const status = extractStatus(spreadData[7]);
    const phone = '';
    const companyInfo = { name, type, tax_code, address, owner, sign_date, active_date, status, image, phone, data_raw };
    console.log(companyInfo);
  } catch (err) {
    console.log(err);
  }
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("Db Connected. Ready for crawler.");
  execute();
});