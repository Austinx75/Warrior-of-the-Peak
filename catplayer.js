class catplayer{
    constructor(game, x, y, theName, roundCount, map, deathCount, opponent){
        Object.assign(this,{game, x, y, theName, roundCount, map, deathCount, opponent});

        this.name = theName;
        this.CPU = false;
        this.dead = false;
        this.maxHitPoints = 100;
        this.hitPoints = 100;
        this.deathCount = deathCount;
        this.elapsed = 0;

        this.VisRadius = 100;
        this.AtkRadius = 45;
        //this.cX = 0, this.xY = 0;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/fighterLR.png");
        //This is for walking and jumping, and kick
        this.height1 = 25;

        //This is for punch, and idle
        this.height2 = 24;

        //Roll height and width,
        this.heightWidth = 20;

        //walking, punch, duck, idle, kick
        this.width1 = 19;

        //Attack Widths
        this.attackPunchWidth = 15;

        //Attack Widths
        this.attackKickWidth = 20;

        //this is for jump
        this.width2 = 15;

        //this is to adjust the player when he is updated
        this.rollAdjust = 5;

        //this is to adjust the player when he is updated
        this.walkAdjust = 5;
        
        //this is to adjust the player when he is updated
        this.punchAdjust = 10;

        //this is to adjust the player when he is updated
        this.blockAdjust = 10;

        //this is to adjust the player when he is kicking
        this.kickAdjust = 12;

        this.colAdj1 = 5;
        
        this.collAdj2 = 1;
    

        
        
        this.state = 0; //idle =0, walking=1, running=2, block = 3, punch = 4, kick = 5, jump = 6, dead = 7.
        this.size = 0; // small = 0 and large = 1 after finish 
        this.facing = 0; //right = 0, left = 1

        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 100;
        this.updateBB();
        this.animations = []; //putting them all 3 dimensional list in one;
        this.loadAnimations();
        
    };
   

    loadAnimations(){
        for(var i = 0; i < 8; i++){ //7states - idle, walking, running, jumping, punching, kicking, block, dead 
            this.animations.push([]);
            for(var j = 0; j < 1; j++){   //one size
                this.animations[i].push([]);
                for (var k = 0; k < 2; k++){   //facing right left
                    this.animations[i][j].push([]);
                }
            }
        }

      
        
        this.animations[0][0][0] = new Animator (this.spritesheet, 60, 60, 40, 40, 2, 0.33, 10, false, true ); //idel facing right
        this.animations[1][0][0] = new Animator (this.spritesheet, 161, 8, 40, 40, 2, 0.33, 10, false, true ); //walking right
        this.animations[2][0][0] = new Animator (this.spritesheet, 161, 8, 40, 40, 2, 0.10, 10, false, true ); //running right 
        this.animations[3][0][0] = new Animator (this.spritesheet, 211, 62, 40, 40, 2, 0.20, 10, false, true ); //block right
        this.animations[4][0][0] = new Animator (this.spritesheet, 359, 162, 40, 40, 2, 0.15, 14, false, true ); //punching right
        this.animations[5][0][0] = new Animator (this.spritesheet, 10, 212, 40, 40, 10, 0.15, 9, false, true ); //kicking right
        this.animations[6][0][0] = new Animator (this.spritesheet, 310, 263, 40, 40, 2, 0.20, 10, false, true ); //jumping right
        this.animations[7][0][0] = new Animator (this.spritesheet, 51, 162, 32, 30, 2, 0.33, 10, false, true); //dead right
        
        this.animations[0][0][1] = new Animator (this.spritesheet, 850, 60, 40, 40, 2, 0.33, 10, false, true ); //idel facing left
        this.animations[1][0][1] = new Animator (this.spritesheet, 748, 8, 40, 40, 2, 0.33, 10, true, true ); //walking left
        this.animations[2][0][1] = new Animator (this.spritesheet, 748, 8, 40, 40, 2, 0.10, 10, true, true ); //running left 
        this.animations[3][0][1] = new Animator (this.spritesheet, 693, 62, 40, 40, 2, 0.20, 10, true, true ); //block left  
        this.animations[4][0][1] = new Animator (this.spritesheet, 543, 162, 40, 40, 2, 0.15, 14, true, true ); //punching left 
        this.animations[5][0][1] = new Animator (this.spritesheet, 496, 212, 40, 40, 10, 0.15, 9, true, true ); // kicking left 
        this.animations[6][0][1] = new Animator (this.spritesheet, 597, 263, 40, 40, 2, 0.20, 10, true, true ); //jumping left 
        this.animations[7][0][1] = new Animator (this.spritesheet, 848, 164, 32, 30, 2, 0.33, 10, true, false) //dead left
    

    };

    updateBB(){
        this.lastBB = this.BB;
        if(this.state == 0){
            this.BB = new BoundingBox(this.x, this.y, this.width1 * PARAMS.SCALE, (this.height2 * PARAMS.SCALE));
        }else if(this.state == 1){
            this.BB = new BoundingBox(this.x, this.y, this.width1 * PARAMS.SCALE, (this.height1 * PARAMS.SCALE));
        } else if(this.state == 4 && this.facing == 0){
            this.BB = new BoundingBox(this.x, this.y, this.attackPunchWidth * PARAMS.SCALE, (this.height2 * PARAMS.SCALE));
        } else if(this.state == 4 && this.facing == 1){
            this.BB = new BoundingBox(this.x+this.attackPunchWidth, this.y, this.attackPunchWidth * PARAMS.SCALE, (this.height2 * PARAMS.SCALE));
        } else if(this.state == 5 && this.facing == 0){
            this.BB = new BoundingBox(this.x, this.y, this.attackKickWidth * PARAMS.SCALE, (this.height1 * PARAMS.SCALE));
        } else if(this.state == 5 && this.facing == 1){
            this.BB = new BoundingBox(this.x + this.attackKickWidth, this.y, this.attackKickWidth * PARAMS.SCALE, (this.height1 * PARAMS.SCALE));
        } else if(this.state == 3){
            this.BB = new BoundingBox(this.x, this.y, this.width1 * PARAMS.SCALE, (this.height2 * PARAMS.SCALE));
        } else { 
            this.BB = new BoundingBox(this.x, this.y, this.width2 * PARAMS.SCALE, this.height1 * (PARAMS.SCALE));
        }
    };

    update(){
        const WALK = 75;
        const FALL_WALK = 1;
        const JUMPING = 500;
        const STOP_FALL = 400;
        const STOP_FALL_A = 90;
        const TICK = this.game.clockTick;
        const KICKING = 100;

        if(this.state < 6 && this.state != 7){
            //right
            if(this.game.D){
                this.velocity.x = WALK;
                this.state = 1;
                this.facing = 0;
                //this.x += 5;
            }
            //left
            else if(this.game.A){
                this.velocity.x = -WALK;
                this.facing = 1;
                this.state = 1;
                //this.x -=5;
            }else{
                this.velocity.x = 0;
                this.state = 0;
            }
            //block
            if(this.game.S){
                this.state = 3;
            }

            //punch
            if(this.game.E){
                if(this.state == 0){
                this.state = 4;
                
                }else{
                    this.state = 4;
                }
                //this.game.E = false;
            }
                //kick
            if(this.game.R){
                if(this.state == 0){
                this.state = 5;
                }else{
                    this.state = 5;
                }
             //this.game.R = false;
            }

            //gravity
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE;

            //jump
            if(this.game.W){
                this.velocity.y = -JUMPING;
                this.state = 6;
                this.fallAcc = STOP_FALL;
            }

           
            //air physics
        } else if(this.state == 6 && this.state != 7){
            this.velocity.y += this.fallAcc * TICK * PARAMS.SCALE;

            //horizontal air physics
            if(this.game.D && !this.game.A){
                this.facing = 0;
                this.velocity.x += FALL_WALK;
            }else if(this.game.A && !this.game.D){
                this.facing = 1;
                this.velocity.x -= FALL_WALK;
            }else{
                //Nothing
            }
        }

        if(this.hitPoints === 0){
            this.state = 7;
            this.velocity.y = - 100;
            this.velocity.x = 0;
        } 
        if(opponentDeath){
            console.log("Does opponent dying get logged?");
            if(this.roundCount <= 3 && opponentDeathCount <= 3){
                this.elapsed += TICK;
                if(this.elapsed > 2){
                    opponentDeathCount++;
                    console.log("Death count for opponent" + opponentDeathCount);
                    this.game.addEntity(new RoundManager(this.game, this.roundCount, this.theName, this.opponent, this.map, this.deathCount, opponentDeathCount));
                }
            } 
         }
         if(this.state === 7){
            if(this.roundCount <= 3 && this.deathCount <= 3){
                this.elapsed += TICK;
                if(this.elapsed > 2){
                    this.deathCount++;
                    this.game.addEntity(new RoundManager(this.game, this.roundCount, this.theName, this.opponent, this.map, this.deathCount, opponentDeathCount));
                }
            } 
         }

        //updating 
        this.x += this.velocity.x * TICK * PARAMS.SCALE;
        this.y += this.velocity.y * TICK * PARAMS.SCALE;
        
     
        this.updateBB();
        this.collisions();
    
    };
     
    collisions(){
        //Collisions 
        let that = this;
        this.game.entities.forEach(function (entity){
            if (entity.BB && that.BB.collide(entity.BB)){
                //Ground Collisions
                if(that.velocity.y > 0){
                    if((entity instanceof BackGround || entity instanceof BackScene || entity instanceof Sky) && that.lastBB.bottom >=entity.BB.bottom){
                        if(that.state == 6) that.state = 0;
                        if(that.state == 0) that.y = entity.BB.bottom - (that.height2 * PARAMS.SCALE - that.colAdj1);
                        else if(that.state == 1) that.y = entity.BB.bottom - (that.height1 * PARAMS.SCALE - that.walkAdjust);
                        else if(that.state == 3) that.y = entity.BB.bottom - (that.height2 * PARAMS.SCALE - that.blockAdjust);
                        else if(that.state == 4) that.y = entity.BB.bottom - (that.height2 * PARAMS.SCALE - that.punchAdjust);
                        else if(that.state = 5) that.y = entity.BB.bottom - (that.height1 * PARAMS.SCALE - that.kickAdjust);                           
                        that.velocity.y = 0;
                        that.updateBB(); 
                    }

                    //Falling logic for Platform Level 2 and Properller platform Level 3
                    if((entity instanceof Platform || entity instanceof Propeller) && that.lastBB.bottom >= entity.BB.top){
                        if(that.state === 6) that.state = 0;
                        if(that.state === 0) that.y = entity.BB.top - ((that.height2 - 1) * PARAMS.SCALE);
                        else if(that.state === 1) that.y = entity.BB.top - (that.height2 * PARAMS.SCALE);
                        else if(that.state === 3) that.y = entity.BB.top - ((that.height2 - 3) * PARAMS.SCALE);
                        else if(that.state === 4) that.y = entity.BB.top - ((that.height2 - 3) * PARAMS.SCALE);  
                        else if(that.state === 5) that.y = entity.BB.top - ((that.height2 - 3) * PARAMS.SCALE);             
                        that.velocity.y = 0;
                        that.updateBB();                         
                    }
                    //Walking to Right Logic - Level1 - Level2
                    if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky ) && that.BB.right >= entity.BB.right){
                        if(that.state == 1) that.x = entity.BB.right - (that.width1 * PARAMS.SCALE);
                        else if(that.state == 4) that.x = entity.BB.right - (that.width1 * PARAMS.SCALE);
                        else if(that.state == 6) that.x = entity.BB.right - (that.width2 * PARAMS.SCALE); //+5
                        else if(that.state == 5) that.x = entity.BB.right - (that.width1 * PARAMS.SCALE);
                        that.velocity.x = 0;
                        that.updateBB();
                    }
                    //Walking to Left Logic - Level1 - Level2
                    if((entity instanceof BackScene || entity instanceof BackGround || entity instanceof Sky) && that.lastBB.left <= entity.BB.left){
                        if(that.state == 1) that.x = entity.BB.left; 
                        else if(that.state == 4) that.x = entity.BB.left;
                        else if(that.state == 5) that.x = entity.BB.left;
                        that.velocity.x = 0;
                        that.updateBB();
                    }
                }

                //AirCollisons
                if(that.velocity.y < 0){
                    //Jumping logic - Level2 - Platform
                    if((entity instanceof Platform) && that.lastBB.top >= entity.BB.bottom){
                        if(that.state == 6) that.y = entity.BB.bottom + (that.height1 * PARAMS.SCALE);
                        else if(that.state == 5) that.y = entity.BB.bottom + (that.height1 * PARAMS.SCALE);
                        that.velocity.y = 0;
                        that.updateBB();
                    }
                    //Jumping & Kicking to Right - Level2 - Level1
                    if((entity instanceof BackScene || entity instanceof BackGround) && that.lastBB.right >= entity.BB.right){
                        if(that.state == 6) that.x = entity.BB.right - (that.width2 * PARAMS.SCALE);
                         that.velocity.y =0;
                         that.updateBB();
                    }
                    //Jumping & Kicking to Left - Level2 - Level1
                    if((entity instanceof BackScene || entity instanceof BackGround) && that.lastBB.left <= entity.BB.left){
                        if(that.state == 6) that.x = entity.BB.left;
                         that.velocity.y = 0;
                         that.updateBB();
                    }

                    if((entity instanceof Propeller) &&  that.lastBB.top >= entity.BB.bottom){
                        if(that.state === 6) that.y = entity.BB.bottom + (that.height2 * PARAMS.SCALE);
                        else if(that.state === 5) that.y = entity.BB.bottom + (that.height2 * PARAMS.SCALE);
                        that.hitPoints -= 2;
                        that.velocity.y = 0;
                        that.updateBB(); 
                    }
                }
                
            }
        });

        if(!this.game.D && !this.game.A && !this.game.W && !this.game.S && !this.game.E && !this.game.R){
            this.state = 0;
        }
        
    };

    draw(ctx){
            if(PARAMS.DEBUG){
                //Visual Circle
                ctx.beginPath();
                ctx.strokeStyle = "Blue";
                ctx.arc(this.BB.x + 35 , this.BB.y + 35, this.VisRadius, 0, Math.PI * 2, false);
                ctx.stroke();
                ctx.closePath();
                //Attack Circle
                ctx.beginPath();
                ctx.strokeStyle = "White";
                ctx.arc(this.BB.x + 38, this.BB.y + 45, this.AtkRadius, 0, Math.PI * 2, false);
                ctx.stroke();
                ctx.closePath();
                ctx.strokeStyle = "Red";
                ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
            };
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
                ctx.fillText(this.name, 759 - (cpuNameCount * 14), 60);
                ctx.strokeText(this.name, 759 - (cpuNameCount * 14), 60);
            }
        this.animations[this.state][this.size][this.facing].drawFrame(this.game.clockTick, ctx ,this.x,this.y, 3);
    };


};