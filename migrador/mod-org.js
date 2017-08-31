const csv = require('csvtojson')
const fs = require('fs')

const csvFilePath = "../dados/org-utf8.csv"

// As organizações vão ser carregadas num array para validações posteriores
var orgs = []
// Header
console.log("### Organizações")
console.log("\n")

csv({delimiter:";"})
  .fromFile(csvFilePath)
  .on('json', (jsonObj, rowIndex)=> {
    orgs.push(jsonObj['Sigla'])
    console.log("###  http://jcr.di.uminho.pt/m51-clav#org_" + jsonObj['Sigla'])
    console.log(":org_" + jsonObj['Sigla'] + " rdf:type owl:NamedIndividual ,")
    console.log("\t:Organizacao ;")
    console.log("\t:orgSigla " + "\"" + jsonObj['Sigla'] + "\";")
    // Atenção ao último triplo, tem que terminar em .
    console.log("\t:orgNome " + "\"" + jsonObj['Entidade'] + "\".")
    console.log("\n")
  })
  .on('error',(err)=>{
    console.log(err)
  })
  .on('end', ()=>{
      console.warn("Passo 1: Terminei de processar as organizações.")
  })
  .on('done', ()=>{
      console.log('### Organizações terminam aqui')
      console.warn("--> Vou iniciar o processamento dos TI.")
  })

