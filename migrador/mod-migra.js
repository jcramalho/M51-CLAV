// Módulo que contem as funções de suporte à migração
//      2017-08-13: criado
//          by jcr

// Notas de aplicação
function migraNA(jsonObj, classCode)
{
    // tratamento das notas de aplicação
        if (jsonObj['Notas de aplicação'] && (jsonObj['Notas de aplicação'] != "")) {
            var textoNA = jsonObj['Notas de aplicação']
            var naList = textoNA.replace(/(\r\n|\n|\r)/gm,"").split("#")
            var naCount = 1
                    
            for(var na=0, len = naList.length; na<len; na++)
                {
                    if(naList[na]){
                        // criar as instâncias das notas de aplicação
                        var naCode = "na_" + classCode + "_" + naCount
                        naCount++
                        console.log("###  http://jcr.di.uminho.pt/m51-clav#" + naCode)
                        console.log(":" + naCode + " rdf:type owl:NamedIndividual ,")
                        console.log("\t:NotaAplicacao ;")
                        var naLimpa = naList[na].replace(/\"/g,"\\\"")
                        console.log("\t:conteudo " + "\"" + naLimpa + "\".\n")
                    }
        
                }
        }
}

// --------------------------------------------------------------------------

function migraExNA(jsonObj, classCode)
{
    if (jsonObj['Exemplos de NA']) {
            var textoExNA = jsonObj['Exemplos de NA']
            var exNAList = textoExNA.replace(/(\r\n|\n|\r)/gm,"").split("#")
            var exNACount = 1
                    
            for(var exna=0, len = exNAList.length; exna<len; exna++)
                {
                    if(exNAList[exna]){
                        // criar as instâncias para os exemplos das notas de aplicação
                        var exnaCode = "exna_" + classCode + "_" + exNACount
                        exNACount++
                        console.log("###  http://jcr.di.uminho.pt/m51-clav#" + exnaCode)
                        console.log(":" + exnaCode + " rdf:type owl:NamedIndividual ,")
                        console.log("\t:ExemploNotaAplicacao ;")
                        console.log("\t:conteudo " + "\"" + exNAList[exna] + "\".\n")
                    }
        
                }
        }
}

// ------------------------------------------------------------------------------------

function migraNE(jsonObj, classCode)
{
    if (jsonObj['Notas de exclusão']) {
            var textoNE = jsonObj['Notas de exclusão']
            var neList = textoNE.replace(/(\r\n|\n|\r)/gm,"").split("#")
            var neCount = 1
                    
            for(var ne=0, len = neList.length; ne<len; ne++)
                {
                    if(neList[ne]){
                        // criar as instâncias das notas de exclusão
                        var neCode = "ne_" + classCode + "_" + neCount
                        neCount++
                        console.log("###  http://jcr.di.uminho.pt/m51-clav#" + neCode)
                        console.log(":" + neCode + " rdf:type owl:NamedIndividual ,")
                        console.log("\t:NotaExclusao ;")
                        var neLimpa = neList[ne].replace(/\"/g,"\\\"")
                        console.log("\t:conteudo " + "\"" + neLimpa + "\".\n")
                    }
        
                }
        }
}