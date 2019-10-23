// Handles the search bar data and UI. 

// Watchlist
var { watchlist } = require("../JS/watchlist");

// StockDataModel
var { StockData } = require('../JS/StockDataModel')

// Utils
var { Utils } = require('../JS/utils')


class stockSearch {
    searchBar;
    searchList;
    constructor() {
        this.searchBar = document.getElementById('tickerSearcher');
        this.searchBar.onkeyup =  this.fillListWithResults.bind(this); 
        this.searchList = document.getElementById('searchList');
    }

    fillListWithResults() {
        var results = this.searchResults(this.searchBar.value);
        if (!results) {
            this.searchList.style.display = "none";
            return;
        }
        this.searchList.innerHTML = "";
        for (var result of results) {
            this._insertResult(result);
        }
        this.searchList.style.display = "block";
    }

    _insertResult(result) {
        var li = document.createElement('li');
        li.innerHTML += Utils._titleCase(result.name);
        li.classList.add("list-group-item");
        li.classList.add("bg-light");
        li.classList.add("justify-content-between");
        li.classList.add("d-flex");
        li.addEventListener("click", function () {
            this.resultClicked(result.symbol)
        }.bind(this));
        var spanSymbol = document.createElement('span'); 
        spanSymbol.classList.add("badge");
        spanSymbol.classList.add("badge-primary");
        spanSymbol.classList.add("badge-pill");
        spanSymbol.innerText = result.symbol;
        li.appendChild(spanSymbol);
        this.searchList.appendChild(li);
    }

    resultClicked(ticker) {
        this.searchList.style.display = "none";
        this.searchList.innerHTML = "";
        this.searchBar.value = "";
        watchlist.addToWatchlist(ticker);
    }

    searchResults(str) {
        if (!str) return;
        str = str.toUpperCase();
        var results = [];

        // First, get stocks by their symbol
        var index = StockData._binarySearchStockInfo(str);
        var i = 0;

        // This should only be true in an exact match, I think...
        if (StockData.stockInfo[index + i].symbol.startsWith(str))
            results.push(StockData.stockInfo[index + i]);
        while(true) {
            i++;
            if (!StockData.stockInfo[index + i].symbol.startsWith(str)) break;
            if(!StockData.stockInfo[index + i].name) continue;
            results.push(StockData.stockInfo[index + i]);
            if (i >= 10) break;
        }

        // If we don't already have 10 results, look by name
        if (results.length < 10) {
            var nameResults = StockData.stockInfo.filter(x => x.name.startsWith(str));
            nameResults = nameResults.filter(function(e) {
                return !(results.some(x => x.symbol == e.symbol));
            })
            results = results.concat(nameResults);
            results = results.slice(0, 10);
        }
        return results;
    }

}

var searchExport = new stockSearch();
module.exports = {
    search: searchExport
};