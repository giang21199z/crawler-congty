const cheerio = require('cheerio'); // khai báo module cheerio
const mysql = require('mysql');
const request = require('request-promise'); // khai báo module request-promise

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company_info"
});

const totalPage = 226667;
const size = 12;
const execute = async () => {
  for (let page = 1; page <= totalPage; page++) {
    let count = 1;
    try {
      const url = `https://hosocongty.vn/page-${page}`;
      const response = await request(url);
      console.log(`Get page ${page} success`);
      const $ = cheerio.load(response);
      $('.hsdn li').each((index, li) => {
        const aTag = $(li).find('h3 a');
        if (aTag && $(aTag).attr('href')) {
          const name = $(aTag).text();
          const link = $(aTag).attr('href');
          const source = 2;
          const companyLink = { name, link, source };
          const query = connection.query('INSERT INTO company_link SET ?', companyLink, function (error, results, fields) {
            if (error) {
              console.log(`Error insert company:`, JSON.stringify(companyLink));
            }
            console.log(`Inserted ${(page - 1) * size + (count++)} success`);
          });
        }
      })
    } catch (err) {
      console.log(`Error crawler page: ${page}`, err);
    }
    console.log('Finish crawler page: ', page);
  }
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("Db Connected. Ready for crawler.");
  execute();
});