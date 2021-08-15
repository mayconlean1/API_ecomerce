const cpf = `
    Os Cpfs são:
    254.224.877-45  215.298.456-12 047.258.369-96
    963.997.321-00
`

const ips = `
    Os ips são:
    0.0.0.0  192.168.0.25    10.10.5.12 255.255.255.255
    780.15.2.255 299.299.52.0
`

const acentos = `À Á Â Ä Å Ã Æ Ç É È Ê Ë Í Ì Î Ï Ñ Ó Ò Ô Ö Ø Õ OE Ú Ù Û Ü Ý Y `
let semEspaco 
//([0-2][0-5][0-5]\.){3}[0-2][0-5][0-5]

// (?<=\D)([0-9][0-9]?\.){3}[0-9][0-9]?

//Utilizado o https://regexr.com/ para montar
//(?<=\D)(?<=\D)(([2][0-5][0-5]|[0-1][0-9][0-9]|[0-9][0-9]|[0-9])\.){3}([2][0-5][0-5]|[0-1][0-9][0-9]|[0-9][0-9]|[0-9])

//precisa de um condicional para resolver ?
// (?<=\D)([0-2]?[0-9][0-9]?\.){3}[0-2]?[0-9][0-9]?
console.log( !semEspaco.match(/\s+/gi) )
console.log(ips.match(/(?<=\D)(([2][0-5][0-5]|[0-1][0-9][0-9]|[0-9][0-9]|[0-9])\.){3}([2][0-5][0-5]|[0-1][0-9][0-9]|[0-9][0-9]|[0-9])/gi))


// console.log(cpf.match(/\d+\.\d+\.\d+-\d+/gi))

// ######### SELECIONA O NUMERO APOS DO -
console.log(cpf.match(/(?<=-)\d+/gi)) 

// ######### SELECIONA O NUMERO ANTES DO " -  "
console.log(cpf.match(/\d+(?=-)/gi)) 

// console.log(ips.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/gi))

// console.log(acentos)
// const replace = acentos.replace(/[ÀÁÂÄÅÃÆÉÈÊËÍÌÎÏÓÒÔÖØÕÚÙÛÜ]/gi , value =>{
//     if (value.match(/[ÀÁÂÄÅÃÆ]/gi)){
//         return 'A'
//     }else if (value.match(/[ÉÈÊË]/gi)){
//         return 'E'
//     }else if (value.match(/[ÍÌÎÏ]/gi)){
//         return 'I'
//     }else if (value.match(/[ÓÒÔÖØÕ]/gi)){
//         return 'O'
//     }else if (value.match(/[ÚÙÛÜ]/gi)){
//         return 'U'
//     }
// })
// console.log(replace)

// console.log(acentos.replace(/[(Í)(Ó)]/gi ,"<div>$1</div>"))