import fs from 'fs';
import path from 'path';
import {htttpRequest} from './HtmlRequest.js';
// import { mdLink } from './mdLinks.js';
// import { mdLink } from "../index.js";
import {validateFalse, validateTrue, statusOption, statusAndValidate} from './metricas.js';
// import {validateOrStats} from '../index.js';

export const toReadFile = (pathFromCli, validateOrStats) => {
    const pathExt = path.extname(pathFromCli);
    //lee archivo con ext .md

    if (pathExt == '.md' || pathExt == '.markdown' || pathExt == '.mkdn' || pathExt == '.mdown') {

        const content = fs.readFileSync(pathFromCli, 'utf8')
        // console.log(pathFromCli)
        findUrl(pathFromCli, content, validateOrStats);
        //  return console.log(fs.readFileSync(pathFromCli, 'utf8'))

    } else {
        let mensaje= "Extension de archivo no valida"
       return mensaje;
    }
}



const findUrl = (pathFromCli, content, validateOrStats) => {
    let urlToAnalise = [];
    let marckdownUlr = /\[(.*)\]\((https?)\:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?\)/gi;
    let urlTittle = /\[(.*)\]/gi;//obtener title 
    let urlPath = /(https?)\:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gi;//obtener path

    let getUrl = content.match(marckdownUlr);

    if (getUrl !== null) {
        getUrl.forEach(elementos => {
            let urlObject = {};
            urlObject['Title'] = elementos.match(urlTittle).toString();
            urlObject['Url'] = elementos.match(urlPath).toString();
            urlObject['Path'] = pathFromCli;
            urlObject['Status']='';
            urlObject['StatusText']='';
            urlToAnalise.push(urlObject);
            
        })

        // return console.log(urlToAnalise)
        //console.log(htttpRequest(urlToAnalise))
          htttpRequest(urlToAnalise)
        .then((data)=>{
            //  mdLink(pathFromCli,data)
        // console.log(htttpRequest(urlToAnalise))
             switch(validateOrStats){ 
                 
                case '--validate:true':
                 validateTrue(pathFromCli,data)
                break;

                case '--validate:false':
                validateFalse(pathFromCli,data);
                break;

                case '--stats':
                statusOption(pathFromCli, data);
                break;

                case '--stats-validate':
                statusAndValidate(pathFromCli,data);
                break;

                case '--validate-stats':
                 statusAndValidate(pathFromCli,data);
                break;

                default:
                console.log('Ingrese comando valido\n--validate:true\n--validate:false\n--stats \n--stats-validate \n--validate-stats');
                break;
                
            }
        }
            )
            .catch((error)=>{
                console.log(error)
            })
        
    }

}


 
