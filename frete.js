const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

app.get('/frete', async (req, res) => {
  const { dest } = req.query;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://melhorenvio.com.br/');
    console.log('Carregando...');

    await page.type('#from', '65604000');
    await page.type('#to', dest);
    await page.evaluate(() => document.querySelector('#calculate').click());

    console.log('Calculando frete...');

    await page.waitForSelector('[class="calculator-cards-mobile"]');

    const data = await page.evaluate(_ =>
      Array.from(
        document.querySelectorAll(
          '#calculator > div > div > div.calculator-cards-mobile > div > div > div > p.final-price.final-text'
        )
      ).map(e => {
        return {
          empresa: e.parentNode.parentNode.parentNode.childNodes[0].children[0].children[0].getAttribute('alt'),
          modalidade: e.parentNode.parentNode.firstElementChild.children[1].innerText,
          prazo: e.parentNode.parentNode.children[1].children[1].innerText,
          prices: e.innerText,
        };
      })
    );
    res.json({ data });
    browser.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// const puppeteer = require('puppeteer');
// const express = require('express');
// const rateLimit = require("express-rate-limit");
// const cache = require("node-cache");
// const { check, validationResult } = require("express-validator");
// const log4js = require('log4js');
// const log = log4js.getLogger();

// log4js.configure({
//   appenders: { cheese: { type: 'file', filename: 'errors.log' } },
//   categories: { default: { appenders: ['cheese'], level: 'error' } }
// });

// const myCache = new cache({stdTTL: 600});
// const app = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests, please try again later"
// });

// let browser;
// const launchBrowser = async () => {
//   browser = await puppeteer.launch({ headless: true });
// };
// launchBrowser();

// app.use(limiter);

// app.get(
//   '/frete',
//   [
//     check("dest")
//       .isLength({ min: 8, max: 8 })
//       .withMessage("CEP de destino deve ter 8 caracteres")
//       .isNumeric()
//       .withMessage("CEP de destino deve ser numérico")
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { dest } = req.query;
//     const cacheData = myCache.get(dest);
//     if(cacheData){
//       return res.json({ data });
//     }
//     try {
//       const page = await browser.newPage();
//       await page.goto('https://melhorenvio.com.br/');
//       await page.type('#from', '65400000');
//       await page.type('#to', dest);
//       await page.evaluate(() => document.querySelector('#calculate').click());

//       await page.waitForSelector('[class="calculator-cards-mobile"]');

//       const data = await page.evaluate(_ =>
//         Array.from(
//           document.querySelectorAll(
//             '#calculator > div > div > div.calculator-cards-mobile > div > div > div > p.final-price.final-text'
//           )
//         ).map(e => {
//           return {
//             empresa: e.parentNode.parentNode.parentNode.childNodes[0].children[0].children[0].getAttribute('alt'),
//             modalidade: e.parentNode.parentNode.firstElementChild.children[1].innerText,
//             prazo: e.parentNode.parentNode.children[1].children[1].innerText,
//             prices: e.innerText,
//           };
//         })
//       );
//       myCache.set(dest, data);
//       res.json({ data });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     });

