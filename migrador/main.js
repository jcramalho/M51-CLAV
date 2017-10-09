const csv = require('csvtojson')
const fs = require('fs')
const async = require('async');

// Migradores modulares
var org = require("./mod-org2.js")
var ti = require("./mod-ti.js")
var leg = require("./mod-leg2.js")
var classe = require("./mod-classe.js")

// ------------------ Controlador principal ----------------------------------

async.series([
    function(callback){
        ti.migraTI(callback)
    }
    ,
    function(callback){
        org.migraOrg(callback)
    }
    ,
    function(callback){
        leg.migraLeg(callback)
    }
],
    function(err, results){
        console.dir(results[1])
        console.log("#########################################")
        console.dir(results[2])
    }
    
)


// ------------------ Fim do Controlador principal ----------------------------------









