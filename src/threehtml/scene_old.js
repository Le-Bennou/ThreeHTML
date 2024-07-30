

import * as THREE from 'three'
import { Object3D } from "./object3d.js";
import { RGBELoader } from '../lib/loaders/RGBELoader.js';


export class Scene extends Object3D{

    static sCssProperties = Object3D.sCssProperties.concat([
        {
            'width':
            {
                syntax:'<length>',initialValue:0,function:'changeSize'
            }
        },
        {
            'height':
            {
                syntax:'<length>',initialValue:0,function:'changeSize'
            }
        },
        {"--environement":{syntax:'<url>|<color>',initialValue:"Magenta",function:"environement"}}
])


    three = new THREE.Scene()
    #renderer = new THREE.WebGLRenderer()

    #activeCamera = null

    constructor(){
        super()
        this.addAnimationListener('_render')

        window.addEventListener('resize',()=>{
            
            this.changeSize();
        },false)
    }

    connectedCallback(){
        super.connectedCallback()
        this._shadow.appendChild(this.#renderer.domElement)
        this.#renderer.shadowMap.enabled = true;
        this.#renderer.shadowMap.autoUpdate = true;
    }

    changeSize(val){ // appelé par CSSUpdate
        
        let bb = this.getBoundingClientRect()
        this.#renderer.setSize(bb.width,bb.height)
        this.#updateCamerasAspect(bb)
    }

    environement(val){
        
        if(val=="rgb(255, 0, 255)"){
            this.three.environement = null
            return
        }
        if(val.match(/url/)){
            new RGBELoader().load(val.replace(/url\("(.*)"\)/,"$1"),t=>{
                t.mapping = THREE.EquirectangularReflectionMapping;  
                this.three.environment= t
                this.three.background = t
            })
             
           // this.three.background = this.three.environement
        }else{
            const col = new THREE.Color(val)
            this.three.environement= col
                this.three.background = col
        }
    }

    #updateCamerasAspect(bb){
        this.querySelectorAll('three-perspectivecamera').forEach(cam=>{
            cam.three.aspect = bb.width/bb.height
            cam.three.updateProjectionMatrix()
        })
    }

    get rendererDomElement(){
        return this.#renderer.domElement
    }

    set activeCamera(cam){
        let bb = this.getBoundingClientRect()
        cam.aspect = bb.width/bb.height
        cam.updateProjectionMatrix()
        this.#activeCamera = cam
    }

    _render(){
        if(!this.#activeCamera) return
        this.#renderer.render(this.three,this.#activeCamera)
    }
}

customElements.define("three-scene", Scene);