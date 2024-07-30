import { Object3D } from "./object3d.js";
import * as THREE from 'three'

export class Model extends Object3D{

   

    static formatLoaders = {
        "obj" :"OBJLoader",
        "glb" : "GLTFLoader",
        "gltf":"GLTFLoader",
        "fbx" :"FBXLoader",
    }


    connectedCallback(){
        if(!this.hasAttribute('src') &&  this.tagName=="THREE-MODEL" ){
            console.warn(`${this} n'a pas d'attribut src`)
            return
        }
        let ext = this.getAttribute('src').split('.')
        ext = ext[ext.length-1].toLowerCase();
        import(`loaders/${Model.formatLoaders[ext]}.js`).then(m=>{
            const loader = new m[Model.formatLoaders[ext]]();
            
            loader.load(this.getAttribute('src'),
            fileContent=>{
               this[Model.formatLoaders[ext]](fileContent)
               this.needsUpdate = true
            })
        })
    }

    FBXLoader(content){
        this.three = content
        this.three.scale.set(0.2,0.2,0.2)

        this.#castShadows()
        super.connectedCallback()
       
        this.#setupAnimation(content)
    }

    GLTFLoader(content){
        this.three = content.scene
        this.#castShadows()
        super.connectedCallback()
        if(content.animations.length>0 )
            this.#setupAnimation(content)
    }

    #castShadows(){
        this.three.traverse(o=>{
            if(o.isObject3D){
                o.castShadow =true
                o.receiveShadow = true
            }
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
               
}

customElements.define("three-model", Model);