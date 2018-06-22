var Barco = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,

ctor:function (space, posicion, layer) {
    this.space = space;
    this.layer = layer;

    // Sprite del barco
    this.sprite = new cc.PhysicsSprite(res.ship_png);

    // Body del barco
    this.body = new cp.Body(5, Infinity);
    this.body.setPos(posicion);
    this.sprite.setBody(this.body);
    this.space.addBody(this.body);

    // Shape del barco
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width * 0.6,
        this.sprite.getContentSize().height * 0.8);
    this.shape.setCollisionType(tipoBarco);
    this.shape.setFriction(1);
    this.shape.setElasticity(0);
    // Forma dinamica
    this.space.addShape(this.shape);
    // Agregar al layer
    this.layer.addChild(this.sprite, 11);


    // Depuración
    //this.depuracion = new cc.PhysicsDebugNode(this.space);
    //this.layer.addChild(this.depuracion, 11);


    }, moverIzquierda:function() {
        this.body.vy = 0;
        if ( this.body.vx > -100){
            this.body.applyImpulse(cp.v(-100, 0), cp.v(0, 0));
        }
        this.sprite.rotation =270;

    }, moverDerecha:function() {
        this.body.vy = 0;
        if ( this.body.vx < 100){
            this.body.applyImpulse(cp.v(100, 0), cp.v(0, 0));
        }
        this.sprite.rotation =90;

    }, moverArriba:function() {
        this.body.vx = 0;
        if ( this.body.vy < 100){
            this.body.applyImpulse(cp.v(0, 100), cp.v(0, 0));
        }
        this.sprite.rotation =0;

    }, moverAbajo:function() {
       this.body.vx = 0;
       if ( this.body.vy > -100){
            this.body.applyImpulse(cp.v(0, -100), cp.v(0, 0));
       }
       this.sprite.rotation =180;

    }, detener : function() {
       this.body.vx = 0;
       this.body.vy = 0;
    }
});
