import { CssListener } from "./abstracts/CssListener.js";
import * as THREE from 'three'
import { RGBELoader } from 'loaders/RGBELoader.js';

export class Material extends CssListener {
    three = new THREE.MeshPhysicalMaterial()
    map = null
    normalMap = null
    static loadImage(src) {
        if (src == "") {
            return null
        }
        return new THREE.TextureLoader().load(src)
    }



    "--color"(val) {
        // syntax:<color>
        // initialValue : rgb(255,255,255)
        this.three.color = new THREE.Color(val)
    }


    "--map"(val) {
        // syntax:<image>
        // initialValue : url("")

        if (val == 'url("")') {
            this.three.map = null
        }
        this.three.map = Material.loadImage(val.replace(/url\(['|"](.*?)['|"]\)/gi, "$1"))
        //this.three.needsUpdate = true
    }


    "--normalmap"(val) {
        // syntax:<image>
        // initialValue : url("")

        if (val == 'url("")') {
            this.three.normalMap = null
        }
        this.three.normalMap = Material.loadImage(val.replace(/url\(['|"](.*?)['|"]\)/gi, "$1"))
        //this.three.needsUpdate = true
    }

   
 


    "--normalscale"(val) {
        // syntax:<number>+
        // initialValue : 1

        val = val.replace(/s+/, ' ');
        val = val.replace(/s+$/, '');
        val = val.split(' ')
        if(!this.three.normalScale) return
        switch (val.length) {
            case 1:
                this.three.normalScale.x = parseFloat(val[0])
                this.three.normalScale.y = parseFloat(val[0])
                break
            case 2:
                this.three.normalScale.x = parseFloat(val[0])
                this.three.normalScale.y = parseFloat(val[1])
                break
        }

        //this.three.needsUpdate = true
    }


    "--bumpmap"(val) {
        // syntax:<image>
        // initialValue : url("")

        if (val == 'url("")') {
            this.three.bumpMap = null
        }
        this.three.bumpMap = Material.loadImage(val.replace(/url\(['|"](.*?)['|"]\)/gi, "$1"))
        //this.three.needsUpdate = true
    }

    "--bumpscale"(val) {
        // syntax:<number>+
        // initialValue : 1


       
        
        this.three.bumpScale = parseFloat(val)
            

        //this.three.needsUpdate = true
    }


    "--aomap"(val) {
        // syntax:<image>
        // initialValue : url("")

        if (val == 'url("")') {
            this.three.aoMap = null
        }
        this.three.aoMap = Material.loadImage(val.replace(/url\(['|"](.*?)['|"]\)/gi, "$1"))
        //this.three.needsUpdate = true
    }

    "--aomapintensity"(val) {
        // syntax:<number>
        // initialValue : 1
        this.three.aoMapIntensity = parseFloat(val)
        //this.three.needsUpdate = true
    }



    "--alphamap"(val) {
        // syntax:<image>
        // initialValue : url("")
        if (val == 'url("")') {
            this.three.alphaMap = null
        }
        this.three.transparent = true
        this.three.alphaMap = Material.loadImage(val.replace(/url\(['|"](.*?)['|"]\)/gi, "$1"))

        this.three.needsUpdate = true
    }


    "--alpha"(val) {
        // syntax:<number>
        // initialValue : 1
        this.three.alpha = parseFloat(val)
        //this.three.needsUpdate = true
    }

    "--roughnessmap"(val){
         // syntax:<image>
        // initialValue : url("")
        if (val == 'url("")') {
            this.three.roughnessMap = null
        }
        this.three.roughnessMap = Material.loadImage(val.replace(/url\(['|"](.*?)['|"]\)/gi, "$1"))
    }

    "--roughness"(val) {
        // syntax:<number>
        // initialValue : 1
        this.three.roughness = parseFloat(val)
        //this.three.needsUpdate = true
    }


    "--envMap"(val) {
        // syntax:<image>|<color>
        // initialValue : rgb(0,0,0)
        if (val == "rgb(0, 0, 0)" || val == "") {
            this.three.envMap = null
            return
        }

        if (val.match(/url/)) {
            const file = val.replace(/url\(["|'](.*)["|']\)/, "$1")
            if (file == "") return
            new RGBELoader().load(file, t => {
                t.mapping = THREE.EquirectangularReflectionMapping;
                this.three.envMap = t

            })
        } else {
            const col = new THREE.Color(val)
            this.three.envMap = col
        }
    }


    "--envmapintensity"(val) {
        // syntax:<number>
        // initialValue : 1
        this.three.envMapIntensity = parseFloat(val)
        this.three.needsUpdate = true
    }



"--textures-repeat"(val){
    // syntax:<number>+
    // initialValue : 1
    val = val.replace(/\s+/,' ').split(' ')
    switch(val.length){
        case 1:
            if(this.three.map) this.three.map.repeat.set(parseFloat(val[0]),parseFloat(val[0]))
            if(this.three.normalMap)this.three.normalMap.repeat.set(parseFloat(val[0]),parseFloat(val[0]))
            if(this.three.aoMap)this.three.aoMap.repeat.set(parseFloat(val[0]),parseFloat(val[0]))
            if(this.three.roughnessMap)this.three.roughnessMap.repeat.set(parseFloat(val[0]),parseFloat(val[0]))

        break
        case 2:
            if(this.three.map)this.three.map.repeat.set(parseFloat(val[0]),parseFloat(val[1]))
            if(this.three.normalMap)this.three.normalMap.repeat.set(parseFloat(val[0]),parseFloat(val[1]))
            if(this.three.aoMap)this.three.aoMap.repeat.set(parseFloat(val[0]),parseFloat(val[1]))
            if(this.three.roughnessMap)this.three.roughnessMap.repeat.set(parseFloat(val[0]),parseFloat(val[1]))
        break
    }
    if(this.three.map)this.three.map.wrapS = this.three.map.wrapT = THREE.RepeatWrapping
    if(this.three.normalMap)this.three.normalMap.wrapS = this.three.normalMap.wrapT = THREE.RepeatWrapping
    if(this.three.aoMap)this.three.aoMap.wrapS = this.three.aoMap.wrapT = THREE.RepeatWrapping
    if(this.three.roughnessMap)this.three.roughnessMap.wrapS = this.three.roughnessMap.wrapT = THREE.RepeatWrapping
}




    connectedCallback() {
        super.connectedCallback()
        if (this.hasAttribute('type')) {
            const matName = this.getAttribute('type')
            
            this.three = new THREE[`Mesh${matName}Material`]()

            this.constructor.cssProperties.forEach(prop=>{
                this.dontKeepOldCssValue(prop)
            })
        }
    }


    get material() {
        return this.three
    }





}

customElements.define("three-material", Material);