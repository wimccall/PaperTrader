// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Watchlist class. Takes care of the list itself and the accompanying UI
var watchlistTable = require('./watchlist');
var watchlistTableClass = watchlistTable.watchlist;
var watchlist = new watchlistTableClass();

// Trading api class
IEXAPI = require('./IEXAPI');
apiClass = IEXAPI.api;
api = new apiClass();

// Search class
search = require('./searchstock');
searchClass = search.search;
search = new searchClass();

// websocket api
api.subToTopsStream(watchlist.getList());
api.registerStreamCallback(updateTickers);

watchlist.initializeTable();

function updateTickers(data) {
    watchlist.updateLastPrice(data.symbol, data.lastSalePrice);
}