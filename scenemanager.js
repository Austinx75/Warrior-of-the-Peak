/**
 * Authors: Austin Scott
 *          Paras Sharma
 *          Suk Won
 *          Tyler Phippen
 * Austin: Made Scene Manager and Level Two
 * Paras: Put Level one together and added his player.
 * Suk: Loaded his player into level 1.
 * Tyelr: Loaded his player into level 1.
 */
class SceneManager{
	constructor(game){
		this.game = game;
        this.game.camera = this;
        this.Characters = {
            PLAYER: "KarateKid",
            OPPONENT: "CPU"
        }
             

        //Loading Levels
        this.loadLevel2();
        //this.loadLevel();

	};
    clearEntities(){
        this.game.entities = [];
    };
    loadLevel(){
        this.bkground = new BackGround(this.game, 0, 0);
        this.game.addEntity(this.bkground);
        this.catplayer = new catplayer(this.game, 400, 435 );
        this.game.addEntity(this.catplayer);
        this.karateplayer = new KaratePlayer(this.game, 0,550);
        this.game.addEntity(this.karateplayer);
        this.chunLi = new ChunLi(this.game, 450, 375);
        this.game.addEntity(this.chunLi);
        this.billyLee = new BillyLee(this.game, 350, 435);
        this.game.addEntity(this.billyLee);
    };
    loadLevel2(){
        //Loading Background image
        this.backscene = new BackScene(this.game,0,0, 1024, 672);
        this.game.addEntity(this.backscene);
        //Loading Platform to jump on
        this.platform = new Platform(this.game, 360,390, 744);
        this.game.addEntity(this.platform);

         let ground = new Ground(this.game, 0, 736, 1024);
         this.game.addEntity(ground);

        //Loading the ground to fight on.
        this.ground = new Ground(this.game, 0, 736, 1024);
        this.game.addEntity(this.ground);
        //Loading Player
        switch(this.Characters.PLAYER){
            case 'KarateKid':
                this.player = new KaratePlayer(this.game, 0, 0);
                this.game.addEntity(this.player);
                break;
            case 'ChunLi':
                break;
            case 'BillyLee':
                break;
            case 'CatPlayer':
                break;
        }

        //loading CPU
        switch(this.Characters.OPPONENT){
            case 'CPU':
                this.opponent = new CPU(this.game, 0, 0, this.player);
                this.game.addEntity(this.opponent);
                break;
            case 'ChunLi':
                break;
            case 'BillyLee':
                break;
            case 'CatPlayer':
                break;
        }



        // this.catplayer = new catplayer(this.game, 0,550 );
        // this.game.addEntity(this.catplayer);
        //AI KaratePlayer
        this.cpu = new CPU(this.game, 960, 0, this.player);
        this.game.addEntity(this.cpu);


    };
    update(){
        PARAMS.DEBUG = document.getElementById("debug").checked;
    };
    draw(ctx){
        if(PARAMS.DEBUG){
        }
        var playerNameCount = this.player.name.length; 
        var cpuNameCount = this.opponent.name.length;
        var totalCount = playerNameCount + cpuNameCount;
        var middle = 524;
        var vStart = 250 + ((middle - totalCount) / 2);

        ctx.font = '15px "Press Start 2P"';
        ctx.fillStyle = "Orange";
        ctx.fillText(this.player.name, 255 , 60);
        ctx.font = '20px "Press Start 2P"';
        ctx.fillStyle = "Red";
        ctx.fillText("VS.", vStart - ("VS.".length * 15)/2, 60);
        ctx.font = '15px "Press Start 2P"';
        ctx.fillStyle = "Orange";
        ctx.fillText(this.opponent.name, 759 - (cpuNameCount * 15), 60);
    };
};