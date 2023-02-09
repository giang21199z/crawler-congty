const cheerio = require('cheerio'); // khai báo module cheerio
const mysql = require('mysql');
const request = require('request-promise'); // khai báo module request-promise

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company_info"
});

const totalPage = 30529;
const size = 50;
const execute = async () => {
  for (let page = 1; page <= totalPage; page++) {
    console.log('Start crawler page: ', page);
    try {
      const response = await request('https://www.tratencongty.com/');
      console.log(`Get page ${page} success`);
      const $ = cheerio.load(response);
      $('.search-results').each((index, el) => {
        const aTagCompany = $(el).find('a');
        const name = aTagCompany.text();
        const link = aTagCompany.attr('href');
        const source = 1;

        const companyInfo = { name, link, source };
        connection.query('INSERT INTO company_link SET ?', companyInfo, function (error, results, fields) {
          if (error) {
            console.log(`Error insert company:`, JSON.stringify(companyInfo));
          }
          console.log(`Inserted ${(page - 1) * size + index + 1} success`);
        });
      })
    } catch (err) {
      console.log('Error crawler page: ', page);
    }
    console.log('Finish crawler page: ', page);
  }
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("Db Connected. Ready for crawler.");
  execute();
});