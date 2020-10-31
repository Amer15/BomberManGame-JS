let classArray = [];
let randomArray = [];

let score = 0;

const safeClass = 'safe-box'; //71
const dangerClass = 'danger-box'; //10
let activeElement = 0;

const boxes = document.querySelectorAll('.box');
const scoreValue = document.getElementById('score-value');


const showRules = document.querySelector('#rules-btn');
showRules.addEventListener('click', toggleCard);


//Toggle rules 
function toggleCard(e) {
    e.preventDefault();
    document.querySelector('.rules').classList.toggle('hide');
}


//Add data-attribute with value 0-80
let num = 0;
const addDataValue = () => {
    boxes.forEach(box => {
        box.setAttribute('data-value', num);
        num++;
    });
}

addDataValue();



const restartButton = document.getElementById('restart-game');
restartButton.addEventListener('click', startGame);




const onClickHandler = (e) => {
    if (e.target.classList.contains(safeClass)) {
        e.target.classList.add('green');
        const totalBombs = getDataValue(e.target);
        e.target.innerText = totalBombs;
        score++;
        scoreValue.innerText = score;
        checkWin();
        
    }
    else if (e.target.classList.contains(dangerClass)) {
        e.target.classList.add('red');
        lostGame();
    }
}

startGame();

function startGame() {
    classArray = [];
    randomArray = [];
    score = 0;
    activeElement = 0;
    boxes.forEach(boxElement => {
        boxElement.innerHTML = "";
        boxElement.classList.remove(safeClass);
        boxElement.classList.remove(dangerClass);
        boxElement.classList.remove('green');
        boxElement.classList.remove('red');
        boxElement.removeEventListener('click', onClickHandler);
    });
    document.querySelector('.message-modal').classList.remove('show');
    scoreValue.innerText = 0;
    resetScore();
    addSafeClass();
    createRandomArray();
    addDangerClass();
    addClasses();
}


function addSafeClass() {
    //adding safeClass in the classArray
    for (let i = 0; i < 81; i++) {
        classArray.push(safeClass);
    }
}

function createRandomArray() {
    //creating random value array b/w 0-80 for inserting dangerClass in classArray
    let i = 1;
    while (i <= 10) {
        let num = Math.floor(Math.random() * 81);
        randomArray.push(num);
        i++;
    }

    //checking if randomArray contains same value if so incrementing it by 2
    let prevNum = null;
    for (let i = 0; i < randomArray.length; i++) {
        if (prevNum == null) {
            prevNum = randomArray[i];
        }
        else {
            if (randomArray.includes(prevNum)) {
                prevNum = randomArray[i] + 2;
                randomArray[i] = prevNum;
            }
            else {
                prevNum = randomArray[i];
            }
        }
    }
}



function addDangerClass() {
    //inserting dangerClass at specific index in classArray according to the value in randomArray
    for (let i = 0; i < randomArray.length; i++) {
        classArray[randomArray[i]] = dangerClass;
    }
}


//adding all classes from classArray to the all box elements
function addClasses() {
    boxes.forEach(boxElement => {
        boxElement.classList.add(classArray[activeElement]);
        boxElement.addEventListener('click', onClickHandler, { once: true });
        activeElement++;
    });
}


function resetScore() {
    scoreValue.innerText = 0;
}


function checkWin() {
    if (score === 71) {
        // console.log('WOn!!!');
        document.querySelector('.msg-text').innerHTML = `Congratulations!!! You Won.`;
        document.querySelector('.message-modal').classList.add('show');
    }
}

function lostGame() {
    document.querySelector('.msg-text').innerHTML= `<p>You clicked on <span>&#128163;</span> Box.You Lost the Game!!!</p>`;
    document.querySelector('.message-modal').classList.add('show');
}

//getting data-value of each box (0-80) and parsing it to INT
function getDataValue(element) {
    const dataValue = parseInt(element.getAttribute('data-value'));
    return checkSides(dataValue);
}

//Checking all surroundings of clicked box
function checkSides(index) {
    if (index === 0) {
        return IndexPlusOne(index) + IndexPlusNine(index) + IndexPlusTen(index);
    }
    else if (index === 8) {
        return IndexMinusOne(index) + IndexPlusNine(index) + IndexPlusEight(index);
    }
    else if (index === 72) {
        return IndexPlusOne(index) + IndexMinusNine(index) + IndexMinusEight(index);
    }
    else if (index === 80) {
        return IndexMinusOne(index) + IndexMinusNine(index) + IndexMinusTen(index);
    }
    else if (index > 0 && index < 8) {
        return IndexMinusOne(index) + IndexPlusOne(index) + IndexPlusNine(index) + IndexPlusEight(index) + IndexPlusTen(index);
    }
    else if (index > 72 && index < 80) {
        return IndexMinusOne(index) +  IndexPlusOne(index) + IndexMinusNine(index) + IndexMinusTen(index) + IndexMinusEight(index);
    }
    else if (index === 9 || index === 18 || index === 27 || index === 36 || index === 45 || index === 54 || index === 63) {
        return IndexPlusOne(index) + IndexMinusNine(index) + IndexMinusEight(index) +  IndexPlusNine(index) + IndexPlusTen(index);
    }
    else if (index === 17 || index === 26 || index === 35 || index === 44 || index === 53 || index === 62 || index === 71) {
        return IndexMinusOne(index) + IndexMinusNine(index) + IndexMinusTen(index) + IndexPlusNine(index) + IndexPlusEight(index);
    }
    else {
        return IndexPlusOne(index)+IndexMinusOne(index)+IndexMinusNine(index)+IndexMinusEight(index)+IndexMinusTen(index)+IndexPlusNine(index)+IndexPlusTen(index)+IndexPlusEight(index);
    }
}



// Finding Bombs in surrounding boxes FUNCTIONS
function IndexPlusOne(index) {
    let num = 0;
    //For index+1
    if (classArray[index + 1] === dangerClass) {
        boxes[index + 1].innerHTML = `<span class="danger" onclick="lostGame()">&#10071;</span>`;
        num = num + 1;
    }
  
    return num;
}

function IndexPlusEight(index) {
    //For index+9-1
    let num = 0;
    if (classArray[index + 9 - 1] === dangerClass) {
      boxes[index + 9 - 1].innerHTML = `<span class="danger" onclick="lostGame()">&#10071;</span>`;  
      num++;
    }
    
    return num;
}

function IndexPlusNine(index) {
    let num = 0;
    //For index+9
    if (classArray[index + 9] === dangerClass) {
       boxes[index + 9].innerHTML = `<span class="danger" onclick="lostGame()">&#10071;</span>`; 
       num = num + 1;
    }
    
    return num;
}

function IndexPlusTen(index) {
    //For index+9+1
    let num = 0;
    if (classArray[index + 9 + 1] === dangerClass) {
       boxes[index + 9 + 1].innerHTML = `<span class="danger" onclick="lostGame()">&#10071;</span>`; 
       num = num + 1;
    }
    
    return num;
}

function IndexMinusOne(index) {
    //For index-1
    let num = 0;
    if (classArray[index - 1] === dangerClass) {
        boxes[index - 1].innerHTML = `<span class="danger" onclick="lostGame()">&#10071;</span>`;
        num++;
    }
     
    return num;
}

function IndexMinusEight(index) {
    //For index-9+1
    let num = 0;
    if (classArray[index - 9 + 1] === dangerClass) {
        boxes[index - 9 + 1].innerHTML = `<span class="danger" onclick="lostGame()">&#10071;</span>`;
        num++;
    }
    return num;
}

function IndexMinusNine(index) {
    //For index-9
    let num = 0;
    if (classArray[index - 9] === dangerClass) {
      boxes[index - 9].innerHTML = `<span class="danger" onclick="lostGame()">&#10071;</span>`;   
      num++;
    }
    return num;
}

function IndexMinusTen(index) {
    //For index-9-1
    let num = 0;
    if (classArray[index - 9 - 1] === dangerClass) {
      boxes[index - 9 - 1].innerHTML = `<span class="danger" onclick="lostGame()">&#10071;</span>`; 
      num++;
    }
    return num++;
}

















