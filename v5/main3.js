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
                /*classe.migraClasse(orgCatalog, legCatalog, '100')
                classe.migraClasse(orgCatalog, legCatalog, '150')
                classe.migraClasse(orgCatalog, legCatalog, '200')
                classe.migraClasse(orgCatalog, legCatalog, '250')
                classe.migraClasse(orgCatalog, legCatalog, '300')
                classe.migraClasse(orgCatalog, legCatalog, '350')
                classe.migraClasse(orgCatalog, legCatalog, '400')
                classe.migraClasse(orgCatalog, legCatalog, '450')
                classe.migraClasse(orgCatalog, legCatalog, '500')
                classe.migraClasse(orgCatalog, legCatalog, '550')*/
                classe.migraClasse(orgCatalog, legCatalog, '600')
                /*classe.migraClasse(orgCatalog, legCatalog, '650')
                classe.migraClasse(orgCatalog, legCatalog, '700')
                classe.migraClasse(orgCatalog, legCatalog, '710')
                classe.migraClasse(orgCatalog, legCatalog, '750')
                classe.migraClasse(orgCatalog, legCatalog, '800')
                classe.migraClasse(orgCatalog, legCatalog, '850')
                classe.migraClasse(orgCatalog, legCatalog, '900')
                classe.migraClasse(orgCatalog, legCatalog, '950')*/

                // ------------------ Fim do Controlador principal ----------------------------------            
            }
        })
    }
  })









