class iextradingAPI {
    apiURL = 'https://api.iextrading.com/1.0/';
    socket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/tops')
    subscribedSymbols = [];
    
    tops(symbols, callback) {
        // Create a request variable and assign a new XMLHttpRequest object to it.
        var request = new XMLHttpRequest()
    
        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', this.apiURL + '/tops?&symbols=' + symbols.join(), true)
    
        request.onload = function() { 
            callback(iextradingAPI._parseResponse(request.response)); 
        };
        request.send()
    }

    subToTopsStream(symbols) {
        if (typeof symbols === "string") {
            this.socket.emit('subscribe', symbols);
            this.subscribedSymbols.push(symbols);
        } else { // array of symbols
            this.socket.emit('subscribe', symbols.join());
            this.subscribedSymbols.concat(symbols);
        }
    }

    unsubFromTopsStream(symbols) {
        if (typeof symbols === "string") {
            this.socket.emit('subscribe', symbols);
            this.subscribedSymbols.splice(this.subscribedSymbols.indexOf(symbols), 1 );
        } else { // array of symbols
            this.socket.emit('subscribe', symbols.join());
            for( var i = this.subscribedSymbols.length-1; i--;){
                if (symbols.includes(this.subscribedSymbols[i])) this.subscribedSymbols.splice(i, 1);
            }
        }
    }

    registerStreamCallback(cb) {
        this.socket.on('message', message => cb(JSON.parse(message)));
    }
    
    static _parseResponse(data){
        return JSON.parse(data)[0];
    }
}

module.exports = {
    api: iextradingAPI
};