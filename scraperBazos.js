const puppeteer = require("puppeteer");

module.exports = scraperBazos().listen(process.env.PORT || 8080);

//scrape data
async function scraperBazos() {
//Get the offers on the first page, then recursievely check the next page in the URL pattern
    const getOffers = async(url) => {
    const page = await browser.newPage();
    await page.goto(url);

    console.log(`scraping: ${url}`)



    //Scrape data
    const offersOnPage = await page.evaluate(
    () => Array.from(document.querySelectorAll("table.inzeraty"))
        .map(offer => {
        const image = offer.querySelector('img.obrazek')
        const desc = offer.querySelector('div.popis')
        const location = offer.querySelector('tbody:nth-child(1) td:nth-child(3)')
        return ({
            source: 'bazos',
            title: offer.querySelector('span.nadpis > a').innerText.trim(),
            price: offer.querySelector('span.cena > b').innerText.trim(),
            image: image ? image.src : '',
            location: location ? location.innerText.trim() : '',
            link: offer.querySelector('span.nadpis > a').href
        })
        })
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
    const prettyUrl = url.substring(0, url.length-1);
    const nextPageNumber = parseInt(/[^/]*$/.exec(prettyUrl)[0], 10) + 20
    const nextUrl = `https://motorky.bazos.cz/skutry/${nextPageNumber}/`
    return offersOnPage.concat(await getOffers(nextUrl))
    }

}

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

const url = "https://motorky.bazos.cz/skutry/0/";


const offers = await getOffers(url);

await browser.close();

return offers;
};
