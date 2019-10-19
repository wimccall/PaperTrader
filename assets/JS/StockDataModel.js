// This class will be the global source or truth for the data used by this application.
// All data is sourced from the api class.

// Trading api class
var { api } = require('../JS/IEXAPI');

// Reactor
var { reactor } = require('../JS/EventReactor')

class Stock {
    symbol;
    name;
    lastSalePrice;
    volume;
    constructor() {
        this.lastSalePrice = 0.0;
        this.volume = 0;
    }
}

class StockData {
    stockInfo = [];
    constructor() {
        this.updateTickerList();
        reactor.registerEvent('stockUpdated');
        
        api.registerStreamCallback(this.updateStockInfo.bind(this));
    }

    updateTickerList() {
        api.refDataSymbols(this._updateTickerListCB.bind(this))
    }

    _updateTickerListCB(data) {
        for(var stock of data) {
            this.addStockToStockInfo(stock);
        }
    }

    addToWatchedStocks(ticker) {
        api.subToTopsStream(ticker);
    }

    removeFromWatchedStocks(ticker) {
        api.unsubFromTopsStream(ticker);
    }

    addStockToStockInfo(data) {
        if (!data) return;
        var stock = new Stock();
        var insertIndex = -1;
        if (data.symbol != null) {
            stock.symbol = data.symbol;
            insertIndex = this._binarySearchStockInfo(data.symbol);
            if(this.stockInfo[insertIndex] != null && this.stockInfo[insertIndex].symbol == data.symbol) {
                this.updateStockInfo(data);
                return; // Do not create duplicate symbols
            }
        } else {
            return; // Do not push a stock with no symbol
        }
        if (data.name != null) {
            stock.name = data.name;
        }
        if (data.lastSalePrice != null) {
            stock.lastSalePrice = data.lastSalePrice;
        }
        if (data.volume != null) {
            stock.volume = data.volume;
        }
        this.stockInfo.splice(insertIndex, 0, stock);
    }

    updateStockInfo(data) {
        if (data.symbol == null) return;
        var index = this._binarySearchStockInfo(data.symbol);
        if (this.stockInfo[index] == null) return;

        if (data.lastSalePrice != null) this.stockInfo[index].lastSalePrice = data.lastSalePrice;
        if (data.volume != null) this.stockInfo[index].volume = data.volume;
        if (data.name != null) this.stockInfo[index].name = data.name;

        reactor.dispatchEvent('stockUpdated', this.stockInfo[index]);
    }

    _binarySearchStockInfo(tickerSymbol) {
        var L = 0;
        var R = this.stockInfo.length - 1;
        while(L != R && R >= 0) {
            var m = Math.ceil((L + R) / 2);
            if (this.stockInfo[m].symbol > tickerSymbol) {
                R = m - 1;
            } else {
                L = m;
            }
        }
        return L;
    }
}

var stockData = new StockData();
module.exports = {
    StockData: stockData
};