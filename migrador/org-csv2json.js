const csv = require('csvtojson')
const fs = require('fs')

// Carregamento das organizações para um array
var orgs = []

csv({delimiter:";"})
  .fromFile('./dados/org-utf8.csv')
  .on('json', (jsonObj, rowIndex)=> {
    orgs.push(jsonObj['Sigla'])
  })
  .on('error',(err)=>{
    console.log(err)
  })
  .on('end', ()=>{
      console.log("Passo 1: Terminei de carregar as organizações.")
  })
  .on('done', ()=>{
      fs.writeFileSync("./dados/org.json", JSON.stringify(orgs, null, 2))
      console.log("Organizações processadas. Resultados em: ./dados/org.json")
  })


