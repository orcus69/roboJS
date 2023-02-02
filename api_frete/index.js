const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

app.get('/frete', async (req, res) => {
  const { dest } = req.query;

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://melhorenvio.com.br/');
    console.log('Carregando...');

    await page.type('#from', '65604000');
    await page.type('#to', dest);
    await page.evaluate(() => document.querySelector('#calculate').click());

    await page.waitForSelector('[class="calculator-cards-mobile"]');

    const data = await page.evaluate(_ =>
        Array.from(
            document.querySelectorAll("#calculator > div > div.calculator-table-container > div.calculator-cards-mobile > div > div.shipping-text-info > div.shipping-price-info > div > p.final-price.final-text")

        ).map(e => {
            return {
                empresa: e.parentNode.parentNode.parentNode.parentNode.childNodes[0].children[0].children[0].getAttribute('alt'),
                modalidade: e.parentNode.parentNode.parentNode.firstElementChild.children[1].innerText,
                prazo: e.parentNode.parentNode.parentNode.children[1].children[1].innerText,
                prices: e.innerText
            }
        })
    );
    
    browser.close();

    return res.json({ data });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}
);
