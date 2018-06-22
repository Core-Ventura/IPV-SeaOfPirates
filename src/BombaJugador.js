var BombaJugador = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,

ctor:function (space, posicion, layer) {
    this.space = space;
    this.layer = layer;

    // Sprite de la bomba
    this.sprite = new cc.PhysicsSprite(res.bomb_player_png);

    // Body de la bomba
    this.body = new cp.Body(5, Infinity);
    this.body.setPos(posicion);
    this.sprite.setBody(this.body);
    this.space.addBody(this.body);

    // Shape de la bomba
    this.shape =new cp.CircleShape(this.body, this.sprite.getContentSize().width, cp.vzero);
    this.shape.setFriction(1);
    this.shape.setElasticity(0);
    // Forma dinamica
    this.shape.setSensor(true);
    this.space.addShape(this.shape);
    this.shape.setCollisionType(tipoBombaJugador);
    // Agregar al layer
    this.layer.addChild(this.sprite, 10);


    // Depuración
    //this.depuracion = new cc.PhysicsDebugNode(this.space);
    //this.layer.addChild(this.depuracion, 10);

},eliminar: function (){
    // quita la forma
    this.space.removeShape(this.shape);
    // quita el cuerpo
    this.space.removeBody(this.shape.getBody());
    // quita el sprite
    this.layer.removeChild(this.sprite);
}

});
