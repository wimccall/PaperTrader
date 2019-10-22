// This class keeps track of your portfolio(s). It is the ultimate source of truth about your portfolio for this app.

var { StockData } = require('../JS/StockDataModel')

// This class may throw exceptions! See here for exception codes.
//  example: {code: someVal, message: "some message"}
var PortfolioExceptionEnum = {
    DataNotInitialized = 0,
    NotEnoughCash = 1,
}

class PortfolioException {
    code;
    message;
    constructor(exceptionCode, msg) {
        code = exceptionCode;
        message = msg;
    }
}

class PortfolioSecurity {
    ticker;
    amount;
}

class Portfolio {
    cash;
    Securities;
    constructor(cashAmount) {
        cash = (typeof cashAmount === "number") ? cashAmount : 0;
        this.Securities = [];
    }

    purchaseSecurity(ticker, amount) {
        var stock = StockData.getStockData(ticker);
        if (!stock.lastSalePrice) 
            throw new PortfolioException(PortfolioExceptionEnum.DataNotInitialized, "lastSalePrice not initialized for " + ticker);
        var purchasePrice = stock.lastSalePrice * amount;
        if (purchasePrice > cash)
            throw new PortfolioException(PortfolioExceptionEnum.NotEnoughCash, "Not enough purchasing power to make order");

        this.cash -= purchasePrice;
        var security = new PortfolioSecurity(ticker, amount);
        this.Securities.push(security);
    }
}

module.exports = {
    Portfolio: Portfolio
};