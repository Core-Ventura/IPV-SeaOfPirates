var res = {
    HelloWorld_png : "res/HelloWorld.png",
    boton_jugar_png : "res/boton_jugar.png",
    menu_titulo_png : "res/menu_titulo.png",
    tiles_sheet_png: "res/tiles_sheet.png",
    mapa1_tmx: "res/mapa1.tmx",
    ship_png: "res/ship.png",
    bomb_player_png: "res/bomb_player.png",
    bomb_enemy_png: "res/bomb_enemy.png",
    rescate_png: "res/rescate.png",
    pirate_ship_png: "res/pirate_ship.png",
    game_over_png: "res/game_over.png",
    victory_png: "res/victory.png",
    //MUSIC and SFX
    pirate_music_wav: "res/pirate_music.wav",
    positive_beep_wav: "res/positive_beep.wav",
    ship_destroyed_wav: "res/ship_destroyed.wav",
    shooting_bomb_wav: "res/shooting_bomb.wav",

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}