/**
 * Prends l'objet passé en paramètre de getPropertiesList,
 * parse toutes ses méthodes, celle dont le nom commence par "--"
 * est déclarée au browser comme propriéte css custom
 * et renvois la liste
 * 
 * les méthode doivent comporter deux ligne de commentaire indiquant la syntax et la valeur initial de la prop css
 * 
 * ex:
 * "--ma-prop"(val){
 *   // syntax : <number>
 *   // initialValue: 0
 *   ...
 * } 
 * 
 */


export class PropertiesExtractor{

    // Retrouve toutes les méthodes, même celle des classes héritées
    static getAllProperties(obj){
        var allProps = []
          , curr = obj
        do{
            var props = Object.getOwnPropertyNames(curr)
            props.forEach(function(prop){
                if (allProps.indexOf(prop) === -1)
                    allProps.push(prop)
            })
        }while(curr = Object.getPrototypeOf(curr))
        return allProps
    }


    // déclare au browser, et renvois la liste des props
    static getPropertiesList(obj){
        let list = []
        PropertiesExtractor.getAllProperties(obj).forEach(prop=>{
            if(prop[0]=='-'){
                const fCode = obj[prop].toString()
                let syntax,initialValue = null
                 try{
                    // 如果您要编写十行注释来解释它，那么编写如此简洁的代码是没有意义的。
                    [syntax,initialValue] = fCode.match(/\/\/\s*syntax\s*:(.*)$|\/\/\s*initialValue\s*:(.*)$/gmi).map(a=>{return a.split(':')[1].replace(/\s?/g,'')})
                    list.push(prop)
                }catch(e){
                    console.error(`Il manque la definition de syntax/initalValue de la propriété ${prop}`)
                }
     
                try{ // définie la propriété pour que les animations CSS puissent avoir lieu
                    window.CSS.registerProperty({
                        name: prop,
                        syntax: syntax,
                        inherits: false,
                        initialValue: initialValue
                      });
                     
                }catch(e){  
                    if(e.code!=13){
                        console.log(obj.tagName,e.message)
                        console.table([syntax,initialValue]) //DEBUG
                    }
                       
                    
                }

            }
        })
        return list
    }

}