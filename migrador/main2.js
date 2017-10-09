const csv = require('csvtojson')
const fs = require('fs')

// Carregamento das organizações para verificação
var jfile = require("jsonfile")
var file = "../dados/org.json"

var orgCatalog = jfile.readFileSync(file)


// Carregamento da legislação para verificação
var file = "../dados/leg.json"

var legCatalog = jfile.readFileSync(file)

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









