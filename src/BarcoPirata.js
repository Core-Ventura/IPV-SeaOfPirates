var BarcoPirata = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    ctor:function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.pirate_ship_png);
        // Cuerpo estática , no le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);
        this.body.setPos(posicion);
        this.sprite.setBody(this.body);
        this.space.addBody(this.body);
    
        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width * 0.6,
            this.sprite.getContentSize().height * 0.8);
        this.shape.setCollisionType(tipoBarcoPirata);
        // Forma dinamica
        this.space.addShape(this.shape);
        // añadir sprite a la capa
        layer.addChild(this.sprite,10);

    }, eliminar: function (){
          // quita la forma
          this.space.removeShape(this.shape);
          // quita el cuerpo *opcional, funciona igual
          // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
          // this.space.removeBody(shape.getBody());
          // quita el sprite
          this.layer.removeChild(this.sprite);
       }



});

