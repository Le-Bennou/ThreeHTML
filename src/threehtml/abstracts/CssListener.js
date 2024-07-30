/*
 Va surveiller les changement de CSS de l'élément est indiquer à la scene que cet élément necessiste un update

 réagis à :
 - changement d'attribut (calls,style ou autre)
 - modification via javascript
 - animation CSS

 TODO : réagir aux changements de CSS en modifiant une balise style ou dans l'inspecteur du navigateur

*/

import { PropertiesExtractor } from "./PropertiesExtractor.js"
import * as THREE from 'three'

export class CssListener extends HTMLElement{
 #one = false
    #liveEdit = false
    #animationCss = false
    #mixer = null
    #animationFactor = 1
    #clock = new THREE.Clock()
    oldCssValue = {}

    #needsUpdate = false


    static cssProperties = []
    static timeUnit = {
        "s" : 1,
        "ms" : 1000
    }
    isThreeElement = true;

    constructor(){
        super()
        this.#defineCustomProperties()
        this.#createMutationObserver()
        this.#checkAnimation()

    }


    get isThreeHTML(){
        return true
    }

    set animationCss(val){
        this.#animationCss = val
    }

    
    getAngleValue(val){
        const v = parseFloat(val)
        if(val.match('deg')){
            return v*Math.PI/180
        }
        return v
    }

    // ===== définition des propriétés custom ================ 
    #defineCustomProperties(){
        this.constructor.cssProperties = PropertiesExtractor.getPropertiesList(this)
    }

    
    // ======== attribution de la scene parent =================//

    // quand l'élément est placé sur la page
    connectedCallback(){ // quand l'élément est placé sur la page
        if(this.hasAttribute('liveedit')){
            this.#liveEdit = true
        }
       this.#defineParentScene()
       this.cssUpdate()
    }

    //quand l'élément change de parent
    adoptedCallback() { // s'il change de parent
       this.#defineParentScene()
       this.cssUpdate()
    }

    //attribut parentScene aux enfants de celle-ci
    #defineParentScene(){
        if(!this.three) return
        let p = this
        let added = false
        while (p && p.tagName!="THREE-SCENE" ){
            p = p.parentNode

            if(p && p.three && !added && this.three.isObject3D){ 
                p.three.add(this.three)
                added = true
            }
        }
        if(p){
            this.parentScene = p
        }
    }


    // ===== Gestion des changement s de CSS      =============
    // ajoute l'élémment dans la liste des objet à mettre à jour dans la scene
    set needsUpdate(val){ 
       // this.cssUpdate() //DEBUG
        if(!this.parentScene) return     
        this.parentScene.addElementToUdpateList(this)
        this.#needsUpdate = true
    }



    //ajoute un callback à l'animation
    addAnimationListener(callback){
        if(!this.parentScene) return
        this.parentScene.addElementToanimList(this,callback)
    }

  
    //modif CSS via changement d'attribut
    #createMutationObserver(){
        const mo = new MutationObserver((mutationList)=>{
            for (const mutation of mutationList) {
                if (mutation.type === "attributes") {
                    this.needsUpdate = true
                }
            }
        })

        mo.observe(this,{
            subtree: false,
            attributeOldValue: true,
          })
    }


    //animation CSS qui se joue
    #checkAnimation(needUdpate = false){
        if(this.#liveEdit){
            this.needsUpdate = true
            return
        }
        this.#animationCss = false
        for(const a of this.getAnimations()){
           if(a.playState=="running"){
            this.#animationCss = true
            if(needUdpate)
            this.needsUpdate = true
            if(this.animationToPlay != a.animationName){
                  this.#startAnimation(a.animationName)
            }else if(this.#mixer){
                this.#mixer.update(this.#clock.getDelta()*this.#animationFactor);
            }
             
           }
        }
    }

    dontKeepOldCssValue(name){
        this.oldCssValue[name] = null
    }



    //Animation CSS pour piloter celle présentent dans les fichier source
    #startAnimation(name){
        this.animationToPlay = name

        if(!this.three) return
        
        this.#mixer = new THREE.AnimationMixer( this.three.children[0] ); 

        const clip = THREE.AnimationClip.findByName( this.three.animations, name);

        if(clip){
            const a = window.getComputedStyle(this).animationDuration
            const b =parseFloat(a) / CssListener.timeUnit[a.replace(/[0-9](\.[0-9])?/,'')] 
            this.#animationFactor = clip.duration/b

            
            this.#mixer.clipAction(clip).play()
        }
     }


    //Update Du CSS (appellé par la scene parente si l'objet fait partie de la liste à mettre à jour)
    cssUpdate(needUpdateAfter = true){

        // rechercher les propiété qui nous interesse
        // appliquer leur valeur
        const computedStyle =  window.getComputedStyle(this)
          for(let prop  of this.constructor.cssProperties){
            const v = computedStyle.getPropertyValue(prop)
            
            if(v){
                if( (this.#animationCss && !this.controlled) || !this.oldCssValue[prop] || this.oldCssValue[prop] != v){
                    this.oldCssValue[prop] = v
                    this[prop](v)
                }
                
            }
        }
        //check si une anim est en cours
        //si oui l'update doit boucler
        
        this.#checkAnimation(needUpdateAfter)
    }
}