import {CSS} from "./css.js"

export class Animation extends CSS{
    toAnimates = []

    constructor(){
        super()
        this.toAnimates = []

        
    }

    connectedCallback(){
        super.connectedCallback()
        this._anim()
    }

    addAnimationListener(callback){
        this.toAnimates.push(callback)
    }

    _anim(){
        requestAnimationFrame((elapsedTime)=>{
            this._anim()
            this.toAnimates.forEach(method=>{
                this[method](elapsedTime)
            })
        })
    }



    
}