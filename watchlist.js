class watchlistTable {
    tableBody = document.getElementById("watchlistBody");
    _watchList = ["WMT", "XOM", "AAPL", "BRK.B", "AMZN", "UNH", "MCK", "CVS", "T", "ABC"];
    
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
    }

    // TODO: cache tickers in a map for quicker access instead of alway looking them up
    updateLastPrice(tickerName, price) {
        document.getElementById("watchlistTickerPrice" + tickerName).innerHTML = price;
    }

    initializeTable() {
        for (var ticker of this._watchList) {
            this.insertRow(ticker);
        }
    }

    getList() {
        return this._watchList;
    }
}

module.exports = {
    watchlist: watchlistTable
};