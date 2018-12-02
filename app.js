const search = instantsearch({
    appId:'SXK0FSVBNK',
    apiKey:'d7a2f527ac530aa740e8f1ca3618ce88',
    indexName:'skutry',
    urlSync: true
});

search.addWidget(
    instantsearch.widgets.searchBox({
        container:'#search-input'
    })
);


search.addWidget(
    instantsearch.widgets.infiniteHits({
        container:'#hits',
        templates:{
            item: document.getElementById('hit-template').innerHTML,
            empty: "Takový skůtr jsme nenašli :("
        },
        escapeHits: true
    })
);

/*
search.addWidget(
    instantsearch.widgets.pagination({
        container:'#pagination'
    })
);
*/


search.start();
