const csvFilePath = "c150-utf8.csv"
const csv = require('csvtojson')

// Processamento do ficheiro de classes
// Header
console.log("### Classes")
console.log("\n")

// Por omissão, a primeira linha é a lista de chaves
csv({delimiter:";"})
  .fromFile(csvFilePath)
  .on('json', (jsonObj, rowIndex)=> {
      var cod = "" + jsonObj['Código']
      var classe = 0
      if (cod.search(/\d{3}\.\d{1,3}\.\d{1,3}\.\d{1,4}/)!= -1) {
          classe = 4
      } else 
            if(cod.search(/\d{3}\.\d{1,3}\.\d{1,3}/)!= -1) 
                classe=3
            else
                if (cod.search(/\d{3}\.\d{1,3}/)!= -1) 
                    classe=2
                else 
                    if (cod.search(/\d{3}/)!= -1) {
                        classe=1
                    } else {
                        classe=0
                    }
    if(classe)
    {
        var classCode = "c" + cod
        console.log("###  http://jcr.di.uminho.pt/m51-clav#" + classCode)
        console.log(":" + classCode + " rdf:type owl:NamedIndividual ,")
        console.log("\t:Classe_N" + classe + ";")
        console.log("\t:codigo " + "\"" + cod + "\";")
        console.log("\t:titulo " + "\"" + jsonObj['Título'] + "\";")
        //cálculo da relação hierárquica
        switch(classe)
        {
            case 1: 
                console.log("\t:pertenceLC :lc1 ;")
                break
            case 2: 
                var sep = cod.lastIndexOf(".")
                var pai = cod.slice(0,sep)
                console.log("\t:temPai :c" + pai + " ;")
                break
            case 3:
                var sep = cod.lastIndexOf(".")
                var pai = cod.slice(0,sep)
                console.log("\t:temPai :c" + pai + " ;")
                // Tipo de processo: PC, PE
                if (jsonObj['Tipo de processo']) {
                    console.log("\t:processoTipo " + "\"" + jsonObj['Tipo de processo'] + "\" ;")
                } else {
                    console.warn(cod + ': Tipo de processo vazio.')
                }
                // Transversal: S/N
                if (jsonObj['Processo transversal (S/N)']) {
                    console.log("\t:processoTransversal " + "\"" + jsonObj['Processo transversal (S/N)'] + "\" ;")
                } else {
                    console.warn(cod + ': Transversalidade vazia.')
                }
                break
        }
        // Atenção ao último triplo, tem que terminar em .
        console.log("\t:descricao " + "\"" + jsonObj['Descrição'] + "\"" + ".")
        console.log("\n")
    }
} )
  .on('done', (error)=> {
    console.log('### Finito! Processamento das classes terminado.')
  })
