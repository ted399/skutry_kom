const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');
const express = require('express')
const path = require('path');
const PORT = process.env.PORT || 5000
const app = express();

express().listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(express.static('public'));
app.get('*', (request, response) => {
response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// load values from the .env file in this directory into process.env
dotenv.load();

// configure firebase
firebase.initializeApp({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const database = firebase.database();

// configure algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);


    //add both Scrapers
    const scraperBazos = require('./scraperBazos.js');
    const scraperSbazar = require('./scraperSbazar.js');

    (async () => {
      //Run both scrapers
      const offersBazos = await scraperBazos;
      const offersSbazar = await scraperSbazar;

      //Combine scrape data from both scrapers into one array of objects
      //var offers = offersBazos.concat(offersSbazar);
      function m(a, b) {
        const l = Math.max(a.length, b.length);
        const result = [];
        for (let i = 0; i < l; i++) {
          if (a[i] !== undefined) {
            result.push(a[i]);
          }
          if (b[i] !== undefined) {
            result.push(b[i]);
          }
        }

        //console.log(result);
        return result;
      };

      const offers = m(offersBazos, offersSbazar)

      //Start process of pushing the whole array of objects into firebae and then into algolia

      //Remove all data from firebase ref
      database.ref('/skutry_novy').remove();
      //Push newly scraped data into firebase
      for(i=offers.length; i >= 0; i--) {
          database.ref('/skutry_novy').push(offers[i]);
      }

      //Algolia
      //Delete all the data from an Index
      await index.clearIndex()

      // Get all contacts from Firebase
      database.ref('/skutry_novy').once('value', contacts => {
        // Build an array of all records to push to Algolia
        const records = [];
        contacts.forEach(contact => {
          // get the key and data from the snapshot
          const childKey = contact.key;
          const childData = contact.val();
          // We set the Algolia objectID as the Firebase .key
          childData.objectID = childKey;
          // Add object for indexing
          records.push(childData);
        });



        // Add or update new objects
        index
          .saveObjects(records)
          .then(() => {
            console.log('Contacts imported into Algolia');
            process.exit();
          })
          .catch(error => {
            console.error('Error when importing contact into Algolia', error);
            process.exit(1);
          });
      });

    })();
