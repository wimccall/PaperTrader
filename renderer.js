// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var IEXAPI = require('./IEXAPI');
var apiClass = IEXAPI.api;
var api = new apiClass();

window.setInterval(function() {api.tops(['MSFT'], updateTickers) }, 1000);
var MSFTTicker = document.getElementById("MSFTTicker")
var MSFTTickerwebs = document.getElementById("MSFTTickerwebsockets")
api.subToTopsStream('MSFT');
api.registerStreamCallback(updateTickersWS);

function updateTickers(data) {
    MSFTTicker.innerHTML = data.lastSalePrice;
}

function updateTickersWS(data) {
    MSFTTickerwebs.innerHTML = data.lastSalePrice;
}