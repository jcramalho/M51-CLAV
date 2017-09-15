exports.migraClasse = function(callback, orgCatalog, classe)
{
    const csv = require('csvtojson')
    const fs = require('fs')

    // Processamento do ficheiro de classes ...........................
    const csvFilePath = "../dados/" + classe + "-utf8.csv"
    // Ficheiro de saída
    var fout = '../dados/ontologia/c' + classe + '.ttl'

    // Header
    fs.writeFile(fout, '### Classe' + classe + '\n', function(err){
        if(err)
            console.error(err);
        console.log('Classe ' + classe + ': Comecei a processar');
    });

    // Por omissão, a primeira linha é a lista de chaves
    csv({delimiter:";"})
        .fromFile(csvFilePath)
        .on('json', (jsonObj, rowIndex)=> {
            var cod = "" + jsonObj['Código']
            var classe = 0
            var classTriples = ""

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
                var m = require("./mod-migra.js")

                // tratamento das notas de aplicação
                var naList = m.migraNA(jsonObj, classCode, fout)

                // tratamento dos exemplos das notas de aplicação
                var exNAList = m.migraExNA(jsonObj, classCode, fout)

                // tratamento das notas de exclusão
                var neList = m.migraNE(jsonObj, classCode, fout)

                // Geração dos triplos da classe
                classTriples += "###  http://jcr.di.uminho.pt/m51-clav#" + classCode + "\n"
                classTriples += ":" + classCode + " rdf:type owl:NamedIndividual ,\n"
                classTriples += "\t:Classe_N" + classe + ";\n"
                classTriples += "\t:codigo " + "\"" + cod + "\";\n"
                classTriples += "\t:titulo " + "\"" + jsonObj['Título'] + "\";\n"
        
                //cálculo da relação hierárquica
                switch(classe)
                {
                    case 1: 
                        classTriples += "\t:pertenceLC :lc1 ;\n"
                        break
                    case 2: 
                        var sep = cod.lastIndexOf(".")
                        var pai = cod.slice(0,sep)
                        classTriples += "\t:temPai :c" + pai + " ;\n"
                        break
                    case 3:
                        var sep = cod.lastIndexOf(".")
                        var pai = cod.slice(0,sep)
                        classTriples += "\t:temPai :c" + pai + " ;\n"
                        // Tipo de processo: PC, PE
                        if (jsonObj['Tipo de processo']) {
                            classTriples += "\t:processoTipo " + "\"" + jsonObj['Tipo de processo'] + "\" ;\n"
                        } else {
                            console.warn(cod + ': Tipo de processo vazio.')
                        }
                        // Transversal: S/N
                        if (jsonObj['Processo transversal (S/N)']) {
                            classTriples += "\t:processoTransversal " + "\"" + jsonObj['Processo transversal (S/N)'] + "\" ;\n"
                        } else {
                            console.warn(cod + ': Transversalidade vazia.')
                        }
                        // Dono(s) do processo
                        if (jsonObj['Dono do processo']) {
                            var excel = jsonObj['Dono do processo']
                            var donos = excel.replace(/(\r\n|\n|\r)/gm,"").split("#")
                            for(var d=0, len = donos.length; d<len; d++)
                            {
                                if(donos[d])
                                    // Verificação da existência no catálogo organizativo
                                    if(orgCatalog.indexOf(donos[d])!= -1)
                                        classTriples += "\t:temDono " + ":org_" + donos[d] + " ;\n"
                                    else
                                        console.warn(cod + ': Organização ' + donos[d] + " não está no catálogo.")
                            }
                        } else {
                            console.warn('Warning: ' + cod + ': Processo sem dono especificado.')
                        }

                        // Participante(s) do processo
                        if (jsonObj['Participante no processo']) {
                            var excel = jsonObj['Participante no processo']
                            var parts = excel.replace(/(\r\n|\n|\r)/gm,"").split("#")
                            var excelTipo = jsonObj['Tipo de intervenção do participante']
                            var tipos = excelTipo.replace(/(\r\n|\n|\r)/gm,"").split("#")

                            for(var p=0, len = parts.length; p<len; p++)
                            {
                                if(parts[p])
                                    // Verificação da existência no catálogo organizativo
                                    if(orgCatalog.indexOf(parts[p])!= -1)
                                     // tipo de participação
                                        if (tipos[p]) {
                                            switch (tipos[p]) {
                                                case 'Apreciar':
                                                    classTriples += "\t:temParticipanteApreciador " + ":org_" + parts[p] + " ;\n"
                                                    break;
                                                case 'Assessorar':
                                                    classTriples += "\t:temParticipanteAssessor " + ":org_" + parts[p] + " ;\n"
                                                    break
                                                case 'Comunicar':
                                                    classTriples += "\t:temParticipanteComunicador " + ":org_" + parts[p] + " ;\n"
                                                    break
                                                case 'Decidir':
                                                    classTriples += "\t:temParticipanteDecisor " + ":org_" + parts[p] + " ;\n"
                                                    break
                                                case 'Executar':
                                                    classTriples += "\t:temParticipanteExecutor " + ":org_" + parts[p] + " ;\n"
                                                    break
                                                case 'Iniciar':
                                                    classTriples += "\t:temParticipanteIniciador " + ":org_" + parts[p] + " ;\n"
                                                    break
                                                default:
                                                    console.warn(cod + ': Organização ' + parts[p] + " tem intervenção mal definida.")
                                                break;
                                            }
                                    
                                        } else {
                                            console.warn(cod + ': Organização ' + parts[p] + " não tem intervenção definida.")
                                    }
                            else
                                console.warn(cod + ': Organização ' + parts[p] + " não está no catálogo.")
                            }
                        } else {
                            console.warn('Warning: ' + cod + ': Processo sem participantes.')
                        }
                        break
                }

                // Relações com as notas de aplicação
                if (jsonObj['Notas de aplicação'] && (jsonObj['Notas de aplicação'] != "")) {
                    var naCount = 1
                    
                    for(var na=0, len = naList.length; na<len; na++)
                    {
                        if(naList[na]){
                            // criar as relações com as notas de aplicação
                            var naCode = "na_" + classCode + "_" + naCount
                            naCount++
                            classTriples += "\t:temNotaAplicacao " + ":" + naCode + " ;\n"
                        }
                    }
                }

                // Relações com as notas de exclusão
                if (jsonObj['Notas de exclusão']) {
                    var neCount = 1
                    
                    for(var ne=0, len = neList.length; ne<len; ne++)
                    {
                        if(neList[ne]){
                            // criar as relações com as notas de exclusão
                            var neCode = "ne_" + classCode + "_" + neCount
                            neCount++
                            classTriples += "\t:temNotaExclusao " + ":" + neCode + " ;\n"
                        }
                    }
                }

                // Atributos fixos de todas as classes
                classTriples += "\t:classeStatus " + "\"A\" ;\n"

                // Exemplos das NA
                if (jsonObj['Exemplos de NA']) {
                    var textoENA = jsonObj['Exemplos de NA'].trim()
                    var enaList = textoENA.replace(/(\r\n|\n|\r)/gm,"").split("#")
                    var enaCount = 1
                    
                    for(var ena=0, len = enaList.length; ena<len; ena++)
                    {
                        if(enaList[ena]){
                            classTriples += "\t:exemploNA " + "\"" + enaList[ena] + "\" ;\n"
                        }
                    }
                }
                // Atenção ao último triplo, tem que terminar em .
                classTriples += "\t:descricao " + "\"" + jsonObj['Descrição'] + "\"" + ".\n"

                fs.appendFile(fout, classTriples , function(err){
                    if(err)
                        console.error(err);
                    console.log(jsonObj['Tipo de diploma'] + jsonObj['Numero do diploma']);
                });
            }
        })
    .on('done', (error)=> {
        fs.appendFile(fout, '\n### Classes' + classe + ' termina aqui.\n\n' , function(err){
                    if(err)
                        console.error(err);
                });
  })

  callback(null, '::Classe ' + classe);
}