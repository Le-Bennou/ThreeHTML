export class Controls extends HTMLElement{

    state = {};
    constructor(){
        super()
      if(CSS.supports("selector(:state(checked))")){
        this._internals = this.attachInternals();
       }else{
         console.warn('Votre Navigateur ne supporte pas les custom states')
       }
       

       let  p =this.parentNode
       while(p && p.tagName!="THREE-SCENE"){
         p = p.parentNode
       }
       if(!p) return
        
        p.addElementToanimList(this,"updateControls")

        this.parentScene = p
        this.eventListeners()
    }

    updateControls(){
        for(let s in this.state){
            if(this.state[s]==true){
                this.#addCssState(s)
                this.#dispatchEvent(s+'Down')
                this.#callAttributeFunction(s+'Down')
                this.#updateChilds()
            }else if(this.state[s]==false){
                this.#deleteCssState(s)
                this.#dispatchEvent(s+"Up")
                this.#callAttributeFunction(s+'Up')
                this.#updateChilds()
                delete this.state[s]
            }
        }
        
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
        
        this.querySelectorAll('*').forEach(el=>{
            if(el.isThreeElement && el.hasAttribute(`on${name}`)){
                new Function(el.getAttribute(`on${name}`)).call(el);
            }
        })

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

