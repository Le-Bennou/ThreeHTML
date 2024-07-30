/**
 * 
 *  Gestion des propriété CSS custom :
 *      - création
 *      - application à l'objet (abstract)
 *      - update en cas d'animation
 *      - update en cas de changement d'attributs
 * 
 * 
 *  Les héritiers doivent déclarer des setters pour recevoir les value des propriétes CSS
 *  sous la forme : customStyle.property = valeur 
 */
import * as THREE from "three"
export class CSS extends HTMLElement{

    static timeUnit = {
        "s" : 1,
        "ms" : 1000
    }

    static sCssProperties = [{}]
    cssProperties = {}
    #parentScene = null
    cssStyle = {}
    cssHasToUpdate = true; 
    #cssAnimate = false;
    #cssAlways = false
    #mixer = null
    animatipnToPlay = null
    #animationFactor = 1;



    #clock = new THREE.Clock()
    constructor(){
        super()
        this.constructor.sCssProperties.forEach(property=>{
            for(let name in property){
               
                try{
                    window.CSS.registerProperty({
                        name: name,
                        syntax: property[name].syntax,
                        inherits: false,
                        initialValue: property[name].initialValue
                      });
                }catch(e){      
                       // console.log(e) 
                }
                this.cssProperties[name] = property[name].function
                this.cssHasToUpdate = true
            }
        })

        this.addEventListener('animationstart',(a)=>{
           //FIXME : l'event est délenché au chargement, hors le fichier n'est pas encore ouvert.
           
            this.startAnimation(a.animationName)

        })

        this.addEventListener('animationend',()=>{
            this.#cssAnimate = false;
        })
     }


     startAnimation(name){
        this.animatipnToPlay = name

        if(!this.three) return
        
        this.#mixer = new THREE.AnimationMixer( this.three ); 
        const clip = THREE.AnimationClip.findByName( this.three.animations, name);

        if(clip){
            const a = window.getComputedStyle(this).animationDuration
            const b =parseFloat(a) / CSS.timeUnit[a.replace(/[0-9](\.[0-9])?/,'')] 
            this.#animationFactor = clip.duration/b
            console.log(clip)
            console.log(b)
            
            this.#mixer.clipAction(clip).play()
        }
     }

     debug(){
        if(!this.three){
            setTimeout(()=>{
                this.debug()
            },500)
            return
        }
        console.log("===== Debug =====")
        console.log(this)
        console.log('-----------------')
        console.log(this.three)
        console.log("=================")
        console.log()
     }

    connectedCallback(){
        if(this.hasAttribute('debug')){
            setTimeout(()=>{
                this.debug()
            },200)
            this.#cssAlways = true
            console.log(this,"debug")
        }
        this.addAnimationListener('_cssUpdate')
        this.addAnimationListener('_actionUpdate')
        this.getAnimations().forEach(a=>{
            if(a.playState=="running"){
                this.#cssAnimate = true;
            }
        })    
    }

    needsToUpadte(){
        this.cssHasToUpdate = true  
    }

    _actionUpdate(){
        if(!this.#mixer) return
        this.#mixer.update(this.#clock.getDelta()*this.#animationFactor);
       
    }

    _cssUpdate(){        

        if(!this.cssHasToUpdate && !this.#cssAnimate && !this.#cssAlways) return
        const computedStyle =  window.getComputedStyle(this)
        for(let prop in this.cssProperties){
            this[this.cssProperties[prop]](computedStyle.getPropertyValue(prop));
        }
        this.cssHasToUpdate = false;
    }

    get parentScene(){
        if(!this.#parentScene){
            let parent = this.parentNode;
            while (parent.parentNode && parent.tagName !="THREE-SCENE"){
                parent = parent.parentNode
            }
            this.#parentScene = parent;
        }

       
        return this.#parentScene
    }
}