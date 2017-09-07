exports.migraTI = function(callback)
{
    const csv = require('csvtojson')
    const fs = require('fs')

     // Processamento dos Termos de Índice ....................
        var csvFilePath = "../dados/ti-utf8.csv"
        // Ficheiro de saída
        var fout = '../dados/ontologia/ti.ttl'
        // Contador de termos para as labels
        var count = 1

        // Header
        fs.writeFile(fout, '### Termos de Índice\n', function(err){
        if(err)
            console.error(err);
        console.log('Termos de Índice: Comecei a processar');
        });

        csv({delimiter:";"})
            .fromFile(csvFilePath)
            .on('json', (jsonObj, rowIndex)=> {

                var cod = "c" + jsonObj['Código']
                var currentStatements = "###  http://jcr.di.uminho.pt/m51-clav#ti_" + count + '\n'
                currentStatements += ":ti_" + count + " rdf:type owl:NamedIndividual ,\n"
                currentStatements += "\t:TermoIndice ;\n"
                currentStatements += "\t:estaAssocClasse :" + cod + ";\n"
                // Atenção ao último triplo, tem que terminar em .
                currentStatements += "\t:termo " + "\"" + jsonObj['Termo'] + "\"" + ".\n"

                fs.appendFile(fout, currentStatements , function(err){
                    if(err)
                        console.error(err);
                    console.log(jsonObj['Termo']);
                });
    
                count++
    
            })
            .on('done', (error)=> {
                fs.appendFile(fout, '\n### Termos de Índice terminam aqui.\n\n' , function(err){
                    if(err)
                        console.error(err);
                });
            })

        callback(null, '::Termos de Índice');
}