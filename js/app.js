/*
 * shuffle() function provided by Udacity's starter code
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

/*
 * My code added -starting with deck of cards list variable
 */
var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];
// Game Variables
var open = [];
var match = 0;
var movesCount = 0;
var numberStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};
// Star Ratings (maximum number of moves for each star)
var hard = 20;
var medium = 25;
var modal = $("#winmodal");
/*
 * Functions to support event callback functions.
 */
// Every second interval function is called which increasest the timer and HTML is updated.
var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }
    // Puts a 0 in front of single digit seconds.
    var formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }
    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};
// Timer resets and restarts timer on HTML
function restartTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");
    timer.clearTime = setInterval(startTimer, 1000);
};
// Updates HTML while placing cards on oard randomly.
function updateCards() {
    deck = shuffle(deck);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    restartTimer();
};
// Win Modal toggle to on
function showModal() {
    modal.css("display", "block");
};
// Decreases stars and updates modal HTML
function decreaseStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numberStars--;
    $(".numstars").text(String(numberStars));
};
// Resets star symbols back to 3 stars, updates modal HTML
function restartStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numberStars = 3;
    $(".numstars").text(String(numberStars));
};
// Updates number of moves on modal as moves are made.
function updateMovesCount() {
    $(".moves").text(movesCount);

    if (movesCount === hard || movesCount === medium) {
        decreaseStar();
    }
};
// Validates if there is not currently a match or card is open.
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};
// Validates if open cards are a matchs
function validateMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};
// Win condition is returned
function didWin() {
    if (match === 16) {
        return true;
    } else {
        return false;
    }
};
// Changes open cards to match state if cards match and checks win state.
var setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    match += 2;

    if (didWin()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};
// Resets cards back to hide state
var resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};
// Sets cards selectes as open and show
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};
/*Event callback functions
 */
// Restarts game variables and updates HTML to its default state.
var restartGame = function() {
    open = [];
    match = 0;
    movesCount = 0;
    restartTimer();
    updateMovesCount();
    $(".card").attr("class", "card");
    updateCards();
    restartStars();
};
// Controls game logic
var onClick = function() {
    if (isValid( $(this) )) {
        if (open.length === 0) {
            openCard( $(this) );
        } else if (open.length === 1) {
            openCard( $(this) );
            movesCount++;
            updateMovesCount();
            if (validateMatch()) {
                setTimeout(setMatch, 300);
            } else {
                setTimeout(resetOpen, 700);
            }
        }
    }
};
// Restarts game and win modal display is set to off
var tryAgain = function() {
    restartGame();
    modal.css("display", "none");
};
/*Starts event listeners
 */
$(".card").click(onClick);
$(".restart").click(restartGame);
$(".try-again").click(tryAgain);
// Randomly places cards on game board when page loads.
$(updateCards);
