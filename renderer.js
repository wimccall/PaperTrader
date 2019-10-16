// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Trading api class
var IEXAPI = require('./IEXAPI');
var apiClass = IEXAPI.api;
var api = new apiClass();

// Watchlist class. Takes care of the list itself and the accompanying UI
var watchlistTable = require('./watchlist');
var watchlistTableClass = watchlistTable.watchlist;
var watchlist = new watchlistTableClass();

watchlist.initializeTable();

// websocket api
api.subToTopsStream(watchlist.getList());
api.registerStreamCallback(updateTickers);

function updateTickers(data) {
    watchlist.updateLastPrice(data.symbol, data.lastSalePrice);
}