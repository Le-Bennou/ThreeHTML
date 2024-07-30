
import { CssListener } from "./abstracts/CssListener.js";

export class Test extends CssListener{
    static cssProperties = CssListener.cssProperties.concat([
        {
            name:'--test',
            syntax:"<number>",
            initialValue:0,
            function:(target,val)=>{
                console.log(val)
            }
        }
    ])
}


customElements.define('three-test',Test)