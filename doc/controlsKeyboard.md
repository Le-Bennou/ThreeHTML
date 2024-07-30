# &lt;controls-keyboard&gt;

[back](../readme.md)

An interface to interact with input controls (keyboard,gamepad).

It give the ability to react to key down or up with CSS and Javascript

# <a name="styles"></a>Style
In css you have to use the state() pseudo-class and pass it the name of the key,
the three object that you want to manipulate had to be in the childs tree of your controls.

The Css selector target the child object when is parent has a sate corrsponding to the key pressed

ex :

```HTML
 <controls-keyboard>
    <three-primitive geometry="Cube"></three-primitive>
 </controls-keyboard>
```

```Css
controls-keyboard:state(ArrowUp) three-primitive{
        --translate-z :1;
    }

```

## Attributes
 None