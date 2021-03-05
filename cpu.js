class KaratePlayerCPU extends KaratePlayer{
    constructor(game, x, y, player, blue, theName){
        super(game,x,y, blue);
        this.CPUSTATE ={
            ATTACK: false,
            WALKING: false,
            DEATH: false
        };
        Object.assign(this,{game,x,y, theName});
        this.other = player;

        //Setting up Character
        this.name = this.theName;
        this.facing = this.FACING.LEFT;
        this.CPU = true;
        this.jumpDist = 0;
        this.fallAcc = 100;

        //Hit Points
        this.maxHitPoints = 100;
        opponentHitPoints = 100;
        this.hitPoints = opponentHitPoints;
        opponentBlock = false;
        this.changeElapsed = 0;

        
        //Setting up circle
        this.VisRadius = 200;
        this.attack;

        this.updateBB();
        this.loadAnimations();
    };
    randomGen(){
        this.attack = Math.floor(Math.random() * Math.floor(2));
    }
    update(){
        this.hitPoints = opponentHitPoints;
        //Variables to manipulate the X and Y velocity
        const BLIND_WALK = 50;
        const WALK = 75;
        const FALL_WALK = 1;
        const ROLL = 100;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const TICK = this.game.clockTick;
        this.changeElapsed += TICK;
        if(this.changeElapsed > 3){
            this.randomGen(); 
            this.changeElapsed = 0;
        }

        //Ground Physics
        if(this.state !== this.STATE.JUMP  && this.CPUSTATE.DEATH !== true){
            this.midpoint = this.x + (KPstate.RIDLE[0].w / 2 * PARAMS.SCALE);
            this.other.midpoint = this.other.cX;
            this.position = this.other.midpoint - this.midpoint;
            //Have to check what side of the map he is on. 

            this.jumpDist = Math.abs(this.other.y - this.y);

            //This takes what side he is on and makes him go after opponent.
            if(this.position < 0){
                this.facing = this.FACING.LEFT;
                this.CPUSTATE.WALKING = true;
                this.state = this.STATE.WALK;
                if(!this.VisCircle())this.velocity.x = -BLIND_WALK;
                if(this.VisCircle())this.velocity.x = -WALK;
            } else if(this.position > 0){
                this.facing = this.FACING.RIGHT;
                this.CPUSTATE.WALKING = true;
                this.state = this.STATE.WALK;
                if(!this.VisCircle())this.velocity.x = BLIND_WALK;
                if(this.VisCircle())this.velocity.x = WALK;
            }
            
        //Implementing gravity.
        this.velocity.y += this.fallAcc * TICK;
        if(this.jumpDist > 100 && this.VisCircle()){
            this.velocity.y = -JUMPING;
            this.state = this.STATE.JUMP;
            this.fallAcc = STOP_FALL;
            this.CPUSTATE.WALK =false;
        }
        //air physics     
        } else if(this.state === this.STATE.JUMP && this.CPUSTATE.DEATH !== true) { 
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE;
            //horizontal air physics
            if(this.position < 0){
                this.velocity.x -= FALL_WALK;
            } else if(this.position > 0){
                this.velocity.x += FALL_WALK;   
            } else {
            }                
        }
        if(this.hitPoints === 0){
            this.CPUSTATE.DEATH = true;
            console.log("State: " + this.state + " Facing " + this.facing);
            this.velocity.y = -100;
            this.velocity.x = 0;
            opponentDeath = true;
            console.log("End of if");
        } 
        if(this.CPUSTATE.DEATH === true){
            console.log("Death true");
            this.state = this.STATE.DEAD;
        }
        if(this.other.dead === true){
            this.velocity.x = 0;
            this.state = this.STATE.IDLE;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.left <= entity.BB.right && that.position < 0){
                            if(that.CPUSTATE.WALKING) that.x = entity.BB.right;
                            if(that.CPUSTATE.ATTACK)that.x = entity.BB.right;
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK === true){
                                if(that.other.state !== that.other.STATE.BLOCK){
                                    if(that.attack === 0){
                                        that.state = that.STATE.PUNCH;
                                        that.other.hitPoints -= .04;
                                    } else if(that.attack === 1){
                                        that.state = that.STATE.KICK;
                                        that.other.hitPoints -= .04;
                                    }
                                }
                            }
                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.right >= entity.BB.left && that.position > 0){
                            if(that.CPUSTATE.WALKING === true) that.x = entity.BB.left - KPstate.RWALK[0].w * PARAMS.SCALE;
                            if(that.CPUSTATE.ATTACK){
                                if(that.state === that.STATE.KICK) that.x = entity.BB.left - KPstate.RWALK[0].w * PARAMS.SCALE;
                                if(that.state === that.STATE.PUNCH) that.x = entity.BB.left - KPstate.RPUNCH[0].w * PARAMS.SCALE;
                            }    
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK){
                                if(that.other.state !== that.other.STATE.BLOCK){
                                    if(that.attack === 0){
                                        that.state = that.STATE.PUNCH;
                                        that.other.hitPoints -= .04;
                                    } else if(that.attack === 1){
                                        that.state = that.STATE.KICK;
                                        that.other.hitPoints -= .04;
                                    }
                                }
                            }
                    }
                }
        });
        //updating
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        this.cX = this.x + KPstate.RWALK[0].w / 2 * PARAMS.SCALE;
        this.cY = this.y + KPstate.RWALK[0].h / 2 * PARAMS.SCALE;
        opponentcX = this.cX;
        opponentcY = this.cY;
        this.updateBB();
        this.collisions();
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            //Visual Circle
            ctx.beginPath();
            ctx.strokeStyle = "Red";
            ctx.arc(this.cX, this.cY, this.VisRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            //Attack Circle
            ctx.beginPath();
            ctx.strokeStyle = "White";
            ctx.arc(this.cX, this.cY, this.AtkRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            //Bounding Box
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        if(!this.CPU){
            ctx.strokeStyle = "DarkOrange";
            ctx.font = '14px "Press Start 2P"';
            ctx.fillStyle = rgb(183,3,3);
            ctx.fillText(this.name, 255 , 60);
            ctx.strokeText(this.name, 255 , 60);
        } else if (this.CPU){
            this.cpuNameCount = this.name.length;
            ctx.strokeStyle = "DarkOrange";
            ctx.font = '14px "Press Start 2P"';
            ctx.fillStyle = rgb(183,3,3);
            ctx.fillText(this.name, 759 - (this.cpuNameCount * 14), 60);
            ctx.strokeText(this.name, 759 - (this.cpuNameCount * 14), 60);
        }
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.SCALE);
    };
    VisCircle() {
        var dx = this.cX - this.other.cX;
        var dy = this.cY - this.other.cY;
        this.dist = Math.floor(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
        return (this.dist < this.VisRadius + this.other.VisRadius);
    };
};

class CatPlayerCPU extends catplayer{
    constructor(game, x, y, player, blue, theName){
        super(game,x,y, blue);
        this.CPUSTATE ={
            ATTACK: false,
            WALKING: false,
            DEATH: false
        };
        Object.assign(this,{game,x,y, theName});
        this.other = player;

        //Setting up Character
        this.name = this.theName;
        this.facing = 1;
        this.CPU = true;
        this.jumpDist = 0;
        this.fallAcc = 100;

        //Hit Points
        this.maxHitPoints = 100;
        opponentHitPoints = 100;
        this.hitPoints = opponentHitPoints;
        opponentBlock = false;
        this.changeElapsed = 0;

        
        //Setting up circle
        this.VisRadius = 200;
        this.attack;

        this.updateBB();
        this.loadAnimations();
    };
    randomGen(){
        this.attack = Math.floor(Math.random() * Math.floor(2));
    }
    update(){
        this.hitPoints = opponentHitPoints;
        //Variables to manipulate the X and Y velocity
        const BLIND_WALK = 50;
        const WALK = 75;
        const FALL_WALK = 1;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const TICK = this.game.clockTick;
        this.changeElapsed += TICK;
        if(this.changeElapsed > 3){
            this.randomGen(); 
            this.changeElapsed = 0;
        }

        //Ground Physics
        if(this.state !== 6  && this.CPUSTATE.DEATH !== true){
            this.midpoint = this.cX;
            this.other.midpoint = this.other.cX;
            this.position = this.other.midpoint - this.midpoint;
            //Have to check what side of the map he is on. 

            this.jumpDist = Math.abs(this.other.y - this.y);

            //This takes what side he is on and makes him go after opponent.
            if(this.position < 0){
                this.facing = this.FACING.LEFT;
                this.CPUSTATE.WALKING = true;
                this.state = this.STATE.WALK;
                if(!this.VisCircle())this.velocity.x = -BLIND_WALK;
                if(this.VisCircle())this.velocity.x = -WALK;
            } else if(this.position > 0){
                this.facing = this.FACING.RIGHT;
                this.CPUSTATE.WALKING = true;
                this.state = this.STATE.WALK;
                if(!this.VisCircle())this.velocity.x = BLIND_WALK;
                if(this.VisCircle())this.velocity.x = WALK;
            }
            
        //Implementing gravity.
        this.velocity.y += this.fallAcc * TICK;
        if(this.jumpDist > 100 && this.VisCircle()){
            this.velocity.y = -JUMPING;
            this.state = this.STATE.JUMP;
            this.fallAcc = STOP_FALL;
            this.CPUSTATE.WALK =false;
        }
        //air physics     
        } else if(this.state === this.STATE.JUMP && this.CPUSTATE.DEATH !== true) { 
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE;
            //horizontal air physics
            if(this.position < 0){
                this.velocity.x -= FALL_WALK;
            } else if(this.position > 0){
                this.velocity.x += FALL_WALK;   
            } else {
            }                
        }
        if(this.hitPoints === 0){
            this.CPUSTATE.DEATH = true;
            console.log("State: " + this.state + " Facing " + this.facing);
            this.velocity.y = -100;
            this.velocity.x = 0;
            opponentDeath = true;
            console.log("End of if");
        } 
        if(this.CPUSTATE.DEATH === true){
            console.log("Death true");
            this.state = this.STATE.DEAD;
        }
        if(this.other.dead === true){
            this.velocity.x = 0;
            this.state = this.STATE.IDLE;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
                if (that !== entity && entity.BB && that.BB.collide(entity.BB)) {
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.left <= entity.BB.right && that.position < 0){
                            if(that.CPUSTATE.WALKING) that.x = entity.BB.right;
                            if(that.CPUSTATE.ATTACK)that.x = entity.BB.right;
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK === true){
                                if(that.other.state !== that.other.STATE.BLOCK){
                                    if(that.attack === 0){
                                        that.state = that.STATE.PUNCH;
                                        that.other.hitPoints -= .04;
                                    } else if(that.attack === 1){
                                        that.state = that.STATE.KICK;
                                        that.other.hitPoints -= .04;
                                    }
                                }
                            }
                    }
                    if((entity instanceof KaratePlayer || entity instanceof catplayer || entity instanceof ChunLi || entity instanceof BillyLee 
                        || entity instanceof Goku) && that.lastBB.right >= entity.BB.left && that.position > 0){
                            if(that.CPUSTATE.WALKING === true) that.x = entity.BB.left - KPstate.RWALK[0].w * PARAMS.SCALE;
                            if(that.CPUSTATE.ATTACK){
                                if(that.state === that.STATE.KICK) that.x = entity.BB.left - KPstate.RWALK[0].w * PARAMS.SCALE;
                                if(that.state === that.STATE.PUNCH) that.x = entity.BB.left - KPstate.RPUNCH[0].w * PARAMS.SCALE;
                            }    
                            that.CPUSTATE.ATTACK = true;
                            if(that.CPUSTATE.ATTACK){
                                if(that.other.state !== that.other.STATE.BLOCK){
                                    if(that.attack === 0){
                                        that.state = that.STATE.PUNCH;
                                        that.other.hitPoints -= .04;
                                    } else if(that.attack === 1){
                                        that.state = that.STATE.KICK;
                                        that.other.hitPoints -= .04;
                                    }
                                }
                            }
                    }
                }
        });
        //updating
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        this.cX = this.x + KPstate.RWALK[0].w / 2 * PARAMS.SCALE;
        this.cY = this.y + KPstate.RWALK[0].h / 2 * PARAMS.SCALE;
        opponentcX = this.cX;
        opponentcY = this.cY;
        this.updateBB();
        this.collisions();
    };
    draw(ctx){
        if(PARAMS.DEBUG){
            //Visual Circle
            ctx.beginPath();
            ctx.strokeStyle = "Red";
            ctx.arc(this.cX, this.cY, this.VisRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            //Attack Circle
            ctx.beginPath();
            ctx.strokeStyle = "White";
            ctx.arc(this.cX, this.cY, this.AtkRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
            //Bounding Box
            ctx.strokeStyle = "Red";
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        if(!this.CPU){
            ctx.strokeStyle = "DarkOrange";
            ctx.font = '14px "Press Start 2P"';
            ctx.fillStyle = rgb(183,3,3);
            ctx.fillText(this.name, 255 , 60);
            ctx.strokeText(this.name, 255 , 60);
        } else if (this.CPU){
            this.cpuNameCount = this.name.length;
            ctx.strokeStyle = "DarkOrange";
            ctx.font = '14px "Press Start 2P"';
            ctx.fillStyle = rgb(183,3,3);
            ctx.fillText(this.name, 759 - (this.cpuNameCount * 14), 60);
            ctx.strokeText(this.name, 759 - (this.cpuNameCount * 14), 60);
        }
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx, this.x, this.y, PARAMS.SCALE);
    };
    VisCircle() {
        var dx = this.cX - this.other.cX;
        var dy = this.cY - this.other.cY;
        this.dist = Math.floor(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)));
        return (this.dist < this.VisRadius + this.other.VisRadius);
    };
};