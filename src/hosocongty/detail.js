const cheerio = require('cheerio'); // khai báo module cheerio
const mysql = require('mysql');
const request = require('request-promise'); // khai báo module request-promise

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company_info"
});

const cfDecodeEmail = (encodedString) => {
  var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
  for (n = 2; encodedString.length - n; n += 2){
    i = parseInt(encodedString.substr(n, 2), 16) ^ r;
  email += String.fromCharCode(i);
  }
  return email;
}

const extractCompanyFromLink = async (link, url) => {
  try {
    console.log('Start crawler: ', url);
    const response = await request(url);
    const $ = cheerio.load(response);
    let name = '';
    let tax_code = '';
    let address = '';
    let owner = '';
    let email = '';
    let phone = '';
    let active_date = '';
    let description = '';
    let status = '';
    $('.hsct').each((index, el) => {
      if (index === 0) {
        // included: name, address, tax_code
        const liTag = $(el).find('li');
        $(liTag).each((index, el) => {
          if (index === 0) {
            // handle name
            name = $(el).text();
          } else if (index === 1) {
            // handle tax_code
            tax_code = $(el).find('span').text();
          } else if (index === 2) {
            // handle address
            address = $(el).find('span').text();
          }
        })
      } else if (index === 1) {
        // included: owner, phone, active_date, description, status
        const liTag = $(el).find('li');
        $(liTag).each((index, el) => {
          const label = $(el).find('label').text().trim();
          if (label.startsWith('Đạ')) { // handle owner
            owner = $(el).find('span').text();
            return;
          } else if (label.startsWith('Đi')) { // handle phone
            phone = $(el).find('span').text();
            return;
          } else if (label.startsWith('E')) { // handle email
            email = $(el).find('span a').attr('data-cfemail');
            if (email) {
              email = cfDecodeEmail(email).toLowerCase();
            }
            return;
          } else if (label.startsWith('Ngày')) { // handle active_date
            active_date = $(el).find('span').text();
            return;
          } else if (label.startsWith('Ngàn')) { // handle description
            description = $(el).find('span').text();
            return;
          } else if (label.startsWith('T')) { // handle status
            status = $(el).find('span').text();
            return;
          }
        })
      }
    })
    const companyInfo = [link, name, email, tax_code, address, owner, active_date, status, phone, description];
    return companyInfo;
  } catch (err) {
    console.log(err);
  }
}

const getListLinkCompany = async (limit, offset) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT id, link FROM company_link limit ${limit} offset ${offset}`, async function (error, results, fields) {
      if (error) console.log('get error', error);
      const arr = [];
      const prefix = 'https://hosocongty.vn/';
      for (const result of results) {
        const { id, link } = result;
        const url = prefix + link;
        arr.push(extractCompanyFromLink(id, url))
      }
      try {
        resolve(await Promise.all(arr))
      } catch (e) {
        reject(e);
      }
    })
  })
}

const insertCompany = async (data) => {
  return new Promise((resolve, reject) => {
    // { link, name, tax_code, address, owner, active_date, status, phone, description };
    connection.query('INSERT INTO company_info (link, name, email, tax_code, address, owner, active_date, status, phone, description) VALUES ?', [data], (err) => {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("Db Connected. Ready for crawler.");
  connection.query('SELECT COUNT(*) as totalItems FROM company_link', async function (error, results, fields) {
    if (error) console.log('get error');
    const { totalItems } = results[0];

    const limit = 2;
    let offset = 0;
    while (offset < totalItems) {
      console.log(`Crawl offset ${offset}.`)
      const data = await getListLinkCompany(limit, offset);
      try {
        await insertCompany(data);
        console.log(`Insert ${limit} of ${offset} success.`)
      } catch (err) {
        console.log(err);
      }
      offset += limit;
    }
  });


});