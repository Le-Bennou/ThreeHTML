# ThreeHTML

## Description
**ThreeHTML** is a library to use ThreeJs only with HTML tags and CSS rules.

## Usage

First you have to link to ThreeJs Library. To Make that you have to define an **importmap** that links to the threejs files;

Put these lines in the head tag of your html file.(Of course you can use a CDN)
```html
 <script type="importmap">

      {
        "imports": {
            "three": "path/to/three.module.min.js",
            "controls/":"path/to/controls/", // link to the folder
            "loaders/":"path/to/loaders/"// link to the folder
        }
    }

    </script>
```
Then you have link to **ThreeHTML**
```HTML
<script defer src="js/ThreeHTML.js" type="module"></script>
```

the **type="module"** atributes is requiered

## Getting started

In order to work you have -at least- to put a scene, a camera and an object

```HTML
<three-scene>
    <three-perspectivecamera></three-perspectivecamera>
    <three-primitive geometry="Box"></three-primitive>
</three-scene>
```

## Détailled Documentation

- [&lt;three-scene&gt;](doc/threeScene.md)
- [&lt;three-group&gt;](doc/threegroup.md)
- [&lt;three-perspectivecamera&gt;](doc/threePerspectiveCamera.md)
- [&lt;three-light&gt;](doc/threeLigth.md)
- [&lt;controls-keyboardt&gt;](doc/controlsKeyboard.md)