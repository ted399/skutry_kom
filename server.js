const dotenv = require('dotenv');
const express = require('express');
const app = express();
const path = require('path');
const scraper = require('./scraper.js');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/scrape', function(req, res) {
    scrape();
});

app.use(express.static('public'));

app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});
