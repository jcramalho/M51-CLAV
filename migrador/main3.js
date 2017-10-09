const csv = require('csvtojson')
const fs = require('fs')
require("console-sync")

// Carregamento das organizações para verificação
var jfile = require("jsonfile")
var file = "../dados/org.json"

jfile.readFile(file, function(err, orgCatalog) {
    if(err)
        console.log(err)
    else{
        var file = "../dados/leg.json"
        jfile.readFile(file, function(err, legCatalog){
            if(err)
                console.log(err)
            else{
                // Migradores modulares
                var ti = require("./mod-ti2.js")
                var classe = require("./mod-classe.js")

                // ------------------ Controlador principal ----------------------------------

                ti.migraTI()
                classe.migraClasse(orgCatalog, legCatalog, '100')
                classe.migraClasse(orgCatalog, legCatalog, '150')
                classe.migraClasse(orgCatalog, legCatalog, '200')
                classe.migraClasse(orgCatalog, legCatalog, '350')

                // ------------------ Fim do Controlador principal ----------------------------------            
            }
        })
    }
  })









