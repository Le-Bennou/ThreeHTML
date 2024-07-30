# &lt;three-scene&gt;

[back](../readme.md)

This is the main element where the render occur.

## Style

All block type element's styles are avaible, the render canvas will adapte it's size accordingly to the **three-scene" element.

```CSS
    three-scene{
        /*load an .hdr file that will be used as background and to light the scene*/ 
        --environment :<image>;
    }
```

## Attributes

- ❌ src
    Load a scene from a file and put it in the world
- ❌ assets
    Load a scene from a file but keep it in memory (not visible)

<small>❌ => not implemented yet but will be soon</small>