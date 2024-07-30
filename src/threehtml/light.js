import * as THREE from "three"

import {Object3D} from "./object3d.js"

export class Light extends Object3D{

    "--color"(val){
            // syntax:<color>
            //  initialValue:white
           
                this.three.color = new THREE.Color(val)
                if( this.helper)
                    this.helper.update()
            }
        
    "--intensity"(val){
        // syntax:<number>
        //  initialValue:1
        
            this.three.intensity = val
            if( this.helper)
                this.helper.update()
        }
    
    "--target-x"(val){
        // syntax:<number>
        //  initialValue:0
        
            if(!this.three || !this.three.target) return
            this.three.target.position.x = val
            if( this.helper)
                this.helper.update()
        }
    
    "--target-y"(val){
        // syntax:<number>
        //  initialValue:0
        
            if(!this.three || !this.three.target) return
            this.three.target.position.y = val
            if( this.helper)
                this.helper.update()
        }
    "--target-z"(val){
        // syntax:<number>
        //  initialValue:0
        
            if(!this.three || !this.three.target) return
            this.three.target.position.z = val
            if( this.helper)
                this.helper.update()

    }


    /* FIXME : ça marche pas cette histoire....
        convertion de coordonées de pixel dans HDR en lattitude longitude, puit world pos foireuse
    */
    "--hdrsunposition"(val){
         // syntax:*
        //  initialValue:false
        if(val=="true"){
            //récupère le hdri de la scene
            if(!this.parentScene.three.environment) return
            
            const width= this.parentScene.three.environment.source.data.width
            const height= this.parentScene.three.environment.source.data.height
            
            let long = 0
            let lat = 0
            let max = 0;
            const datas = this.parentScene.three.environment.source.data.data
    
    
            //trouve le point le plus brillant
            for(let i=0;i<datas.length / 4; i++)
            {
                const d = datas[i*4]+datas[i*4+1]+datas[i*4+2];
                
                if(max<d){
                    long = i % width
                    lat = Math.round(i / width)
                    max = d
                    
                }
            }

            //place la lampe dans le même axe FIXME
            lat = lat/(height/(Math.PI)) 
            long =long/(width/(Math.PI*2)) -Math.PI

            var phi =  long
            var theta = lat 
          
            this.three.position.x = -(15 * Math.sin(phi) * Math.cos(theta));
            this.three.position.z = 15 * Math.sin(phi) * Math.sin(theta);
            this.three.position.y = 15 * Math.cos(phi);
            if( this.helper)
                this.helper.update()
            

            


        }
    }


        three = null
        helper = null


    setSceneForHDR(scene){
       this.parentScene = scene
       this.dontKeepOldCssValue("--hdrsunposition")
       this.parentScene.addElementToUdpateList(this)
    }

   connectedCallback(){
    if(this.hasAttribute('type')){
        const  g = this.getAttribute('type')
        
        if(this[`_construct${ g.charAt(0).toUpperCase() + g.slice(1)}`]){
            this[`_construct${ g.charAt(0).toUpperCase() + g.slice(1)}`]()
        }else{
            console.warn(`Le type de lumière "${g}" n'est pas définie`)
        }
     }else{
        console.warn(`Il faut préciser un type de lampe`)
     }

     super.connectedCallback()

     if(!this.hasAttribute('debug')) return
     this.helper = new THREE.DirectionalLightHelper( this.three, 5 );
     this.parentScene.three.add(this.helper)
   }

   _constructDirectional(){

        this.three = new THREE.DirectionalLight()
        this.three.castShadow = true;

        this.three.shadow.mapSize.width = 1024; // default
        this.three.shadow.mapSize.height = 1024; // default
        this.three.shadow.camera.near = 0.1; // default
        this.three.shadow.camera.far = 1000; // default
        this.three.shadow.bias =-0.00002;

   }
   
   _constructAmbient(){
        this.three = new THREE.AmbientLight()
    }

   

   

   

    targetX(val){
        if(!this.three || !this.three.target) return
        this.three.target.position.x = val
        if( this.helper)
            this.helper.update()
    }

    targetY(val){
        if(!this.three || !this.three.target) return
        this.three.target.position.y = val
        if( this.helper)
            this.helper.update()
    }

    targetZ(val){
        if(!this.three || !this.three.target) return
        this.three.target.position.z = val
        if( this.helper)
            this.helper.update()
    }


}

customElements.define("three-light", Light);