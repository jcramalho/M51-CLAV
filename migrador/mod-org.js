exports.migraOrg = function(callback)
{
    const csv = require('csvtojson')
    const fs = require('fs')

    // As organizações vão ser carregadas num array para validações posteriores
    var orgs = []
    // Processamento das Organizações ....................
        var csvFilePath = "../dados/org-utf8.csv"
        // Ficheiro de saída
        var fout = '../dados/ontologia/org.ttl'

        // Header
        fs.writeFile(fout, '### Organizações\n', function(err){
        if(err)
            console.error(err);
        console.log('Organizações: Comecei a processar');
        });
    
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

                fs.appendFile(fout, currentStatements , function(err){
                    if(err)
                        console.error(err);
                    console.log(jsonObj['Sigla']);
                });

            })
            .on('error',(err)=>{
                console.log(err)
            })
            .on('end', ()=>{
                console.warn("Passo 1: Terminei de processar as organizações.")
            })
            .on('done', ()=>{
                fs.appendFile(fout, '\n### Organizações terminam aqui.\n\n' , function(err){
                    if(err)
                        console.error(err);
                });
            })
    
        callback(null, '::Organizações');
        return orgs;
}