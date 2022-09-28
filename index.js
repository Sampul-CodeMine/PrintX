const express = require('express');
const fs = require('fs');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// scrape the page using the url and puppeteer and save as a pdf
app.get('/pdf', async (req, res) => {
  const url = req.body.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  // save the pdf to a file
  fs.writeFile('test.pdf', pdf, (err) => {
    if (err) {
      console.log(err);
    }
  });

  return res.status(200).json({
    message: 'PDF created successfully',
  });
});

// read index.html template and convert to pdf
app.get('/pdf2', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // read the html template inside the public folder
  const html = fs.readFileSync('public/index.html', 'utf8');
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  // save the pdf to a file
  fs.writeFile('test2.pdf', pdf, (err) => {
    if (err) {
      console.log(err);
    }
  });

  return res.status(200).json({
    message: 'PDF created successfully',
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
