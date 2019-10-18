// This class controls the watchlist UI as well as the data maintenance.

// Trading api class
var { api } = require('../JS/IEXAPI');

// Reactor
var { reactor } = require('../JS/EventReactor')

// StockDataModel
var { StockData } = require('../JS/StockDataModel')

class watchlistTable {
    tableBody = document.getElementById("watchlistBody");
    table = document.getElementById("watchlist");
    _watchList = ["WMT", "XOM", "AAPL", "BRK.B", "AMZN", "UNH", "MCK", "CVS", "T", "ABC"];
    _priceElements = new Map();
    _nameElements = new Map();

    
    insertRow(tickerName) {
        StockData.addToWatchedStocks(tickerName);
        let tr = this.tableBody.insertRow(-1);
        let td1 = document.createElement("td");
        td1.id = "watchlistTickerSymbol" + tickerName;
        let text = document.createTextNode(tickerName);
        td1.appendChild(text);
        tr.appendChild(td1);
        let td3 = document.createElement("td");
        td3.id = "watchlistTickerName" + tickerName;
        tr.appendChild(td3);
        this._nameElements.set(tickerName, td3);
        let td2 = document.createElement("td");
        td2.id = "watchlistTickerPrice" + tickerName;
        tr.appendChild(td2);
        this._priceElements.set(tickerName, td2);
        let td4 = document.createElement("td");
        var btn = document.createElement("BUTTON");
        btn.classList.add("btn");
        btn.classList.add("btn-outline-danger");
        btn.addEventListener("click", function () { 
            this.removeRow(tickerName);
            api.unsubFromTopsStream(tickerName);
            this._watchList.splice(this._watchList.indexOf(tickerName), 1 );
        }.bind(this) );
        btn.innerHTML = "-";   
        td4.appendChild(btn);
        tr.appendChild(td4);
    }

    addToWatchlist(ticker) {
        if (this._watchList.includes(ticker)) return;
        this._watchList.push(ticker);
        this.insertRow(ticker);
    }

    removeRow(tickerName) {
        let tr = this._priceElements.get(tickerName).parentElement;
        this.table.deleteRow(tr.rowIndex);
        this._priceElements.delete(tickerName);
    }

    updateLastPrice(stock) {
        if (!this._watchList.includes(stock.symbol)) return;
        this._priceElements.get(stock.symbol).innerHTML = stock.lastSalePrice;
        this._nameElements.get(stock.symbol).innerHTML = _titleCase(stock.name);
    }

    initializeTable() {
        for (var ticker of this._watchList) {
            this.insertRow(ticker);
        }
        reactor.addEventListener('stockUpdated', this.updateLastPrice.bind(this))
        $("#watchlistBody").sortable();
    }

    getList() {
        return this._watchList;
    }
}

var watchlistExport = new watchlistTable();
module.exports = {
    watchlist: watchlistExport
};