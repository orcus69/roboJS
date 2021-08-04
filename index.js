const puppeteer = require('puppeteer');
const fs = require('fs').promises;
require('dotenv').config();

(async ()=>{
    const browser =  await puppeteer.launch({headless: false, userDataDir: './user_data'});
    const page = await browser.newPage();
    const text = 'Mensagem advinda de um bot com javaScript';

    await page.goto(`https://web.whatsapp.com/send?phone=${process.env.REACT_APP_PHONE_NUMBER}&text=${text}&app_absen`);

    console.log('Carregando...');
    await page.waitForTimeout(500);
    await page.waitForSelector('._1UWac._1LbR4').then(async ()=>{
        await page.evaluate(() => {
            return document.querySelector('._4sWnG').click();
        }).then(()=> console.log('Mensagem enviada'));
    });
    
    


    browser.close
})();