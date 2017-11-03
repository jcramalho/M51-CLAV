exports.migraClasse = function(orgCatalog, legCatalog, classe)
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
            console.error(err)
        console.log('Classe ' + classe + ': Comecei a processar');
    })

    // Por omissão, a primeira linha é a lista de chaves
    csv({delimiter:";"})
        .fromFile(csvFilePath)
        .on('json', (jsonObj, rowIndex)=> {
            if (jsonObj['Código']) { // Se é uma linha com info de classe
                var m = require("./mod-migra.js")
                var cod = "" + jsonObj['Código'].replace(/(\r\n|\n|\r)/gm,"")
                var classe = m.calcClasse(cod)
                var classTriples = ""
                
                if(classe)
                {
                    var classCode = "c" + cod
                    
                    // tratamento das notas de aplicação
                    var naList = m.migraNA(jsonObj, classCode, fout)
    
                    // tratamento dos exemplos das notas de aplicação
                    var exNAList = m.migraExNA(jsonObj, classCode, fout)
    
                    // tratamento das notas de exclusão
                    var neList = m.migraNE(jsonObj, classCode, fout)
    
                    // Geração dos triplos da classe: Data Properties
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
                                if(jsonObj['Processo transversal (S/N)'] == 'S'){
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
                                }
    
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
                            break
                        case 4:
                            var sep = cod.lastIndexOf(".")
                            var pai = cod.slice(0,sep)
                            classTriples += "\t:temPai :c" + pai + " ;\n"
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
    
                    // Relações com os outros Processos
                    if(jsonObj['Código do processo relacionado']){
                        var procRefs = jsonObj['Código do processo relacionado']
                        var procRefsSplit = procRefs.replace(/(\r\n|\n|\r|\s)/gm,"").split("#")
                        var procTipos = jsonObj['Tipo de relação entre processos']
                        var procTiposSplit = procTipos.replace(/(\r\n|\n|\r)/gm,"").split("#")
    
                        if(procRefsSplit.length != procTiposSplit.length) {
                            console.error(classCode + " :: tem " + procRefsSplit.length + " processos relacionados mas " + procTiposSplit.length + " tipos de relação.")
                        }    
                        for(var p=0, len = procRefsSplit.length; p<len; p++)
                        {
                            if(procRefsSplit[p]){
                                classTriples += "\t:temRelProc " + ":c" + procRefsSplit[p] + " ;\n"
                                
                            }
                                
    
                            
                        }
                    }
    
                    // Relações com a Legislação
                    if (jsonObj['Diplomas jurídico-administrativos REF']) {
                        var legRefs = jsonObj['Diplomas jurídico-administrativos REF']
                        var legRefsSplit = legRefs.replace(/(\r\n|\n|\r)/gm,"").split("#")
                        
                        for(var l=0, len = legRefsSplit.length; l<len; l++)
                        {
                            if(legRefsSplit[l])
                                // Verificação da existência no catálogo legislativo
                                if(legCatalog.indexOf(legRefsSplit[l])!= -1)
                                    classTriples += "\t:temLegislacao " + ":leg_" + legCatalog.indexOf(legRefsSplit[l]) + " ;\n"
                                else
                                    console.error( classCode + " :: Referência a legislação inexistente no catálogo: " + legRefsSplit[l])
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
                    var mydesc = jsonObj['Descrição'].replace(/\"/gm,"\\\"")
                    classTriples += "\t:descricao " + "\"" + mydesc + "\"" + ".\n"
    
                    fs.appendFile(fout, classTriples , function(err){
                        if(err)
                            console.error(err)
                        else
                            console.log("Gerei a classe: " + classCode)
                    })
                }
            }
        })
    .on('done', (error)=> {
        fs.appendFile(fout, '\n### Classes' + classe + ' termina aqui.\n\n' , function(err){
            if(err)
                console.error(err)
            else
                console.log('Classe ' + classe + ': terminei.')
        })
  })
}