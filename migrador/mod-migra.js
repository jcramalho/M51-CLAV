// Módulo que contem as funções de suporte à migração
//      2017-08-13: criado
//          by jcr

const fs = require('fs')

// Notas de aplicação
exports.migraNA = function(jsonObj, classCode, fout)
{
    var naList = []
    // tratamento das notas de aplicação
        if (jsonObj['Notas de aplicação'] && (jsonObj['Notas de aplicação'] != "")) {
            var textoNA = jsonObj['Notas de aplicação']
            naList = textoNA.replace(/(\r\n|\n|\r)/gm,"").split("#")
            var naCount = 1
            var naTriples = ""
                    
            for(var na=0, len = naList.length; na<len; na++)
                {
                    if(naList[na]){
                        // criar as instâncias das notas de aplicação
                        var naCode = "na_" + classCode + "_" + naCount
                        naCount++
                        naTriples = ""
                        naTriples += "###  http://jcr.di.uminho.pt/m51-clav#" + naCode + "\n"
                        naTriples += ":" + naCode + " rdf:type owl:NamedIndividual ,\n"
                        naTriples += "\t:NotaAplicacao ;\n"
    
                        var naLimpa = naList[na].replace(/\"/g,"\\\"")
                        naTriples += "\t:conteudo " + "\"" + naLimpa + "\".\n\n"

                        fs.appendFile(fout, naTriples , function(err){
                            if(err)
                                console.error(err);
                        });
                    }
        
                }
        }
    return naList;
}

// --------------------------------------------------------------------------
exports.migraExNA = function(jsonObj, classCode, fout)
{
    var exNAList = []

    if (jsonObj['Exemplos de NA']) {
            var textoExNA = jsonObj['Exemplos de NA']
            exNAList = textoExNA.replace(/(\r\n|\n|\r)/gm,"").split("#")
            var exNACount = 1
            var exNATriples = ""
                    
            for(var exna=0, len = exNAList.length; exna<len; exna++)
                {
                    if(exNAList[exna]){
                        // criar as instâncias para os exemplos das notas de aplicação
                        var exnaCode = "exna_" + classCode + "_" + exNACount
                        exNACount++
                        exNATriples = ""
                        exNATriples += "###  http://jcr.di.uminho.pt/m51-clav#" + exnaCode + "\n"
                        exNATriples += ":" + exnaCode + " rdf:type owl:NamedIndividual ,\n"
                        exNATriples += "\t:ExemploNotaAplicacao ;\n"
                        exNATriples += "\t:conteudo " + "\"" + exNAList[exna] + "\".\n\n"
                        
                        fs.appendFile(fout, exNATriples , function(err){
                            if(err)
                                console.error(err);
                        });
                    }
        
                }
        }
    return exNAList
}

// ------------------------------------------------------------------------------------
exports.migraNE = function(jsonObj, classCode, fout)
{
    var neList = []
    if (jsonObj['Notas de exclusão']) {
            var textoNE = jsonObj['Notas de exclusão']
            neList = textoNE.replace(/(\r\n|\n|\r)/gm,"").split("#")
            var neCount = 1
            var neTriples = ""
                    
            for(var ne=0, len = neList.length; ne<len; ne++)
                {
                    if(neList[ne]){
                        // criar as instâncias das notas de exclusão
                        var neCode = "ne_" + classCode + "_" + neCount
                        neCount++
                        neTriples = ""
                        neTriples += "###  http://jcr.di.uminho.pt/m51-clav#" + neCode + "\n"
                        neTriples += ":" + neCode + " rdf:type owl:NamedIndividual ,\n"
                        neTriples += "\t:NotaExclusao ;\n"
                        
                        var neLimpa = neList[ne].replace(/\"/g,"\\\"")
                        neTriples += "\t:conteudo " + "\"" + neLimpa + "\".\n\n"
                        
                        fs.appendFile(fout, neTriples , function(err){
                            if(err)
                                console.error(err);
                        });
                    }
        
                }
        }
    return neList
}