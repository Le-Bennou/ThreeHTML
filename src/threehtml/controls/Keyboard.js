import { Controls } from "./controls.js";
export class KeyBoard extends Controls{

   

    eventListeners(){

        document.addEventListener('keydown',e=>{
            this.state[e.code] = true
        })

        document.addEventListener('keyup',e=>{
            this.state[e.code] = false
        })
    }

   
    
}

customElements.define('controls-keyboard',KeyBoard)