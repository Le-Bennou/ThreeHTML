import * as THREE from 'three'
import { CssListener } from "./abstracts/CssListener.js";
import { RGBELoader } from 'loaders/RGBELoader.js';
import {GLTFLoader} from 'loaders/GLTFLoader.js'

export class Scene extends CssListener{

    #toUpdate = []
    #animList = []
    three = new THREE.Scene()
    #renderer = new THREE.WebGLRenderer()
    #activeCamera = null

    "--environment"(val){
            //syntax:<image>|<color>
            //initialValue : rgb(0,0,0)
                if(val=="rgb(0, 0,0)"){ // la couleur noir équivaut à null 
                    this.three.environement = null
                    return
                }
                if(val.match(/url/)){ // TODO : pouvoir charger un autre format d'image que HDR
                    new RGBELoader().load(val.replace(/url\(["|'](.*)["|']\)/,"$1"),t=>{
                        t.mapping = THREE.EquirectangularReflectionMapping;  
                        this.three.environment= t
                        this.three.background = t

                        this.querySelectorAll('three-light').forEach(l=>{
                            l.setSceneForHDR(this)
                        })
                    })   
                     
                    this.three.background = this.three.environement 
                    
                }else{
                    const col = new THREE.Color(val)
                    this.three.environement= col
                    this.three.background = col
                }
            }

            "--environmentintensity"(val){
                //syntax:<number>
                //initialValue :0
            

            this.three.environmentIntensity =parseFloat(val)
            }

            "--backgroundblurriness"(val){
                //syntax:<number>
                //initialValue :0
            

            this.three.backgroundBlurriness =parseFloat(val)
            }

    "--environmentrotation-x"(val){
            //syntax:<angle>
            //initialValue :0deg
            const a = this.getAngleValue(val)
            this.three.environmentRotation.x =a
            this.three.backgroundRotation.x =a
    }

        "--environmentrotation-y"(val){
            //syntax:<angle>
            //initialValue :0deg
            const a = this.getAngleValue(val)
            this.three.environmentRotation.y =a
            this.three.backgroundRotation.y =a
    }

    "--environmentrotation-z"(val){
        //syntax:<angle>
        //initialValue :0deg
        const a = this.getAngleValue(val)
            this.three.environmentRotation.z =a
            this.three.backgroundRotation.z =a
       
    }
    constructor(){
        super()
        window.addEventListener('resize',()=>{
            this.changeSize();
        },false)
        
        this.#createDom()
    }

    // === création du Shadow Dom
    #createDom(){
        this._shadow = this.attachShadow({ mode: "open" });
        this._shadow.innerHTML = `
        <slot></slot>
        <style>
        :host{
            display:block;

            width:0;
            height:0;
        }

        </style>
    `
    }

    get rendererDomElement(){
        return this.#renderer.domElement
    }

    set activeCamera(val){
        this.#activeCamera = val
        this.changeSize()
    }

   
    connectedCallback(){
        super.connectedCallback()

        if(this.hasAttribute('src')){
            this.#loadScene(this.getAttribute('src'))
        }

        this._shadow.appendChild(this.#renderer.domElement)
        this.#renderer.shadowMap.enabled = true;
        this.#renderer.shadowMap.autoUpdate = true;
        this.#renderer.physicallyCorrectLights = true

        this.changeSize()
        this.#update() // lance les animations possibles
    }

    #loadScene(src){
        const loader = new GLTFLoader()
        loader.load(src,gltf=>{
            this.three.add(gltf.scene.clone(true))
            console.log(this.three)
            this.three.traverse(o=>{
                if(o.type=="PerspectiveCamera"){
                    this.#activeCamera = o
                }
                if(o.type.match(/light/gi)){
                    o.power /=1000
                    o.shadow.mapSize.width = 1024; // default
                    o.shadow.mapSize.height = 1024; // default
                    o.shadow.camera.near = 0.1; // default
                    o.shadow.camera.far = 1000; // default
                    o.shadow.bias =-0.00002;
                    

                }
                if(o.name){
                    const el = this.querySelector(`[name=${o.name}]`)
                    if(el){
                        el.assignFromAsset(o)
                    
                    }
                }
                
                o.castShadow = true
                o.receiveShadow = true
                
            })
            this.changeSize()
            this.dontKeepOldCssValue('--environment')
            this.addElementToUdpateList(this)
            this.#setupAnimation(gltf)
        })

    }

    #setupAnimation(content){
        if(content.animations.length<=0 ) return
        if(!document.querySelector('#modelKeyframes')){
            let s = document.createElement('style')
            s.id="modelKeyframes"
            document.head.appendChild(s)
        }

        content.animations.forEach(an=>{
            document.querySelector('#modelKeyframes').innerText += `
                @keyFrames ${an.name.replace(/([^a-zA-Z0-9])/g,"\\$1")} {}
            `
            let a = an.clone()

            if(!THREE.AnimationClip.findByName(this.three.animations,a.name)){
                console.log(`Animtion "${a.name}" ajoutée`)
                this.three.animations.push(a)
            }
            
        })
    }


    // ================= Mise à jour de la taille de l'élément =========== 
    changeSize(){ 
        let bb = this.getBoundingClientRect()
        this.#renderer.setSize(bb.width,bb.height)
        this.#updateCamerasAspect(bb)
    }

    // retouche les proportions des caméras présentent 
    // TODO: orthographic Camera
    #updateCamerasAspect(bb){
        this.querySelectorAll('three-perspectivecamera').forEach(cam=>{
            if(!cam.three) return
            cam.three.aspect = bb.width/bb.height
            cam.three.updateProjectionMatrix()
        })
    }

 
    // === les enfants de la scène indiquent qu'ils on besoin d'une mise à jour via cette methode ============
    addElementToUdpateList(el){
 
        this.#toUpdate.push(el)
    }

    // === les éléments de lascène indiquent qu'ils ont besoin d'appeler un callback à chaque boucle d'anim ====
    addElementToanimList(el,callback){
        
        this.#animList.push({element:el,callback:callback})
    }


    // =================== boucle d'update ===============
    #update(){
        requestAnimationFrame(()=>{
            this.#update()
        })

        this.#animList.forEach(a=>{            
            a.element[a.callback]() // TODO: ajouter le temps écoulé pour ceux qui en ont besoin
        })

         const nb = this.#toUpdate.length

         for(let  i = 0; i < nb ; i++){
            const el = this.#toUpdate.shift()
            
            el.cssUpdate()
         }

        

         if(!this.#activeCamera) return

         this.#renderer.render(this.three,this.#activeCamera)
    }


}

customElements.define('three-scene',Scene)