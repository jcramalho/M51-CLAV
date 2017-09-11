exports.migraLeg = function(callback)
{
    const csv = require('csvtojson')
    const fs = require('fs')

    // Os documentos legislativos vão ser carregados num array para validações posteriores
    var legs = []

     // Processamento da Legislação ....................
        var csvFilePath = "../dados/leg-utf8.csv"
        // Ficheiro de saída
        var fout = '../dados/ontologia/leg.ttl'

        // Header
        fs.writeFile(fout, '### Legislação\n', function(err){
        if(err)
            console.error(err);
        console.log('Legislação: Comecei a processar');
        });

        csv({delimiter:";"})
            .fromFile(csvFilePath)
            .on('json', (jsonObj, rowIndex)=> {
                var lcode = "leg_" + jsonObj['Tipo de diploma'].replace(/ /g,"_") + "_" + jsonObj['Numero do diploma']
                if(legs.indexOf(lcode) === -1)
                    legs.push(lcode)
                else
                    console.error("ERRO: Duplicação de id na legislação [" + lcode + "]  " + legs.indexOf(lcode) + "/" + legs.length )

                var currentStatements = "###  http://jcr.di.uminho.pt/m51-clav#" + lcode + '\n'
                currentStatements += ":" + lcode + " rdf:type owl:NamedIndividual ,\n"
                currentStatements += "\t:Legislacao ;\n"
                currentStatements += "\t:diplomaAno :" + "\"" + jsonObj['Ano do diploma'] + "\";\n"
                currentStatements += "\t:diplomaTipo :" + "\"" + jsonObj['Tipo de diploma'] + "\";\n"
                currentStatements += "\t:diplomaNumero :" + "\"" + jsonObj['Numero do diploma'] + "\";\n"
                currentStatements += "\t:diplomaData :" + "\"" + jsonObj['Data do diploma'] + "\";\n"
                currentStatements += "\t:diplomaTitulo :" + "\"" + jsonObj['Título / âmbito do diploma'] + "\";\n"

                // Atenção ao último triplo, tem que terminar em .
                currentStatements += "\t:diplomaLink " + "\"" + jsonObj['Link'] + "\".\n"

                fs.appendFile(fout, currentStatements , function(err){
                    if(err)
                        console.error(err);
                    console.log(jsonObj['Tipo de diploma'] + jsonObj['Numero do diploma']);
                });
    
            })
            .on('done', (error)=> {
                fs.appendFile(fout, '\n### Legislação termina aqui.\n\n' , function(err){
                    if(err)
                        console.error(err);
                });
            })

        callback(null, '::Legislação');
}