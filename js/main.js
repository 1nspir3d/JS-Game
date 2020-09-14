const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      startBlock = document.querySelector('.start-block'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div'),
      carWrapper = document.createElement('div'),
      leftArrow = document.querySelector('.arrowLeft'),
      rightArrow = document.querySelector('.arrowRight'),
      levelDifficulty = document.querySelector('.level'),
      bestScore = document.querySelector('.best-score'),
      greatings = document.querySelector('.greatings'),
      exit = document.querySelector('.exit');

car.classList.add('car');
carWrapper.classList.add('car-wrapper');

start.addEventListener('click', warningMessage);
leftArrow.addEventListener('click', levelDown);
rightArrow.addEventListener('click', levelUp);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
exit.addEventListener('click', function() {
    greatings.classList.add('hide');
    startBlock.classList.remove('hide');
}); 



const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
};

let levelId = 0;
let levelArray = ['Easy', 'Medium', 'Hard',];

let bestScoreSound = new Audio('bestScore.mp3');

bestScore.innerHTML = 'Best Score: ' + localStorage.getItem('RECORD');


function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
    
    if(startBlock.style.opacity === 0) {
        startBlock.classList.add('hide');
    }
    gameArea.innerHTML = '';
    
    for(let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line', 'num' + i);
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(carWrapper);
    carWrapper.appendChild(car);
    
    carWrapper.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2 + 'px';
    carWrapper.style.top = 'auto';
    carWrapper.style.bottom = 10 + 'px';
    setting.x = carWrapper.offsetLeft;
    setting.y = carWrapper.offsetTop;
    requestAnimationFrame(playGame);
}


function playGame() {
    if(setting.start) {

        setting.score += levelId + 1;
        score.innerHTML = 'SCORE <br>' + setting.score;
        moveRoad();
        moveEnemy();
        rotateCar();
        if(keys.ArrowLeft && setting.x > 10) {
            setting.x -= setting.speed;
        }
        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if(keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if(keys.ArrowDown && setting.y < ((gameArea.offsetHeight - car.offsetHeight) - 1)) {
            setting.y += setting.speed - 2; 
        }

        carWrapper.style.top = setting.y + 'px';
        carWrapper.style.left = setting.x + 'px';
        requestAnimationFrame(playGame);
    }
}




function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}


function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';
        
        if(line.y >= document.documentElement.clientHeight) {
            line.y = -100 ;
        }

    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item) {
        let carRect = carWrapper.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom && 
           carRect.right >= enemyRect.left &&
           carRect.left <= enemyRect.right &&
           carRect.bottom >= enemyRect.top) {
            setting.start = false;
            console.warn('Ой');
            startBlock.classList.remove('hide');

            if(setting.score > localStorage.getItem('RECORD')) {
                beatTheScore();  
            }

            smoothSoundDown();

            startBlock.style.opacity = 1;
            score.style.top = start.offsetHeight;
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if(item.y >= document.documentElement.clientHeight) {
            item.y = -150 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }

    });
}

function levelUp() {
    levelId++;
    
    if(levelId > levelArray.length - 1) {
        levelId = 0;
    }
    if(levelId === 1) {
        setting.speed = 5;
        setting.traffic = 2;
    }else if(levelId === 2) {
        setting.speed = 7;
        setting.traffic = 2;
    } else {
        setting.speed = 3;
        setting.traffic = 3;
    }

    levelDifficulty.textContent = levelArray[levelId];
}

function levelDown() {
    levelId--;

    if(levelId < 0){
        levelId = levelArray.length - 1;
    }
    if(levelId === 1) {
        setting.speed = 5;
        setting.traffic = 2;
    }else if(levelId === 2) {
        setting.speed = 7;
        setting.traffic = 2;
    } else {
        setting.speed = 3;
        setting.traffic = 3;
    }

    levelDifficulty.textContent = levelArray[levelId];
}

function rotateCar() {
    if(keys.ArrowLeft && keys.ArrowDown) {
        carWrapper.style.transform = 'rotate(10deg)';
    } else if(keys.ArrowRight && keys.ArrowDown) {
        carWrapper.style.transform = 'rotate(-10deg)';
    } else if(keys.ArrowLeft) {
        carWrapper.style.transform = 'rotate(-10deg)';
    } else if(keys.ArrowRight) {
        carWrapper.style.transform = 'rotate(10deg)';
    } else {
        carWrapper.style.transform = 'rotate(0deg)';
    }
}

function warningMessage() {
    let intro = new Audio('intro.mp3');
    intro.play();

    myAudio.pause();

    dissapearing();

    setTimeout(() => {
        startGame();
        smoothSoundUp();
        myAudio.play();
    }, 7000);
}

function dissapearing() {
    startBlock.style.opacity = 1;
let myInterval = setInterval(() => {
    startBlock.style.opacity -=  0.01;
    
    if(startBlock.style.opacity == 0) {
        startBlock.classList.add('hide');
        clearInterval(myInterval);
    }
}, 70);
}

function smoothSoundUp() {
    range.value = 0;
    changeVolume();
    let myInterval = setInterval(() => {
        range.value ++;
        changeVolume();
        if(range.value == rangeValue) {
            clearInterval(myInterval);
        }
    }, 100);
}

function smoothSoundDown() {
    changeVolume();
    let myInterval = setInterval(() => {
        range.value -= 5;
        changeVolume();
        if(range.value <= 0) {
            myAudio.pause();
            clearInterval(myInterval);
        }
    }, 100);
}

function beatTheScore() {
    startBlock.classList.add('hide');
    myAudio.pause();
    greatings.classList.remove('hide');
    localStorage.setItem('RECORD', setting.score);
    bestScore.innerHTML = 'Best Score: ' + localStorage.getItem('RECORD');

    bestScoreSound.play();

    let scoreVolume = 0;
    

    let scoreInterval = setInterval(() => {
        scoreVolume ++;
        bestScoreSound.volume = scoreVolume / 100;
    }, 100);

    setTimeout(() => {
        let stopInterval = setInterval(() => {
            scoreVolume --;
            bestScoreSound.volume = scoreVolume / 100;
            if(scoreVolume == 0 ) {
                bestScoreSound.pause();

                clearInterval(stopInterval);
            }
        }, 100);
        clearInterval(scoreInterval);
    }, 5000);

    
}



