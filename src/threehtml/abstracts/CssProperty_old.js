export class CssProperty{

 
    // =================  Ajoute les propriétés CSS à surveiller ==========
    static addPropertyListener(target,property,shortHand,propertySyntax,initialValue){
        if(!target.cssListeners) return

       CssProperty.defineProperty(property,shortHand,propertySyntax,initialValue)
    
        target.cssListeners.push( // ajoute la propriété à surveiller pour que l'élément puisse faire ses updates
            property
        )
    }


    // ========================= déclare les propriétés css au navigateur ===================
    static defineProperty(property,shortHand,propertySyntax,initialValue){
        // le try/catch permet d'éviter d'encombrer la console pour des propriétés déjà definie
        try{ // définie la propriété pour que les animations CSS puissent avoir lieu
            window.CSS.registerProperty({
                name: property,
                syntax: propertySyntax,
                inherits: false,
                initialValue: initialValue
              });

        }catch(e){      
               // console.log(e) //DEBUG
        }

        if(shortHand){
            try{ 
                window.CSS.registerProperty({
                    name: shortHand,
                    syntax: propertySyntax+'+',
                    inherits: false,
                    initialValue: initialValue
                  });
    
            }catch(e){      
                    console.log(e) //DEBUG
            }
    
        }
    }

    /* ===== pour apppliquer la propriété css on fait appel à cssProperty concaténé au nom de la propriété
    *  exemple : pour une propriété "position-x", cela appel cssPropertyPositionX() de target
    */
    static applyProperty(target,prop,val){
        let p =""
        prop = prop.split('-')

        prop.forEach(a=>{
            if(a){
                p+=a.charAt(0).toUpperCase() + a.slice(1);
            }
        })

        if(target['cssProperty'+p]){
            target['cssProperty'+p](val)
        }
    }


}