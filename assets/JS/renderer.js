// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// For now, I am using global instances of my classes for ease of use 
// ** GLOBAL VARIABLES ** 

// Watchlist class. Takes care of the list itself and the accompanying UI
var { watchlist } = require("../JS/watchlist");

// Search class
var { search } = require('../JS/searchstock');



function _titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

// ** RENDERER **
watchlist.initializeTable();