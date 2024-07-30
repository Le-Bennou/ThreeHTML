export class KeyBoard extends HTMLElement{

    #state = {};
    constructor(){
        super()
      if(CSS.supports("selector(:state(checked))")){
        this._internals = this.attachInternals();
       }else{
         console.warn('Votre Navigateur ne supporte pas les custom states')
       }
       this.#eventListeners()

       let  p =this.parentNode
       while(p && p.tagName!="THREE-SCENE"){
         p = p.parentNode
       }
       if(p) p.addElementToanimList(this,"updateControls")
    }

    updateControls(){
        for(let s in this.#state){
            if(this.#state[s]==true){
                this.#addCssState(s)
                this.#dispatchEvent(s+'Down')
                this.#callAttributeFunction(s+'Down')
                this.#updateChilds()
            }else if(this.#state[s]==false){
                this.#deleteCssState(s)
                this.#dispatchEvent(s+"Up")
                this.#callAttributeFunction(s+'Up')
                this.#updateChilds()
                delete this.#state[s]
            }
        }
        
    }

    #eventListeners(){
        document.addEventListener('keydown',e=>{
            this.#state[e.key] = true
            
        })

        document.addEventListener('keyup',e=>{
            this.#state[e.key] = false
            
        })
    }

    #addCssState(name){
        this._internals.states.add(name)
    }

    #deleteCssState(name){
        this._internals.states.delete(name)
    }

    #dispatchEvent(name){
        const event = new Event(name)
        this.dispatchEvent(event)
    }

    #callAttributeFunction(name){
        if(this.hasAttribute(`on${name}`)){
            new Function(this.getAttribute(`on${name}`)).call(this);
        }
    }

    #updateChilds(){
        this.querySelectorAll('*').forEach(el=>{
            if(el.isThreeElement){
                el.controlled = true
                el.cssUpdate(false)
            }
        })
    }
    
}

customElements.define('controls-keyboard',KeyBoard)