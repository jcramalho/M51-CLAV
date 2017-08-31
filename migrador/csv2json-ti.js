const csvFilePath = "ti-utf8.csv"
const csv = require('csvtojson')
var count = 1
// Header
console.log("### Termos de Índice")
console.log("\n")
// Por omissão, a primeira linha é a lista de chaves
csv({delimiter:";"})
  .fromFile(csvFilePath)
  .on('json', (jsonObj, rowIndex)=> {
    var cod = "c" + jsonObj['Código']
    
    console.log("###  http://jcr.di.uminho.pt/m51-clav#ti_" + count)
    console.log(":ti_" + count + " rdf:type owl:NamedIndividual ,")
    console.log("\t:TermoIndice ;")
    console.log("\t:estaAssocClasse :" + cod + ";")
    // Atenção ao último triplo, tem que terminar em .
    console.log("\t:termo " + "\"" + jsonObj['Termo'] + "\"" + ".")
    console.log("\n")
    count++
    tiCode = "ti_" + count
} )
  .on('done', (error)=> {
    console.log('### Finito! Processamento das classes terminado.')
  })
