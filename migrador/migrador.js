// Carregamento das organizações para verificação
var jfile = require("jsonfile")
var file = "./dados/org.json"

var orgCatalog = jfile.readFileSync(file)
// ----------------------------------------------

// Configuração das fontes das classes
const csvFilePath = "./dados/c150-utf8.csv"
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

        var m = require(mod-migra)

        // tratamento das notas de aplicação
        m.migraNA(jsonObj, classCode)

        // tratamento dos exemplos das notas de aplicação

        m.migraExNA(jsonObj, classCode)

        // tratamento das notas de exclusão

        m.migraNE(jsonObj, classCode)

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
                // Dono(s) do processo
                if (jsonObj['Dono do processo']) {
                    var excel = jsonObj['Dono do processo']
                    var donos = excel.replace(/(\r\n|\n|\r)/gm,"").split("#")
                    for(var d=0, len = donos.length; d<len; d++)
                    {
                        if(donos[d])
                            // Verificação da existência no catálogo organizativo
                            if(orgCatalog.indexOf(donos[d])!= -1)
                                console.log("\t:temDono " + ":org_" + donos[d] + " ;")
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
                                            console.log("\t:temParticipanteApreciador " + ":org_" + parts[p] + " ;")
                                            break;
                                        case 'Assessorar':
                                            console.log("\t:temParticipanteAssessor " + ":org_" + parts[p] + " ;")
                                            break
                                        case 'Comunicar':
                                            console.log("\t:temParticipanteComunicador " + ":org_" + parts[p] + " ;")
                                            break
                                        case 'Decidir':
                                            console.log("\t:temParticipanteDecisor " + ":org_" + parts[p] + " ;")
                                            break
                                        case 'Executar':
                                            console.log("\t:temParticipanteExecutor " + ":org_" + parts[p] + " ;")
                                            break
                                        case 'Iniciar':
                                            console.log("\t:temParticipanteIniciador " + ":org_" + parts[p] + " ;")
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
                        console.log("\t:temNotaAplicacao " + ":" + naCode + " ;")
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
                        console.log("\t:temNotaExclusao " + ":" + neCode + " ;")
                    }
        
                }
        }

        // Atributos fixos de todas as classes
        console.log("\t:classeStatus " + "\"A\" ;")

        // Exemplos das NA

        if (jsonObj['Exemplos de NA']) {
            var textoENA = jsonObj['Exemplos de NA'].trim()
            var enaList = textoENA.replace(/(\r\n|\n|\r)/gm,"").split("#")
            var enaCount = 1
                    
            for(var ena=0, len = enaList.length; ena<len; ena++)
                {
                    if(enaList[ena]){
                        console.log("\t:exemploNA " + "\"" + enaList[ena] + "\" ;\n")
                    }
        
                }
        }
        // Atenção ao último triplo, tem que terminar em .
        console.log("\t:descricao " + "\"" + jsonObj['Descrição'] + "\"" + ".")
        console.log("\n")
    }
} )
  .on('done', (error)=> {
    console.log('### Finito! Processamento das classes terminado.')
  })
