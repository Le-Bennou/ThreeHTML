import * as THREE from 'three'
import { Object3D } from './object3d.js'

export class Primitive extends Object3D{
    
    

    connectedCallback(){
        if(this.hasAttribute('geometry')){
            const  g = this.getAttribute('geometry')
            if(this[`_construct${ g.charAt(0).toUpperCase() + g.slice(1)}`]){
                this[`_construct${ g.charAt(0).toUpperCase() + g.slice(1)}`]()
            }else{
                console.warn(`La géometrie "${g}" n'est pas définie`)
            }
        }else{
            if(this.tagName=="THREE-PRIMITIVE" ) console.warn(`L'attribut de la primitive n'est pas renseigné`) 
        }
        if(!this.three) return
        this.three.castShadow = true;
        this.three.receiveShadow = true;
        super.connectedCallback()
        this.assignChildrenMaterial()
       
    }

    assignChildrenMaterial(){
        this.querySelectorAll(':scope>three-material').forEach(m=>{
            m.constructor.cssProperties.forEach(p=>{
                this.dontKeepOldCssValue(p)
            })
            if(m.material){

                if(!this.three.material || !this.three.material.isTHreeHTML ){
                    this.three.material = m.material
                }else{
                    m.three = this.three.material
                    m.three.isTHreeHTML = true
                }                
                this.three.material.needsToUpdate = true
                 m.needsUpdate = true
                
            }
        })
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



}

customElements.define('three-primitive',Primitive)