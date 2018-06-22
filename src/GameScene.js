var tipoBarco = 1;
var tipoRescate = 2;
var tipoBombaJugador = 3;
var tipoBorde = 4;
var tipoBarcoPirata = 5;
var tipoBombaPirata = 6;
var posBarco;

var GameLayer = cc.Layer.extend({
    barco:null,
    space:null,
    tecla:0,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    layer:null,
    rescates:[],
    bombasJugador:[],
    barcosPirata:[],
    bombasPirata:[],
    score:10, // Número de rescates a conseguir para ganar la partida
    labelScore:null,
    formasEliminar:[],
    velocidadBarcosPirata:150,
    delay:0,

    ctor:function () {
        this._super();
        var size = cc.winSize;

        this.layer = this;
        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();
       
        // Debug
        //this.depuracion = new cc.PhysicsDebugNode(this.space);
        //this.addChild(this.depuracion, 10);
       
        // Carga del mapa
        this.cargarMapa();
        this.scheduleUpdate();

        this.space.addCollisionHandler(tipoBarco, tipoRescate,
            null, this.colisionBarcoConRescate.bind(this), null, null);

        this.space.addCollisionHandler(tipoBombaJugador, tipoBorde,
            null, this.colisionBombaJugadorConBorde.bind(this), null, null);

        this.space.addCollisionHandler(tipoBarco, tipoBarcoPirata,
            null, this.colisionBarcoConBarcoPirata.bind(this), null, null);

        this.space.addCollisionHandler(tipoBombaJugador, tipoBarcoPirata,
            null, this.colisionBombaJugadorConBarcoPirata.bind(this), null, null);
        
        this.space.addCollisionHandler(tipoBombaPirata, tipoBorde,
            null, this.colisionBombaPirataConBorde.bind(this), null, null);

        this.space.addCollisionHandler(tipoBombaPirata, tipoBarco,
            null, this.colisionBombaPirataConBarco.bind(this), null, null);

        // Barco jugador
        this.barco = new Barco(this.space,
              cc.p(size.width/2, size.height/2), this);

        // Listener
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada,
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.mousePulsado,
        }, this);

        this.labelScore = new cc.LabelTTF(this.score.toString(), "Lobster");
        this.labelScore.setFontSize(12);
        this.labelScore.setPosition(cc.p(this.barco.body.p.x, this.barco.body.p.y));
        this.labelScore.rotation = 180;
        this.addChild(this.labelScore,15);

        return true;

    },update:function (dt) {
        this.space.step(dt);

        var posicionXCamara = this.barco.body.p.x - this.getContentSize().width/2;
        var posicionYCamara = this.barco.body.p.y - this.getContentSize().height/2;

        if ( posicionXCamara < 0 ){
          posicionXCamara = 0;
        }
        if ( posicionXCamara > this.mapaAncho - this.getContentSize().width ){
          posicionXCamara = this.mapaAncho - this.getContentSize().width;
        }

        if ( posicionYCamara < 0 ){
           posicionYCamara = 0;
        }
        if ( posicionYCamara > this.mapaAlto - this.getContentSize().height ){
           posicionYCamara = this.mapaAlto - this.getContentSize().height ;
        }

        this.setPosition(cc.p( - posicionXCamara , - posicionYCamara));

        // Izquierda
        if (this.tecla == 37 ){
            if( this.barco.body.p.x > 0){
                this.barco.moverIzquierda();
                this.labelScore.rotation = 90;
            } else {
                this.barco.detener();
            }
        }
        // Derecha
        if (this.tecla == 39 ){
            if( this.barco.body.p.x < this.mapaAncho){
                this.barco.moverDerecha();
                this.labelScore.rotation = 270;
            } else {
                this.barco.detener();
            }
        }
        // Arriba
        if (this.tecla == 38 ){
            if( this.barco.body.p.y < this.mapaAlto){
                this.barco.moverArriba();
                this.labelScore.rotation = 180;
            } else {
                this.barco.detener();
            }
        }

       // Abajo
        if (this.tecla == 40 ){
            if( this.barco.body.p.y > 0){
                this.barco.moverAbajo();
                this.labelScore.rotation = 0;
            } else {
                this.barco.detener();
            }
        }

       // Ninguna pulsada
        if( this.tecla == 0 ){
            this.barco.detener();
        }

        // Actualizar pos UI
        this.labelScore.setPosition(cc.p(this.barco.body.p.x, this.barco.body.p.y));

        // Eliminar formas:
        for(var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var r = 0; r < this.rescates.length; r++) {
                if (this.rescates[r].shape == shape) {
                    this.rescates[r].eliminar();
                    this.rescates.splice(r, 1);
                }
            }

            for (var r = 0; r < this.bombasJugador.length; r++) {
                if (this.bombasJugador[r].shape == shape) {
                    this.bombasJugador[r].eliminar();
                    this.bombasJugador.splice(r, 1);
                }
            }

            for (var r = 0; r < this.barcosPirata.length; r++) {
                if (this.barcosPirata[r].shape == shape) {
                    this.barcosPirata[r].eliminar();
                    this.barcosPirata.splice(r, 1);
                }
            }

            for (var r = 0; r < this.bombasPirata.length; r++) {
                if (this.bombasPirata[r].shape == shape) {
                    this.bombasPirata[r].eliminar();
                    this.bombasPirata.splice(r, 1);
                }
            }
        }

        // Actualizar referencia de la posición del barco
        posBarco = cc.p(this.barco.body.p.x, this.barco.body.p.y);
        this.formasEliminar = [];

        // Comprobar condición de victoria
        if(this.score == 0) {
            cc.audioEngine.stopMusic();
            cc.director.pause();
            this.addChild(new VictoryLayer, 100);
        }

        // Mover barcos enemigos
        if(this.delay == 100){
            this.moverBarcosPirata();
            this.dispararBarcosPirata();
            this.delay = 0;
        } else {
            this.delay += 1;
        }


    }, cargarMapa:function () {
        this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
        // Añadirlo a la Layer
        this.addChild(this.mapa);
        // Ancho del mapa
        this.mapaAncho = this.mapa.getContentSize().width;
        this.mapaAlto = this.mapa.getContentSize().height;

        // Solicitar los objeto dentro de la capa Limites
        var grupoLimites = this.mapa.getObjectGroup("Bordes");
        var limitesArray = grupoLimites.getObjects();

        // Los objetos de la capa limites
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < limitesArray.length; i++) {
            var limite = limitesArray[i];
            var puntos = limite.polylinePoints;
            for(var j = 0; j < puntos.length - 1; j++){
                var bodyLimite = new cp.StaticBody();

                var shapeLimite = new cp.SegmentShape(bodyLimite,
                    cp.v(parseInt(limite.x) + parseInt(puntos[j].x),
                        parseInt(limite.y) - parseInt(puntos[j].y)),
                    cp.v(parseInt(limite.x) + parseInt(puntos[j + 1].x),
                        parseInt(limite.y) - parseInt(puntos[j + 1].y)),
                    1);

                shapeLimite.setFriction(1);
                shapeLimite.setElasticity(0);
                shapeLimite.setCollisionType(tipoBorde);
                this.space.addStaticShape(shapeLimite);

              }
        }

        var grupoRescates = this.mapa.getObjectGroup("Rescates");
        var rescatesArray = grupoRescates.getObjects();
        for (var i = 0; i < rescatesArray.length; i++) {
            var rescate = new Rescate(this.space,
                cc.p(rescatesArray[i]["x"],rescatesArray[i]["y"]),
                this);
            this.rescates.push(rescate);
        }

        var grupoBarcosPirata = this.mapa.getObjectGroup("Enemigos");
        var barcosPirataArray = grupoBarcosPirata.getObjects();
        for (var i = 0; i < barcosPirataArray.length; i++) {
            var barcoPirata = new BarcoPirata(this.space,
                cc.p(barcosPirataArray[i]["x"],barcosPirataArray[i]["y"]),
                this);
            this.barcosPirata.push(barcoPirata);
        }

    },teclaPulsada: function(keyCode, event){
        var instancia = event.getCurrentTarget();

        instancia.tecla = keyCode;

    },teclaLevantada: function(keyCode, event){
        var instancia = event.getCurrentTarget();

        if ( instancia.tecla  == keyCode){
            instancia.tecla = 0;
        }

    },mousePulsado: function(event){
        var instancia = event.getCurrentTarget();
        var body = instancia.barco.body;
        var space = instancia.space;
        var layer = instancia.layer;

        var bomba = new BombaJugador(space,  cc.p(body.p.x, body.p.y), layer);
        bomba.body.applyImpulse(cp.v( (event.getLocationX() - bomba.body.p.x)*10, (event.getLocationY() - bomba.body.p.y)*10), cp.v(0,0));

        if ((instancia.barco.sprite.rotation == 270 || instancia.barco.sprite.rotation == 90) && event.getLocationInView().y < 225) {
            bomba.body.vy = 400;
            bomba.body.vx = 0;
        }

        if ((instancia.barco.sprite.rotation == 270 || instancia.barco.sprite.rotation == 90) && event.getLocationInView().y > 225) {
            bomba.body.vy = -400;
            bomba.body.vx = 0;
        }

        if ((instancia.barco.sprite.rotation == 0 || instancia.barco.sprite.rotation == 180) && event.getLocationInView().x > 400) {
            bomba.body.vy = 0;
            bomba.body.vx = 400;
        }

        if ((instancia.barco.sprite.rotation == 0 || instancia.barco.sprite.rotation == 180) && event.getLocationInView().x < 400) {
            bomba.body.vy = 0;
            bomba.body.vx = -400;
        }
        instancia.bombasJugador.push(bomba);
        cc.audioEngine.playEffect(res.shooting_bomb_wav);
        console.log("Ratón pulsado");

    },colisionBarcoConRescate:function (arbiter, space) {
        // Actualizamos la puntuación
        this.score = this.score - 1;
        this.labelScore.setString(this.score.toString());
        // Marcar la moneda para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);
        cc.audioEngine.playEffect(res.positive_beep_wav);
        console.log("Barco colisiona con rescate");

    }, colisionBombaJugadorConBorde:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        console.log("Bomba jugador colisiona con borde - Eliminar bomba");

    }, colisionBarcoConBarcoPirata:function (arbiter, space) {
        cc.audioEngine.stopMusic();
        cc.director.pause();
        this.addChild(new GameOverLayer, 100);
        cc.audioEngine.playEffect(res.ship_destroyed_wav);
        console.log("Barco colisiona con barco pirata - Game Over");

    }, colisionBombaJugadorConBarcoPirata:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        this.formasEliminar.push(shapes[1]);
        cc.audioEngine.playEffect(res.ship_destroyed_wav);
        console.log("Bomba jugador colisiona con barco pirata - Destruye barco pirata");

    }, colisionBombaPirataConBorde:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        console.log("Bomba pirata colisiona con borde - Eliminar bomba pirata");

    }, colisionBombaPirataConBarco:function (arbiter, space) {
        cc.audioEngine.stopMusic();
        cc.director.pause();
        this.addChild(new GameOverLayer, 100);
        cc.audioEngine.playEffect(res.ship_destroyed_wav);
        console.log("Barco colisiona con bomba pirata - Game Over");

    }, moverBarcosPirata:function(){
        for( i=0; i<this.barcosPirata.length; i++){
            // MOVIMIENTO
            var randomNumber1 = Math.floor(Math.random()*2*this.velocidadBarcosPirata) - (this.velocidadBarcosPirata);
            var randomNumber2 = Math.floor(Math.random()*2*this.velocidadBarcosPirata) - (this.velocidadBarcosPirata);
            this.barcosPirata[i].body.applyImpulse(cp.v( randomNumber1, randomNumber2), cp.v(0,0));
            
            // Giramos los barcos pirata hacia la posición.
            // Referencia utilizada:
            // http://www.gamefromscratch.com/post/2012/11/18/GameDev-math-recipes-Rotating-to-face-a-point.aspx
            var angle = Math.atan2(randomNumber2 - this.barcosPirata[i].sprite.y, randomNumber1 - this.barcosPirata[i].sprite.y );
            angle = angle * (180/Math.PI); // Para pasar de radianes a grados
            if(angle < 0) {
                angle = 360 - (-angle);
            }
            this.barcosPirata[i].sprite.rotation = 90 - angle;
        }

    }, dispararBarcosPirata:function(){
        for( i=0; i<this.barcosPirata.length; i++){
            var bombaPirata = new BombaPirata(this.space,  cc.p(this.barcosPirata[i].sprite.x, this.barcosPirata[i].sprite.y), this.layer);
            bombaPirata.body.applyImpulse(cp.v( (this.barco.body.p.x - bombaPirata.body.p.x)*0.8, (this.barco.body.p.y - bombaPirata.body.p.y)*0.8), cp.v(0,0));
            this.bombasPirata.push(bombaPirata);
        }
            
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();
        cc.audioEngine.playMusic(res.pirate_music_wav, true);
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
