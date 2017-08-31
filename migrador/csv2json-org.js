const csvFilePath = "org-utf8.csv"
const csv = require('csvtojson')
// Header
console.log("### Organizações")
console.log("\n")
// Por omissão, a primeira linha é a lista de chaves
csv({delimiter:";"})
  .fromFile(csvFilePath)
  .on('json', (jsonObj, rowIndex)=> {
    console.log("###  http://jcr.di.uminho.pt/m51-clav#org_" + jsonObj['Sigla'])
    console.log(":org_" + jsonObj['Sigla'] + " rdf:type owl:NamedIndividual ,")
    console.log("\t:Organizacao ;")
    console.log("\t:orgSigla " + "\"" + jsonObj['Sigla'] + "\";")
    // Atenção ao último triplo, tem que terminar em .
    console.log("\t:orgNome " + "\"" + jsonObj['Entidade'] + "\".")
    console.log("\n")
} )
  .on('done', (error)=> {
    console.log('### Finito!')
  })


