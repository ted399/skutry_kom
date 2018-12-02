const puppeteer = require("puppeteer");

module.exports = scraperSbazar();

//scrape data
async function scraperSbazar() {
//Get the offers on the first page, then recursievely check the next page in the URL pattern
    const getOffers = async(url) => {
    const page = await browser.newPage();
    await page.goto(url);

    console.log(`scraping: ${url}`)



    //Scrape data
    const offersOnPage = await page.evaluate(
        () => Array.from(document.querySelectorAll("div.c-item__box--has-link"))
          .map(offer => {
            const image = offer.querySelector('span.c-item__image img')
            const location = offer.querySelector('div.c-item__group > div.c-item__attrs > span.c-item__locality')
            return ({
              source: 'sbazar',
              title: offer.querySelector('div.c-item__name > span').innerText.trim(),
              price: offer.querySelector('div.c-item__group > div.c-item__attrs > span.c-price > b').innerText.trim(),
              image: image ? image.src : '',
              location: location ? location.innerText.trim() : '',
              link: offer.querySelector('div.c-item__group > a.c-item__link').href
            })
          }
        )
      );

    await page.close();

    //End recursion?
    if(offersOnPage.length < 1) {
    console.log(`terminate recursion on: ${url}`);
    return offersOnPage
    }
    else {
      //Go to the next page and scrape it
      //Get next page
      const nextPageNumber = parseInt(/[^/]*$/.exec(url)[0], 10) + 1
      const nextUrl = `https://www.sbazar.cz/87-skutry/cena-neomezena/nejnovejsi/nejnovejsi/${nextPageNumber}`
      return offersOnPage.concat(await getOffers(nextUrl))
    }

}
const browser = await puppeteer.launch();

const url = "https://www.sbazar.cz/87-skutry/cena-neomezena/nejnovejsi/nejnovejsi/17";


const offers = await getOffers(url);

await browser.close();

return offers;
};
