const csv = require('csvtojson')
const fs = require('fs')
const async = require('async');
// Migradores modulares
var org = require("./mod-org.js")
var ti = require("./mod-ti.js")
var leg = require("./mod-leg.js")

// ------------------ Controlador principal ----------------------------------

async.series([
    /*function(callback) {
        var myOrgs = org.migraOrg(callback)
    },

    function(callback) {
       ti.migraTI(callback)
    },*/

    function(callback) {
        leg.migraleg(callback)
    }
],
// optional callback
function(err, results) {
    // results is now equal to ['one', 'two']
});

// ------------------ Fim do Controlador principal ----------------------------------









