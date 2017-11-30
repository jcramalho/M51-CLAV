const csv = require('csvtojson')
const fs = require('fs')
require("console-sync")

// As organizações vão ser carregadas num array para validações posteriores
var orgs = []
// Processamento das Organizações ....................
var csvFilePath = "../dados/org-utf8.csv"
// Ficheiro de saída
var fout = '../dados/ontologia/org.ttl'

// Header
fs.writeFileSync(fout, '### Organizações\n')

// Variáveis auxiliares
var sigla = ""

console.log('Organizações: Comecei a processar')

csv({delimiter:";"})
    .fromFile(csvFilePath)
    .on('json', (jsonObj, rowIndex)=> {
        sigla = jsonObj['Sigla'].replace(/\.|\,/gm,"_").replace(/ /gm,"_")
        orgs.push(sigla)

        if(jsonObj['Tipologia']==='Organismo'){
            var currentStatements = "###  http://jcr.di.uminho.pt/m51-clav#org_" + sigla + '\n'
            currentStatements += ":org_" + sigla + " rdf:type owl:NamedIndividual ,\n"
            currentStatements += "\t:Organizacao ;\n"
        }
        else if(jsonObj['Tipologia']==='Conjunto de organismos'){
            var currentStatements = "###  http://jcr.di.uminho.pt/m51-clav#conj_org_" + sigla + '\n'
            currentStatements += ":conj_org_" + sigla + " rdf:type owl:NamedIndividual ,\n"
            currentStatements += "\t:ConjuntoOrganizacoes ;\n"
        }
        else if(jsonObj['Tipologia']==='Tipologia de organismo'){
            var currentStatements = "###  http://jcr.di.uminho.pt/m51-clav#tipol_org_" + sigla + '\n'
            currentStatements += ":tipol_org_" + sigla + " rdf:type owl:NamedIndividual ,\n"
            currentStatements += "\t:TipologiaOrganizacao ;\n"
        }
        else{
            console.log('ERRO: Tipologia; ' + sigla )
        }
        
        currentStatements += "\t:orgSigla " + "\"" + sigla + "\";\n"
        if(jsonObj['AP'].trim()==='AP'){
            currentStatements += "\t:pertenceConjOrg " + ":conj_org_AP;\n"
        }
        // Atenção ao último triplo, tem que terminar em .
        currentStatements += "\t:orgNome " + "\"" + jsonObj['Designação'] + "\".\n"

        fs.appendFileSync(fout, currentStatements)
    })
    .on('error',(err)=>{
        console.log(err)
    })
    .on('end', ()=>{
        console.log('Organizações: terminei.');
    })
    .on('done', ()=>{
        fs.appendFileSync(fout, '\n### Organizações terminam aqui.\n\n')
        fs.writeFileSync("../dados/org.json", JSON.stringify(orgs, null, 2))
    })





