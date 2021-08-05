const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

(async ()=>{
    const browser =  await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const dest = readlineSync.question('CEP Destino: ') || '65400000';

    const price = '';

    await page.goto(`https://melhorenvio.com.br/`);

    console.log('Carregando...');


    await page.type('#from', '65400000');
    await page.type('#to', dest);

    await page.type('#height', '4');
    await page.type('#weight', '0,3');

    await page.evaluate( () => document.querySelector('#calculate').click('enter'));

    console.log('Calculando frete...');

    await page.waitForSelector('[class="calculator-cards-mobile"]');
    

    const empresas = await page.evaluate(_ => 
        Array.from(document.querySelectorAll("#calculator > div > div > div.calculator-cards-mobile > div > div > div > p.final-text"))
            .map(e => e.innerText)
        
    );

    const prices =  await page.evaluate(_=>
        Array.from(document.querySelectorAll("#calculator > div > div > div.calculator-cards-mobile > div > div > div > p.final-price.final-text"))
            .map(e => e.innerText)
    );
    
    console.log(empresas);
    console.log(prices);
    


    browser.close
})();