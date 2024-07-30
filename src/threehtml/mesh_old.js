import * as THREE from 'three'
import { Object3D } from './object3d.js'

export class Mesh extends Object3D{
    three = null
   
    static formatLoader = {
        "obj" :"OBJLoader",
        "glb" : "GLTFLoader",
        "gltf":"GLTFLoader",
        "fbx" :"FBXLoader",
    }

    #materialsToLink = {}


    connectedCallback(){
        super.connectedCallback()

        if(this.hasAttribute('geometry')){
            const  g = this.getAttribute('geometry')
           this[`_construct${ g.charAt(0).toUpperCase() + g.slice(1)}`]()
           
        }

        if(this.hasAttribute('src')){
           const  src = this.getAttribute('src')
           this._loadFile(src)
        
        }
if(!this.three) return
        this.three.castShadow = true;
        this.three.receiveShadow = true;
        
    }

    setMaterial(material){
        this.three.material = material
        this.three.material.needsUpdate = true;
    }

    _constructBox(){
        const width = this.getAttribute('width') || 1
        const height = this.getAttribute('height') || 1
        const depth = this.getAttribute('depth') || 1
        const geom = new THREE.BoxGeometry(width,height,depth)
        this.three = new THREE.Mesh(geom)
    }

    _constructSphere(){
        const radius = this.getAttribute('radius') || 1
        const widthSegments = this.getAttribute('widthsegments') || 32
        const heightSegments = this.getAttribute('heightsegments') || 16
        const geom = new THREE.SphereGeometry(radius,widthSegments,heightSegments)
        this.three = new THREE.Mesh(geom)
    }

    _constructCapsule(){
        const radius = this.getAttribute('radius') || 1
        const length = this.getAttribute('length') || 1
        const capSegments = this.getAttribute('capSegments') || 4
        const radialSegments = this.getAttribute('radialSegments') || 8
        const geom = new THREE.CapsuleGeometry(radius,length,capSegments,radialSegments)
        this.three = new THREE.Mesh(geom)
    }

    _loadFile(src){
        
        //get module from format
        let ext = src.split('.')
        ext = ext[ext.length-1].toLowerCase();
        

        import(`loaders/${Mesh.formatLoader[ext]}.js`).then(m=>{
            const loader = new m[Mesh.formatLoader[ext]]();
            let dracoLoader =null
            /*if(Mesh.formatLoader[ext] == 'GLTFLoader'){
                dracoLoader = new DRACOLoader()
            }*/

            loader.load(src,
            gltf=>{
               

                if(gltf.scene){
                    this.three = gltf.scene
                }else{
                    this.three = gltf
                }

                if(gltf.animations.length>0 && !document.querySelector('#modelKeyframes')){
                    let s = document.createElement('style')
                    s.id="modelKeyframes"
                    document.head.appendChild(s)
                }
                
                gltf.animations.forEach(an=>{
                    document.querySelector('#modelKeyframes').innerText += `
                        @keyFrames ${an.name.replace(/([^a-zA-Z0-9])/g,"\\$1")} {}
                    `
                    let a = an.clone()
                    if(!THREE.AnimationClip.findByName(this.three.animations,a.name)){
                        this.three.animations.push(a)
                    }
                    
                })

                this.parentScene.three.add(this.three)
                this.three.traverse(o=>{
                    
                    if(o.type=="Mesh" || o.type=="SkinnedMesh"){
                        
                        o.castShadow = true
                        o.receiveShadow = true
                        
                        o.material.envMap = this.parentScene.three.environment
                        
                    }
            
                })

                if(this.animatipnToPlay){
                    this.startAnimation(this.animatipnToPlay)
                }
            })
        })
    }


   linkMaterial(id,material){
    let check  =false
    if(!this.three) return
        this.three.traverse(o=>{
            if(o.material && o.material.name==id){
                material.three =  o.material
                material.three.needsToUpadte()
                check = true
            }
        })
        if(!check){
            this.#materialsToLink[id] = material
        }
    }
    
}

customElements.define("three-mesh", Mesh);