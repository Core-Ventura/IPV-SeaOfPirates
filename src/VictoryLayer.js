var VictoryLayer = cc.LayerColor.extend({
    ctor:function(){
        this._super(cc.color(0,0,0,0));
        var size = cc.director.getWinSize();
        this.setPosition(posBarco.x-400, posBarco.y-225);
        this.setScale(1.2,1.2);

        var fondoGameOver = new cc.Sprite(res.victory_png);
        fondoGameOver.setPosition(cc.p(size.width/2, size.height/2));
        fondoGameOver.setScale(size.width / fondoGameOver.width);
        this.addChild(fondoGameOver, 10);

        var botonReiniciar  = new cc.MenuItemSprite(
            new cc.Sprite(res.boton_jugar_png),
            new cc.Sprite(res.boton_jugar_png),
            this.pulsarReiniciar, this);

        var menu = new cc.Menu(botonReiniciar);
        //menu.setPosition(posBarco);
        this.addChild(menu, 20);

    }, pulsarReiniciar:function () {
        //Vuelve a inicializar la escena Principal.
        cc.director.runScene(new GameScene());
    }
});