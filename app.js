//global variables
var globalScore, roundScore, activePlayer, isGamePlaying, lastDiceValue, numDice, modal, modalRules, modalGuidelines, currentScore0, currentScore1, playerPanel0, playerPanel1;

//essential functions

//1. function to initialize the game
function initialize() {
    numDice = 1;
    globalScore = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    isGamePlaying = true;

    dice1DomElement = document.getElementById('dice-1');
    dice2DomElement = document.getElementById('dice-2');
    modal = document.querySelector('.modal');
    modalRules = document.querySelector('.rules');
    modalGuidelines = document.querySelector('.guidelines');
    currentScore0 = document.getElementById('current-0');
    currentScore1 = document.getElementById('current-1');
    playerPanel0 = document.querySelector('.player-0-panel');
    playerPanel1 = document.querySelector('.player-1-panel');

    //hide the dice when the game begins
    dice1DomElement.style.display = 'none';
    dice2DomElement.style.display = 'none';

    //check number of dice
    document.querySelector('.options').addEventListener('click', function () {
        if (document.getElementById('two').checked) {
            numDice = 2;
        } else {
            dice2DomElement.parentNode.removeChild('#dice-2');
        }
    });

    //reset everything when the game begins
    currentScore0.textContent = '0';
    currentScore1.textContent = '0';

    playerPanel0.classList.remove('winner');
    playerPanel1.classList.remove('winner');
    playerPanel0.classList.remove('active');
    playerPanel1.classList.remove('active');
    playerPanel0.classList.add('active');

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';

    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

}

//function to change player on his turn
function togglePlayer() {
    //toggle the active player when dice has value = 1
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;

    //reset current scores to 0
    currentScore0.textContent = 0;
    currentScore1.textContent = 0;

    //toggle the active player and show on ui
    playerPanel0.classList.toggle('active');
    playerPanel1.classList.toggle('active');

    //hide the dice while toggling active player
    dice1DomElement.style.display = 'none';

    if (numDice === 2) {
        dice2DomElement.style.display = 'none';
    }
}

//when page loads initialize the game
initialize();

//Event 1 : when roll dice button is clicked
document.querySelector('.btn-roll').addEventListener('click', function () {

    if (isGamePlaying) {
        //1. generate a random number between 1 & 6 (inclusive)
        var dice1 = Math.floor(Math.random() * 6 + 1);

        //2. Disply the result on dice
        dice1DomElement.style.display = 'block';
        dice1DomElement.src = 'dice-' + dice1 + '.png';

        if (numDice === 2) {
            var dice2 = Math.floor(Math.random() * 6 + 1);
            console.log('d2: ' + dice2);
            dice2DomElement.style.display = 'block';
            dice2DomElement.src = 'dice-' + dice2 + '.png';
        }

        //3. Update the score
        //a) in case of 1 dice
        if (numDice === 1) {
            //reset the score if there are 2 consecutive 6
            if (dice1 === 6 && lastDiceValue === 6) {
                globalScore[activePlayer] = 0;
                document.querySelector('#score-' + activePlayer).textContent = '0';
                //next player's turn
                togglePlayer();
            }
            //Update the round score if the number was not 1
            if (dice1 !== 1) {
                roundScore += dice1;
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
            } else {
                //next player's turn
                togglePlayer();
            }
            //Save 1st time value so that next time you can access it to compare if both are 6
            lastDiceValue = dice1;
        }
        //a) in case of 2 dice
        else if (numDice === 2) {
            //Update the score if none of the dice is 1
            if (dice1 !== 1 && dice2 !== 1) {
                roundScore += dice1 + dice2;
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
            } else {
                //next player's turn
                togglePlayer();
            }
        }
    }

});

//Event 2 : when hold button is clicked
document.querySelector('.btn-hold').addEventListener('click', function () {

    if (isGamePlaying) {
        //1. add player's current score to the global score
        globalScore[activePlayer] += roundScore;

        //2. update UI
        document.querySelector('#score-' + activePlayer).textContent = globalScore[activePlayer];

        //Add an input field to the HTML where players can set the winning score
        var input = document.querySelector('.winning-score').value;
        var winningScore;

        if (input) {
            winningScore = input;
        } else {
            winningScore = 100; //default
        }

        //3. check if the player won
        if (globalScore[activePlayer] >= winningScore) {
            //change player name of the winner
            document.querySelector('#name-' + activePlayer).textContent = 'WINNER !';

            //hide the dice when player wins
            dice1DomElement.style.display = 'none';
            if (numDice === 2) {
                dice2DomElement.style.display = 'none';
            }

            //add winner class to the player's panel who won
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');

            //remove active class from the winner's player panel
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            isGamePlaying = false;
        } else {
            //next player's turn
            togglePlayer();
        }
    }
})

//Event 3 : when new game button is clicked
document.querySelector('.btn-new').addEventListener('click', initialize);

//Events for the rules and guidelines modals
//open popup for guidlines
document.querySelector('.btn-guidelines').addEventListener('click', function () {
    modal.style.display = 'block';
    modalGuidelines.style.display = 'block';
    modalRules.style.display = 'none';
});

//open popup for rules
document.querySelector('.btn-rules').addEventListener('click', function () {
    modal.style.display = 'block';
    modalGuidelines.style.display = 'none';
    modalRules.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function () {
    modal.style.display = 'none';
})