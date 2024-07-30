# &lt;three-group&gt;

[back](../readme.md)

It's a dummy object, it allow to control the position/rotation of all its childrens elements.

# <a name="styles"></a>Style

```Css
three-group{
    /* positionning in wolrd space */
    /* animatable */
    --position-x : <number>; 
    --position-y : <number>;
    --position-z : <number>;

    /*rotate in world space */
    --rotation-x : <angle>; 
    --rotation-y : <angle>;
    --rotation-z : <angle>;

    /*move in local space (keep the transform after applied)*/
    /* animatable */
    --translate-x : <number>;
    --translate-y : <number>;
    --translate-z : <number>;

    /*rotate in local space (keep the transform after applied)*/
    --rotate-x : <angle>;
    --rotate-y : <angle>;
    --rotate-z : <angle>;

    /*set the element visible or not in the 3d-world */
    --visible:<boolean> true || false;
}

```

## Attributes
 - **Name** if the parent 3d content came from a file then the tags is linked to the correponding 3d object in the scene (find by is name)