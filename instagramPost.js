const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

//Galaxy s9 user agent
const USER_AGENT =  'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36';
const INSTAGRAM_LOGIN_URL = 'https://instagram.com/accounts/login';
const INSTAGRAM_URL = 'https://instagram.com';
const IMAGE_PATH = './instaPosts/teste2.jpg';
const LEGENDA = 'imagem_bala2.jpg'

// VERIFICA SE A IMAGEM EXISTE
if (!fs.existsSync(IMAGE_PATH)) {
  console.log('A imagem selecionada não existe!');
  fail();
}

//RODA O LOKO
run();


async function run() {
  try {
    console.debug('INICIANDO...');

    // puppeteer options
    let options = {
        headless: false,
        defaultViewport: {
            width: 320,
            height: 570,
        },
    };

    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();

    // Set mobile mode
    page.setUserAgent(USER_AGENT);

    await page.goto(INSTAGRAM_LOGIN_URL);

    await page.waitForSelector("input[name='username']");
    await delay(2500);

    console.debug('Preenchendo usuario e senha');

    let usernameInput = await page.$("input[name='username']");
    let passwordInput = await page.$("input[name='password']");
    await usernameInput.click();
    await page.keyboard.type(process.env.INSTAGRAM_USER, { delay: 150 });
    await passwordInput.click();
    await page.keyboard.type(process.env.INSTAGRAM_PASSWORD, { delay: 200 });


    await page.keyboard.press('Enter')
      .then(console.debug('Entrando...'));

    await page.waitForNavigation();

    console.debug('abrindo instagram home...');
    await page.goto(INSTAGRAM_URL);

    //Seleciona campo de upload de imagem
    await page.waitForSelector("input[type='file']");
    let fileInputs = await page.$$('input[type="file"]');
    let input = fileInputs[fileInputs.length - 1];

    // Enviando imagem
    console.debug('Carregando imagem...');

    const futureFileChooser = page.waitForFileChooser();

    if(await page.waitForXPath("//button[contains(text(),'Cancelar')]")){
      let cancel = await page.$x("//button[contains(text(),'Cancelar')]");
      await cancel[0].click();
    }
    
    await page.click('[aria-label="Nova publicação"]')
      .then(console.log('Criando post...'));
    fileChooser = await futureFileChooser;
    await fileChooser.accept([IMAGE_PATH]);
    await delay(2500);
    await input.uploadFile(IMAGE_PATH);
    await delay(2500);

    await page.waitForXPath("//button[contains(text(),'Avançar')]");
    let next = await page.$x("//button[contains(text(),'Avançar')]");
    await next[0].click()

    //Adiciona uma legenda para a imagem
    await page.waitForSelector("textarea[aria-label='Escreva uma legenda...']");
    await page.click("textarea[aria-label='Escreva uma legenda...']");
    await page.keyboard.type(LEGENDA, { delay: 50 })
      .then(console.debug('Escrevendo legenda...'));

    // Compartilhando imagem
    await page.waitForXPath("//button[contains(text(),'Compartilhar')]");
    let share = await page.$x("//button[contains(text(),'Compartilhar')]");
    await share[0].click()
      .then(console.debug('Compartilhando...'));

    console.debug('Feito, meu primo!');
    await delay(6000);

    await browser.close();

    console.log('Cabou bixo!');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

function fail() {
  process.exit(1);
}

/**
 * Delays the code execution
 * @param {number} timeout
 * @returns {Promise}
 */
function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}