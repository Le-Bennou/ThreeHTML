# &lt;three-ligth&gt;

[back](../readme.md)

Add a source - light in the Scene

```html
<three-light type="LigthType"></three-light>
```


# Style

Inhérit of  [&lt;three-group&gt;](threegroup.md#styles) css properties

```Css

/* général properties */
three-light{
    /*the color of the ligth*/
    /*animatable*/
    --color:<color>;

    /* the intensity of the light*/
    /*animatable*/
    --intensity<number>;
}


/*type-specific properties*/
three-light[type="Directional"]{
    /*where the light point (default in the world center aka 0 0 0)*/
    /*animatable*/
    --target-x<number>;
    --target-y<number>;
    --target-z<number>;
}

```

## Attributes
 - type
   - **Directional**
   - **Ambient**
   - ❌ Spot