
import * as THREE from 'three'
import { Object3D } from "./object3d.js";


export class PerspectiveCamera extends Object3D{
    #controls = null
    
    three = new THREE.PerspectiveCamera(75,1,0.1, 1000 );

    "--fov"(val){
        // syntax:<number>
        //  initialValue:50
        this.three.fov = parseFloat(val)
    }


    "--active"(val){
        // syntax:*
        //  initialValue:false
        if(val == "true")
        this.parentScene.activeCamera = this.three
    }
        


    connectedCallback(){
        super.connectedCallback()
        this.init()
    }

    init(){
        if(this.hasAttribute('controls')){
            import(`controls/${this.getAttribute('controls')}Controls.js`).then(a=>{
                this.#controls = new a[`${this.getAttribute('controls')}Controls`](this.three,this.parentScene.rendererDomElement)
                this.addAnimationListener("updateControls")
            })
            
           }
    }


    updateControls(){
        this.#controls.update()
    }

    fov(val){
        this.three.fov = parseFloat(val)
    }

    active(val){
        if(val =="true"){
            this.parentScene.activeCamera = this.three
        }        
    }
}


customElements.define("three-perspectivecamera", PerspectiveCamera);