// Handles the search bar data and UI. 
// This class is very tightly coupled to the api interface.

class stockSearch {
    tickerInfo;
    constructor() {
        this.updateTickerList();
    }
    updateTickerList() {
        api.refDataSymbols(this._updateTickerListCB.bind(this))
    }
    _updateTickerListCB(data) {
        this.tickerInfo = data;
    }
}

module.exports = {
    search: stockSearch
};