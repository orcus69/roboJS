const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const dest = readlineSync.question('CEP de Destino: ') || '65400000';
    await page.goto(`https://melhorenvio.com.br/`);

    console.log('Carregando...');

    await page.type('#from', '65400000');
    await page.type('#to', dest);
    await page.type('#height', '4');
    //await page.type('#weight', '0,3');

    await page.evaluate(() => document.querySelector('#calculate').click('enter'));

    console.log('Calculando frete...');

    await page.waitForSelector('[class="calculator-cards-mobile"]');

    //Retorna array com dados do frete
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

    console.log(data);

    //browser.close()
})();