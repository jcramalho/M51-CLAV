exports.migraOrg = function(callback)
{
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

    console.log('Organizações: Comecei a processar')

    csv({delimiter:";"})
    .fromFile(csvFilePath)
    .on('json', (jsonObj, rowIndex)=> {
        orgs.push(jsonObj['Sigla'])

        var currentStatements = "###  http://jcr.di.uminho.pt/m51-clav#org_" + jsonObj['Sigla'] + '\n'
        currentStatements += ":org_" + jsonObj['Sigla'] + " rdf:type owl:NamedIndividual ,\n"
        currentStatements += "\t:Organizacao ;\n"
        currentStatements += "\t:orgSigla " + "\"" + jsonObj['Sigla'] + "\";\n"
        // Atenção ao último triplo, tem que terminar em .
        currentStatements += "\t:orgNome " + "\"" + jsonObj['Entidade'] + "\".\n"

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
    })    

    callback(null,orgs) 
}
        
            
