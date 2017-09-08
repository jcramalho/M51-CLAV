exports.migraLeg = function(callback)
{
    const csv = require('csvtojson')
    const fs = require('fs')

     // Processamento da Legislação ....................
        var csvFilePath = "../dados/leg-utf8.csv"
        // Ficheiro de saída
        var fout = '../dados/ontologia/leg.ttl'
        // Contador de documentos legislativos para os identificadores
        var count = 1

        // Header
        fs.writeFile(fout, '### Legislação\n', function(err){
        if(err)
            console.error(err);
        console.log('Legislação: Comecei a processar');
        });

        csv({delimiter:";"})
            .fromFile(csvFilePath)
            .on('json', (jsonObj, rowIndex)=> {
                var currentStatements = "###  http://jcr.di.uminho.pt/m51-clav#leg_" + count + '\n'
                currentStatements += ":leg_" + count + " rdf:type owl:NamedIndividual ,\n"
                currentStatements += "\t:Legislacao ;\n"
                currentStatements += "\t:diplomaAno :" + "\"" + jsonObj['Ano do diploma'] + "\";\n"
                currentStatements += "\t:diplomaTipo :" + "\"" + jsonObj['Tipo de diploma'] + "\";\n"
                currentStatements += "\t:diplomaNumero :" + "\"" + jsonObj['Numero do diploma'] + "\";\n"
                currentStatements += "\t:diplomaData :" + "\"" + jsonObj['Data do diploma'] + "\";\n"
                currentStatements += "\t:diplomaTitulo :" + "\"" + jsonObj['Título / âmbito do diploma'] + "\";\n"

                console.log(currentStatements)
                console.dir(jsonObj)
                console.log("..................................................")
                // Atenção ao último triplo, tem que terminar em .
                currentStatements += "\t:diplomaLink " + "\"" + jsonObj['Link'] + "\".\n"

                fs.appendFile(fout, currentStatements , function(err){
                    if(err)
                        console.error(err);
                    console.log(jsonObj['Tipo de diploma'] + jsonObj['Numero do diploma']);
                });
    
                count++
    
            })
            .on('done', (error)=> {
                fs.appendFile(fout, '\n### Legislação termina aqui.\n\n' , function(err){
                    if(err)
                        console.error(err);
                });
            })

        callback(null, '::Legislação');
}