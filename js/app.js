//My global variables
let time = 0;
let updateTimer;
let seconds = 0;
let minutesIcon = document.getElementById('minutes');
let secondsIcon = document.getElementById('seconds');
secondsIcon.innerHTML = '00';
minutesIcon.innerHTML = '00';
const timer = document.getElementById('timer');

//pause the game
// let paused = false;
// window.onfocus = function(){
//     paused = false;
// };
// window.onblur = function(){
//     paused = true;
// };

//create Enemy class
class Enemy {
   constructor(x,y,speed){
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
        this.step = 101;    //canvan's blocks width is 101 px and height is 83 px
        this.jump = 83;
        this.startX = this.step * 2;    //moves Player to 2 blocks to the right
        this.startY = (this.jump * 4) + 55;    //moves Player to 5 blocks down and add padding 20px to center Player
        this.x = this.startX;
        this.y = this.startY;
        this.finish = false;
    }  
    render(){       //Draws Player sprite on current x and y coordinats
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    } 
    update(){
             for(let enemy of allEnemies){      //check for contact with Enemy
                if(this.y === enemy.y && (enemy.x + enemy.step/2 > this.x && enemy.x < this.x + this.step/2)){  //did position x and y the same as Enemy's                   
                    this.reset();
                }
             }
              //check win 
            if(this.y === 55){
                this.finish = true;
            }
    }                  
    //keyboard input (event listener), update player's x abd y according to input
    handleInput(input) {
        switch(input){
            case 'left':
            if (this.x > 0){
                this.x -= this.step;
                }
                break;
            case 'up':
            if(this.y > 0){
                this.y -= this.jump;
                }
                break;
            case 'right':
            if(this.x < this.step * 4){
                this.x += this.step;
                }
                break;
            case 'down':
                if(this.y < this.jump * 4){
                this.y += this.jump;
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

//Instantiate all objects
const player = new Player();    //New Player object
const enemy1 = new Enemy(-101, 0, 200);
const enemy2 = new Enemy(-101, 83, 400);
const enemy3 = new Enemy(-101, 166, 300);     //New Enemy object
const enemy4 = new Enemy(-101, 166, 150);
let allEnemies =[];             //inst allEnemies array
allEnemies.push(enemy1, enemy2, enemy3, enemy4);          //for each enemy create and push new Enemy object into above array


// This listens for key presses and sends the keys to your
// Player.handleInput() method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function calcTimer(seconds){
    const minutes = Math.floor(seconds / 60);
    const secInMin = seconds % 60;
    return [minutes, secInMin];
}

//function to start the timer 
function myTimer(){
    updateTimer = setInterval(function(){  //Update timer in the screen
            seconds++;
            const tm = calcTimer(seconds);
            secondsIcon.innerHTML = (tm[1] < 10) ? `0${tm[1]}` : `${tm[1]}`;
            minutesIcon.innerHTML = (tm[0] < 10) ?  `0${tm[0]}` : `${tm[0]}`;
    },1000);
}
function resetTimer(){
    seconds = 0;
    minutesIcon.innerHTML = "00";
    secondsIcon.innerHTML = "00";
    updateTimer = undefined;
}
function stopTimer() {    //function to clearInterval to stop the timer.
      clearInterval(updateTimer); 
}
myTimer();

class Modal {
    constructor (){ 
        let modal = document.getElementById('myModal'); 
        let winText=document.querySelector("#winner");
        const tm = calcTimer(seconds); 
        modal.className=('modalshow'); //call the win modal
        winText.innerHTML = "Congratulations! \nYou won the game! \nYou took "+ tm[0] + " minutes and " + tm[1] + " seconds to win the game.";   
    }
}
