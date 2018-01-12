const csv = require('csvtojson')
const fs = require('fs')
const jfile = require("jsonfile")

// Carregamento do catálogo legislativo
var leg_file = "../dados/json/leg.json"
var Legislacao = []
// Varáveis
var fout = "unspecified"
var csvFilePath = "unspecified"
var pcaTriples = ""
var classes3 = []

// Ficheiro de saída
if (process.argv.length < 3){
    console.log('Atenção: não especificou a classe a migrar')
}
else{
    csvFilePath = "../dados/csvs/"+process.argv[2]+"-utf8.csv"
    fout = '../dados/ontologia/c'+process.argv[2]+'-pca.ttl'
}
    
jfile.readFile(leg_file, function(err, legCatalog){
    if(err)
        console.log(err)
    else{
        Legislacao = legCatalog
        
        csv({delimiter:";"})
        .fromFile(csvFilePath)
        .on('json', (jsonObj, rowIndex)=> {
            if ((jsonObj['Estado'].trim()=='') && jsonObj['Código']) { // Se é uma linha com info de classe
                var m = require("./mod-migra.js")
                var cod = "" + jsonObj['Código'].replace(/(\r\n|\n|\r)/gm,"")
                var classe = m.calcClasse(cod)
                var pcaCode = "pca_c" + cod
                
                if(classe == 3)
                {
                    if(cod == "400.10.001"){
                        pcaTriples += proc_c400_10_001(pcaCode)
                    }
                    else{
                        if(jsonObj['Prazo de conservação administrativa']){
                            pcaTriples += procPCA(jsonObj, pcaCode, cod)
                        }
                        else{
                            // Registar a classe para tratar o nível 4
                            classes3.push(cod)
                        }
                    }     
                }
                else if(classe == 4){
                    var sep = cod.lastIndexOf(".")
                    var pai = cod.slice(0,sep)
                    var index = classes3.indexOf(pai)
                    if(index > -1){
                        classes3.splice(index, 1)
                        if(jsonObj['Prazo de conservação administrativa']){
                            pcaTriples += procPCA(jsonObj, pcaCode, cod)
                        }
                        else{
                            // ERRO: nível 3 e nível 4 sem PCA
                            console.error('ERRO: classe sem PCA: ' + cod)
                        }
                    }
                }
            }
        })
        .on('done', (err)=>{
            fs.appendFile(fout, pcaTriples , function(err){
                if(err)
                    console.error(err)
                else
                    console.log(fout+" Gravado!")
            }) 
        })
    }
    
})


// Migração do PCA_____________________________________________________________

function procPCA(data, pcaCode, cod){
    var myTriples = "###  http://jcr.di.uminho.pt/m51-clav#" + pcaCode + "\n"
    myTriples += ":" + pcaCode + " rdf:type owl:NamedIndividual ,\n"
    myTriples += "\t:PCA ;\n"
    
    if(data['Nota ao PCA']){
        myTriples += "\t:pcaValor " + data['Prazo de conservação administrativa'] + ";\n"
        myTriples += "\t:pcaNota " + "\"" + data['Nota ao PCA'].replace(/"/g, "\\\"") + "\".\n\n"
    }
    else{
        myTriples += "\t:pcaValor " + data['Prazo de conservação administrativa'] + ".\n"
    }
    if(data['Justificação PCA']){
        myTriples += procJustPCA(data['Justificação PCA'], pcaCode)
    }
    if(data['Normalização Forma de contagem do prazo de cons adm']){
        myTriples += ":" + pcaCode + " :pcaFormaContagemNormalizada \"" + data['Normalização Forma de contagem do prazo de cons adm'] + "\".\n"
    }
    
    if(data['Forma de contagem do prazo de cons adm']){
        myTriples += ":" + pcaCode + " :pcaFormaContagem \"" + data['Forma de contagem do prazo de cons adm'] + "\".\n"
    }
    return myTriples
}

// Migração da Justificação ao PCA______________________________________
const Lexer = require('lex')

function procJustPCA(justificacao, pcaCode){
    var justCode = "just_" + pcaCode
    var myTriples = ""
    var critCont = 1
    var critCode = ""

    // analex que que trata as referências das justificações à legislação e aos processos
    var lex_refs = new Lexer 
    lex_refs.addRule(/\[[a-zA-Z0-9\-\/ ]+\]/, function(lexema){
        var legRef = lexema.substring(1, lexema.length-1)
        if(Legislacao.indexOf(legRef) > -1)
            myTriples += ":"+critCode+" :temLegislacao :leg_"+parseInt(Legislacao.indexOf(legRef)+1)+".\n" 
        else
            console.error('Erro de legRef: (ref: '+legRef+', crit: '+critCode+')')
    }).addRule(/\d{3}\.\d{2,3}\.\d{3}/, function(lexema){
        myTriples += ":"+critCode+" :temProcessoRelacionado :c"+lexema+".\n"
    }).addRule(/./, function(lexema){
        //pcaTriples += "\t Outro...\n"
    })

    // analex que faz a migração dos critérios
    var lex_criterios = new Lexer 
    lex_criterios.addRule(/#Critério legal:[^#]+/, function(lexema){
        critCode = "crit_" + justCode + "_" + parseInt(critCont)
        critCont++
        myTriples += ":" + critCode + " rdf:type owl:NamedIndividual ,\n"
        myTriples += "\t\t:CriterioJustificacaoLegal;\n"
        myTriples += "\t:conteudo \""+lexema.substring(16).replace(/"/g, "\\\"")+"\".\n"
        lex_refs.setInput(lexema).lex()
    }).addRule(/#Critério de utilidade administrativa:[^#]+/, function(lexema){
        critCode = "crit_" + justCode + "_" + parseInt(critCont)
        critCont++
        myTriples += ":" + critCode + " rdf:type owl:NamedIndividual ,\n"
        myTriples += "\t\t:CriterioJustificacaoUtilidadeAdministrativa;\n"
        myTriples += "\t:conteudo \""+lexema.substring(38).replace(/"/g, "\\\"")+"\".\n"
        lex_refs.setInput(lexema).lex()
    }).addRule(/./, function(lexema){
        //pcaTriples += "\t Outro...\n"
    })

    myTriples += "###  http://jcr.di.uminho.pt/m51-clav#" + justCode + "\n"
    myTriples += ":" + justCode + " rdf:type owl:NamedIndividual ,\n"
    myTriples += "\t:JustificacaoPCA.\n"
    
    myTriples += ":" + pcaCode + " :temJustificacao :" + justCode + ".\n"

    var texto = justificacao.replace(/(\r\n|\n|\r)/gm,"")
    lex_criterios.setInput(texto).lex()
    return myTriples
}

// Migração do Processo c400.10.001______________________________________

function proc_c400_10_001(pcaCode){
    var myTriples = "###  http://jcr.di.uminho.pt/m51-clav#" + pcaCode + "\n"
    myTriples += ":" + pcaCode + " rdf:type owl:NamedIndividual ,\n"
    myTriples += "\t:PCA ;\n"
    myTriples += "\t:pcaValor 30;\n"
    myTriples += "\t:pcaValor 50;\n"
    myTriples += "\t:pcaValor 100;\n"
    myTriples += "\t:pcaNota \"30 anos após a data do assento de óbito\";\n"
    myTriples += "\t:pcaNota \"50 anos sobre a data do registo de casamento\";\n"
    myTriples += "\t:pcaNota \"100 anos após a data do assento de nascimento\".\n"
    return myTriples
}
