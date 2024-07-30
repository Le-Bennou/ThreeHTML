import * as THREE from 'three'
import { CssListener } from './abstracts/CssListener.js'


function uniqid(prefix = "", random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
};


export class Object3D extends CssListener{

    three = new THREE.Group()

    
  
    "--position-x"(val){
        // syntax:<number>
        // initialValue:0
        this.three.position.x = parseFloat(val)
    }

    "--position-y"(val){
        //    syntax:<number>
        //    initialValue:0
        this.three.position.y = parseFloat(val)
    }

    "--position-z"(val){
            //syntax:<number>
            //initialValue:0
            this.three.position.z = parseFloat(val)
    }



    "--rotation-x"(val){
        // syntax:<angle>
        //initialValue:0deg
        this.three.rotation.x = this.getAngleValue(val)
    }

    "--rotation-y"(val){
        // syntax:<angle>
        //initialValue:0deg
        this.three.rotation.y = this.getAngleValue(val)
    }

    "--rotation-z"(val){
        // syntax:<angle>
        //initialValue:0deg
        this.three.rotation.z = this.getAngleValue(val)
    }

        //TODO : Euler Angles order
        

    "--translate-x"(val){
        // syntax:<number>
        //initialValue:0
        this.three.translateX(parseFloat(val))
        this.dontKeepOldCssValue("--translate-x")
    }

    "--translate-y"(val){
        // syntax:<number>
        //initialValue:0
        this.three.translateY(parseFloat(val))
        this.dontKeepOldCssValue("--translate-y")
    }

    "--translate-z"(val){
        // syntax:<number>
        //initialValue:0
        this.three.translateZ(parseFloat(val))
        this.dontKeepOldCssValue("--translate-z")

    }

    "--rotate-x"(val){
        // syntax:<angle>
        //initialValue:0deg
        this.three.rotateX(this.getAngleValue(val))
        this.dontKeepOldCssValue("--rotate-x")
    }

    "--rotate-y"(val){
        // syntax:<angle>
        //initialValue:0deg
        this.three.rotateY(this.getAngleValue(val))
        this.dontKeepOldCssValue("--rotate-y")
    }

    "--rotate-z"(val){
        // syntax:<angle>
        //initialValue:0deg
        this.three.rotateZ(this.getAngleValue(val))
        this.dontKeepOldCssValue("--rotate-z")

    }




    "--visible"(val){
        // syntax : *
        // initilaValue : true
        this.three.visible = val
    }
   
    assignFromAsset(object){
        this.three = object
        this.needsUpdate = true
        let u = uniqid('obj',true)
        this.setAttribute('u',u)

        document.querySelector('#test').innerHTML += `
            [u="${u}"]{
                --position-x : ${this.three.position.x};
                --position-y : ${this.three.position.y};
                --position-z : ${this.three.position.z};

                --rotation-x : ${this.three.rotation.x}rad;
                --rotation-y : ${this.three.rotation.y}rad;
                --rotation-z : ${this.three.rotation.z}rad;
            }
        
        `

        if(this.assignChildrenMaterial){
            this.assignChildrenMaterial()
        }
        if(this.init) this.init()
    }
    
}

customElements.define("three-group", Object3D);