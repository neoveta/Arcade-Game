//create Enemy class
class Enemy {
   constructor(x,y,speed){
    this.width = 101;
    this.height = 87;
    this.x = 0;
    this.y = y +55;        // center Enemy's position in the block
    this.speed =speed;
    this.sprite = 'images/enemy-bug.png';
    this.step = 101;
    this.boundary = this.step * 5;
    this.resetPosition = -this.step;    //reset position to the off-screen -1 step
   }

   render(){        // Draw the enemy on the screen
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
   }

   update(dt){                          // Parameter: dt, a time delta between ticks    
        if(this.x < this.boundary){         //if enemy is not passed boundary, move forward
            this.x += this.speed * dt;       //increment x by speed * dt  
        }
        else {
            this.x = this.resetPosition;     //reset position to start
        }
    }
}

// Create the player class
class Player { 
    constructor(){
        this.sprite = 'images/char-boy.png';
        this.rows = 6;
        this.columns = 5;
        this.rowHeight = 87;    //canvan's blocks width is 101 px and height is 83 px
        this.rowWidth = 101;
        this.startRow = 4;
        this.startColumn = 2;
        this.startX = this.startColumn * this.rowWidth;//this.stepY * 2;    //moves Player to 2 blocks to the right
        this.startY = this.startRow * this.rowHeight + Math.floor(this.rowHeight/2);// + Math.floor(this.rowHeight/2);//(this.stepX * 4) + 55;    //moves Player to 5 blocks down and add padding 20px to center Player
        this.x = this.startX;
        this.y = this.startY;
        this.finishCount = 0;
    }  
    render(){       //Draws Player sprite on current x and y coordinats
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    
    isCollision(enemy){   //check for contact with Enemy 
        const collOffset = 25;
        const myLeftX = this.x - collOffset;
        const myRightX = this.x + collOffset;
        const myBottomY = this.y - collOffset;
        const myTopY = this.y + collOffset;
        
        const enemyLeftX = enemy.x - collOffset;
        const enemyRightX = enemy.x + collOffset;
        const enemyBottomY = enemy.y - collOffset;
        const enemyTopY = enemy.y + collOffset;
        let xColl = false, yColl = false; 
        if (((myLeftX >= enemyLeftX) && (myLeftX <= enemyRightX)) ||
        ((myRightX >= enemyLeftX) && (myRightX <= enemyRightX))){
            xColl = true;
        }
        if (((myTopY >= enemyBottomY) && (myTopY <= enemyTopY)) ||
        (myBottomY >= enemyBottomY) && (myBottomY <= enemyTopY)){
            yColl = true; 
        }
        return (xColl && yColl);
    } 

    update(){
             for(let enemy of allEnemies){      
                if(this.isCollision(enemy)){   
                    this.reset();
                }
             }
              //check win 
            if (this.y < this.rowHeight){
                //to let draw images before show win alert
                this.finishCount++;
            }
    }  

    handleInput(input) {        //keyboard input (event listener), update player's x abd y according to input
        switch(input){
            case 'left':
            if (this.x >= this.rowWidth){
                this.x -= this.rowWidth;
               }
                break;
            case 'up':
            if(this.y >= this.rowHeight){
                this.y -= this.rowHeight;
                }
                break;
            case 'right':
            if(this.x < this.rowWidth * (this.columns-1) ){
                this.x += this.rowWidth;
                }
                break;
            case 'down':
                if(this.y < this.startY ){
                this.y += this.rowHeight;
                }
                break;
            default:
                break;
        }
    }
    reset(){        //reset Player's position, set x and y to starting coordinates  
        this.x = this.startX;
        this.y = this.startY;    
    } 
}

class Timer{
    
    constructor(){
        this.seconds = 0;
        this.minutesIcon = document.getElementById('minutes');
        this.secondsIcon = document.getElementById('seconds');
        this.secondsIcon.innerHTML = '00';
        this.minutesIcon.innerHTML = '00';

        this.interval = setInterval(() => {  //Update timer in the screen
            this.seconds++;
            const tm = this.calcTimer(seconds);
            this.secondsIcon.innerHTML = (tm[1] < 10) ? `0${tm[1]}` : `${tm[1]}`;
            this.minutesIcon.innerHTML = (tm[0] < 10) ?  `0${tm[0]}` : `${tm[0]}`;
    },1000);
    }

    calcTimer(seconds){
        const minutes = Math.floor(this.seconds / 60);
        const secInMin = this.seconds % 60;
        return [minutes, secInMin];
    }

    resetTimer(){
        this.seconds = 0;
        this.minutesIcon.innerHTML = "00";
        this.secondsIcon.innerHTML = "00";
        this.stopTimer();
    }

    stopTimer() {    //function to clearInterval to stop the timer.
        clearInterval(this.interval);
        this.interval = undefined;
  }      
}

class Modal {
    constructor (secs){ 
        let modal = document.getElementById('myModal'); 
        let winText=document.querySelector("#winner");
        const tm = secs; 
        modal.className=('modalshow'); //call the win modal
        winText.innerHTML = "Congratulations! \nYou won the game! \nYou took "+ tm[0] + " minutes and " + tm[1] + " seconds to win the game.";   
    }
}

//Instantiate all objects
const player = new Player();    //New Player object
const enemy1 = new Enemy(-101, 0, 200);
const enemy2 = new Enemy(-101, 83, 400);
const enemy3 = new Enemy(-101, 166, 300);     //New Enemy object
const enemy4 = new Enemy(-101, 166, 150);
let allEnemies =[];             //inst allEnemies array
allEnemies.push(enemy1, enemy2, enemy3, enemy4);          //for each enemy create and push new Enemy object into above array
const myTimer = new Timer(); //timer

// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});