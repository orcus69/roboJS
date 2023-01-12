const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

(async ()=>{
    const browser =  await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const sl = readlineSync.question('Traduzir de: ') || 'ingles';
    const tl = readlineSync.question('para: ') || 'Portugues';

    const text = readlineSync.question('Frase: ') || 'Mensagem advinda de um bot com javaScript';

    await page.goto(`https://www.google.com/search?q=${sl}+para+o+${tl}&ei=Qp4KYYngDfbZ1sQP4cajmAU&oq=${sl}+para+o+${tl}&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIGCAAQBxAeMgYIABAHEB4yBggAEAcQHjIGCAAQBxAeSgQIQRgAUM0YWM0YYLEaaABwAngAgAHnAYgBjgOSAQUwLjEuMZgBAKABAcABAQ&sclient=gws-wiz&ved=0ahUKEwiJidiqxJfyAhX2rJUCHWHjCFMQ4dUDCA4&uact=5`);


    await page.waitForSelector('.tw-ta.tw-text-large.XcVN5d.goog-textarea');

    await page.type('.tw-ta.tw-text-large.XcVN5d.goog-textarea', text);
    

    await page.waitForTimeout(600);

    const result = await page.evaluate(() => document.querySelector('.g9WsWb').innerText);

    console.log('Tradução: ' + result);
    
    await browser.close
})();