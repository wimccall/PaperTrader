// This class controls the watchlist UI as well as the data maintenance.

class watchlistTable {
    tableBody = document.getElementById("watchlistBody");
    table = document.getElementById("watchlist");
    _watchList = ["WMT", "XOM", "AAPL", "BRK.B", "AMZN", "UNH", "MCK", "CVS", "T", "ABC"];
    _priceElements = new Map();
    
    insertRow(tickerName) {
        let tr = this.tableBody.insertRow(-1);
        let td1 = document.createElement("td");
        td1.id = "watchlistTickerName" + tickerName;
        let text = document.createTextNode(tickerName);
        td1.appendChild(text);
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        td2.id = "watchlistTickerPrice" + tickerName;
        tr.appendChild(td2);
        this._priceElements.set(tickerName, td2);
        let td3 = document.createElement("td");
        var btn = document.createElement("BUTTON");
        btn.addEventListener("click", function () { 
            this.removeRow(tickerName);
            api.unsubFromTopsStream(tickerName);
            this._watchList.splice(this._watchList.indexOf(tickerName), 1 );
        }.bind(this) );
        btn.innerHTML = "-";   
        td3.appendChild(btn);
        tr.appendChild(td3);
    }

    removeRow(tickerName) {
        let tr = document.getElementById("watchlistTickerName" + tickerName).parentElement;
        this.table.deleteRow(tr.rowIndex);
        this._priceElements.delete(tickerName);
    }

    updateLastPrice(stock) {
        if (this._watchList.includes(stock.symbol)) 
            this._priceElements.get(stock.symbol).innerHTML = stock.lastSalePrice;
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