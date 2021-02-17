/**
 * Authors: Austin Scott
 *          Paras Sharma
 *          Suk Won
 *          Tyler Phippen
 * Austin: Made Scene Manager and Level Two, HUD, OBJECTS for
 * map, player, and CPU loads. 
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
        this.LEVEL = {
            MAP: 0
        }
        switch(this.Characters.PLAYER){
            case 'KarateKid':
                this.player = new KaratePlayer(this.game, 50, 0);
                break;
            case 'ChunLi':
                break;
            case 'BillyLee':
                break;
            case 'CatPlayer':
                this.player = new catplayer(this.game, 0, 0);
                break;
        }
        switch(this.Characters.OPPONENT){
            case 'CPU':
                this.opponent = new KaratePlayerCPU(this.game, 960, 0, this.player);
                break;
            case 'ChunLi':
                break;
            case 'BillyLee':
                break;
            case 'CatPlayer':
                break;
        }
        switch(this.LEVEL.MAP){
            case 0:
                this.loadLevel();
                break;
            case 1:
                this.loadLevel2();
                break;
            case 2:
                this.loadlevel3();
        }

	};
    clearEntities(){
        this.game.entities = [];
    };
    loadLevel(){
        this.bkground = new BackGround(this.game, 0, 0);
        this.game.addEntity(this.bkground);

        //Player HealthBar
        this.healthbar = new HealthBar(this.player);
        this.game.addEntity(this.healthbar);
        
        //Opponent HealthBar
        this.healthbar = new HealthBar(this.opponent);
        this.game.addEntity(this.healthbar);
        
        this.game.addEntity(this.player);

        this.game.addEntity(this.opponent);
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

        //Player HealthBar
        this.healthbar = new HealthBar(this.player);
        this.game.addEntity(this.healthbar);
        
        //Opponent HealthBar
        this.healthbar = new HealthBar(this.opponent);
        this.game.addEntity(this.healthbar);

        this.game.addEntity(this.player);

        this.game.addEntity(this.opponent);
    };

    loadlevel3(){
        this.sky = new Sky(this.game, 0,0);
        this.game.addEntity(this.sky);

        this.propeller = new Propeller(this.game, 75, 50);
        this.game.addEntity(this.propeller);

        this.crane = new Crane(this.game, 620, 159);
        this.game.addEntity(this.crane);

        //Player HealthBar
        this.healthbar = new HealthBar(this.player);
        this.game.addEntity(this.healthbar);
        
        //Opponent HealthBar
        this.healthbar = new HealthBar(this.opponent);
        this.game.addEntity(this.healthbar);

        this.game.addEntity(this.player);

        this.game.addEntity(this.opponent);

        this.oilrig = new OilRig(this.game, 0, 446);
        this.game.addEntity(this.oilrig);

        this.ocean = new Ocean(this.game, 0, 719);
        this.game.addEntity(this.ocean);

       
    };
    update(){
        PARAMS.DEBUG = document.getElementById("debug").checked;
    };
    draw(ctx){
        if(PARAMS.DEBUG){
        }
        // Prints the HUD
        var playerNameCount = this.player.name.length; 
        var cpuNameCount = this.opponent.name.length;
        var totalCount = playerNameCount + cpuNameCount;
        var middle = 524;
        var vStart = 250 + ((middle - totalCount) / 2);

        ctx.strokeStyle = "DarkOrange";
        ctx.font = '15px "Press Start 2P"';
        ctx.fillStyle = rgb(183,3,3);
        ctx.fillText(this.player.name, 255 , 60);
        ctx.strokeText(this.player.name, 255 , 60);

        ctx.strokeStyle = "Black";
        ctx.font = '20px "Press Start 2P"';
        ctx.fillStyle = "Red";
        ctx.fillText("VS.", vStart - ("VS.".length * 15)/2, 60);
        ctx.strokeText("VS.", vStart - ("VS.".length * 15)/2, 60);
        
        ctx.strokeStyle = "DarkOrange";
        ctx.font = '15px "Press Start 2P"';
        ctx.fillStyle = rgb(183,3,3);
        ctx.fillText(this.opponent.name, 759 - (cpuNameCount * 15), 60);
        ctx.strokeText(this.opponent.name, 759 - (cpuNameCount * 15), 60);
    };
};
function rgb(r, g, b){
    return "rgb(" + r + "," + g + "," + b + ")";
};