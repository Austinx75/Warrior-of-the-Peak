class SceneManager{
	constructor(game){
		this.game = game;
        this.game.camera = this;
        
		this.loadLevel();
	};

    clearEntities(){
        this.game.entities = [];
    };

    loadLevel(){
        // let ground = new Ground(this.game, 0, 721, 1024);
        // this.game.addEntity(ground);

        this.bkground = new background(this.game, 0, 0);
        this.game.addEntity(this.bkground);
        this.catplayer = new catplayer(this.game, 400, 435 );
        this.game.addEntity(this.catplayer);
        this.karateplayer = new KaratePlayer(this.game, 0, 375);
        this.game.addEntity(this.karateplayer);
    };

    update(){
        PARAMS.DEBUG = document.getElementById("debug").checked;
    };

    draw(ctx){
        if(PARAMS.DEBUG){

        };

    };


};