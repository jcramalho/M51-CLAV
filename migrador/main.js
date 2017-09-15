const csv = require('csvtojson')
const fs = require('fs')
const async = require('async');
// Migradores modulares
var org = require("./mod-org.js")
var ti = require("./mod-ti.js")
var leg = require("./mod-leg.js")
var classe = require("./mod-classe.js")

var myOrgs = []

// ------------------ Controlador principal ----------------------------------

async.series([
    function(callback) {
        myOrgs = org.migraOrg(callback)  //Organizações
    },

    function(callback) {
       ti.migraTI(callback)                 //Termos de Índice
    },

    function(callback) {
        leg.migraLeg(callback)              //Legislação
    },

    function(callback){
        classe.migraClasse(callback, myOrgs, '100')                                    //Classes
    },
    function(callback){
        classe.migraClasse(callback, myOrgs, '150')                                    //Classes
    }
],
// optional callback
function(err, results) {
    // results is now equal to ['one', 'two']
});

// ------------------ Fim do Controlador principal ----------------------------------









