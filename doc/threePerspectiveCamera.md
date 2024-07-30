# &lt;three-perspectivecamera&gt;

[back](../readme.md)

Place a Perspective Camera into the scene

```html
<three-perspectivecamera></three-perspectivecamera>
```


# Style

Inhérit of  [&lt;three-group&gt;](threegroup.md#styles) css properties

```Css

three-perspectivecamera{
    /*the focal angle*/
    /*animatable*/
    --fov:<number>; //TODO

    /*is the camera used to render the scene*/
    --active:<boolean> true || false;
}



```

## Attributes
 - controls
    
    Permet d'interagir avec la camera via la souris (ou autre input)
    
    Si une animation css s'applique à la camera le control pert la main
   - **Orbit**
   - .... (y en a plein...flemme pour l'instant de tout documenter)
