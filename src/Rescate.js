var Rescate = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    layer:null,
    ctor:function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.rescate_png);
        // Cuerpo estática , no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        var radio = this.sprite.getContentSize().width / 2;
        // forma
        this.shape = new cp.CircleShape(body, radio , cp.vzero);
        this.shape.setCollisionType(tipoRescate);
        // Nunca genera colisiones reales
        this.shape.setSensor(true);
        // forma estática
        this.space.addStaticShape(this.shape);
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

