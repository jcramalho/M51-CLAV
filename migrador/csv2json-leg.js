const csvFilePath = "leg-utf8.csv"
const csv = require('csvtojson')
var count = 1

// Por omissão, a primeira linha é a lista de chaves
csv({delimiter:";"})
  .fromFile(csvFilePath)
  .on('json', (jsonObj, rowIndex)=> {
    console.log("###  http://jcr.di.uminho.pt/m51-clav#leg_" + count)
    console.log(":leg_" + count + " rdf:type owl:NamedIndividual ,")
    console.log("\t:Legislacao ;")
    console.log("\t:diplomaAno :" + "\"" + jsonObj['Ano do diploma'] + "\";")
    console.log("\t:diplomaTipo :" + "\"" + jsonObj['Tipo de diploma'] + "\";")
    console.log("\t:diplomaNumero :" + "\"" + jsonObj['Numero do diploma'] + "\";")
    console.log("\t:diplomaData :" + "\"" + jsonObj['Data do diploma'] + "\";")
    console.log("\t:diplomaTitulo :" + "\"" + jsonObj['Título / âmbito do diploma'] + "\";")
    // Atenção ao último triplo, tem que terminar em .
    console.log("\t:diplomaLink " + "\"" + jsonObj['Link'] + "\".")
    console.log("\n")
    count++
} )
  .on('done', (error)=> {
    console.log('### Finito!')
  })


