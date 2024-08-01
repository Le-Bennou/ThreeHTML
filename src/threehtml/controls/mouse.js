import { Controls } from "./controls.js";
import * as THREE from 'three'

export class Mouse extends Controls{
    #raycaster = new THREE.Raycaster()
    #pointer = new THREE.Vector2()

    eventListeners(){

        this.parentScene.rendererDomElement.addEventListener('mousemove',e=>{
            const rcs = this.#rayCast(e)
            this.querySelectorAll('*').forEach(el=>{
                let h = false
                rcs.forEach(rc=>{
                    if(el==rc.object._DOM){
                        h = true
                    }
                })
                if(h){
                     el._internals.states.add('hover')
                }else{
                    el._internals.states.delete('hover')
                }
                
            })
            this.state['mousemove'] = true
           
        })

        this.parentScene.rendererDomElement.addEventListener('mousedown',e=>{
            const rcs = this.#rayCast(e)
            this.querySelectorAll('*').forEach(el=>{
                let h = false
                rcs.forEach(rc=>{
                    if(el==rc.object._DOM){
                        h = true
                    }
                })
                if(h){
                     el._internals.states.add('active')
                }else{
                    el._internals.states.delete('active')
                }
                
            })
            this.state['mousedown'] = true
        })

        this.parentScene.rendererDomElement.addEventListener('mouseup',e=>{
            this.querySelectorAll('*').forEach(el=>{
                    el._internals.states.delete('active')
            })
        })
    }

   
    #rayCast(e){
        const r = this.parentScene.rendererDomElement

       
        this.#pointer.x = (e.offsetX / r.clientWidth) * 2 - 1
        this.#pointer.y = -(e.offsetY / r.clientHeight) * 2 + 1
       


        this.#raycaster.setFromCamera(this.#pointer,this.parentScene.activeCamera)

        return this.#raycaster.intersectObjects( this.parentScene.three.children );
    }
}

customElements.define('controls-mouse',Mouse)