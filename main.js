// Select and store the gameboard element
const gameboard = document.querySelector('#gameboard')
// Select and store the score element
const score = document.querySelector('#score')
//  Select and store the cards element
const cards = document.querySelector('#cards')
//  Select and store the message element
const message = document.querySelector('#message')
message.textContent = "Welcome, Click to Button to Start"
//get reset button element
const reset = document.querySelector('#reset')
// With this propert at the beginning reset button will not appear
reset.style.display = "none"




// Beginning Scene of Game starts with these functions 
function startScreen() {
  

  const start = document.createElement('button')  
  start.type = "button"
  start.id = "start"
  start.textContent = "Let's Go! Start the Game"
  start.addEventListener('click', startScreenButtonClicked)
  gameboard.appendChild(start)
}

function startScreenButtonClicked(event) {
  let option = event.target.id
  hideStartScreen()
  StartGame(option)

}

function hideStartScreen() {
  var start = document.querySelector('#start')   
  start.style.display = "none"   
}

function displayStartScreen() {
  var start = document.querySelector('#start')    
  start.style.display = "block"   
}
// Calling start screen for beggining scene of game 

startScreen()

// This is the function to Start the game

function StartGame(option) {
  message.textContent = "Select a card to start"
  var cardValues;
  switch(option)
  {
    case "start":
    cardValues = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
    break
  }


  let deck = []

  var state = false

  // S Create a function to shuffle the deck
  function shuffleDeck () {
    // Create a placeholder array
    let tmp = []  

    //  Iterate through card values 4 times
    for (let i = 0; i < 4; i++) {
      for(let cardValue of cardValues) {
        tmp.push(cardValue)
      }    
    }
    console.log(tmp)
    var tmpLength = tmp.length
    for(let j = 0; j< tmpLength; j++) {
    // Step 2d - Using a conditional loop
      if (tmp.length != 0) {
        // Step 2e - Select a random card from the array
        let randomCard = tmp.splice(Math.floor(Math.random() * tmp.length),1)

        // Step 2f - Add the card to the deck array
        deck.push(randomCard)
      }
    }
    
  }

  // Call the shuffleDeck function
  shuffleDeck()

  // Create an array to store 2 players
  var player1 = 0
  var player2 = 0
  var players = [player1, player2]

  //  Create a variable to store the current player
  var currentPlayer = 0

  //Create a variable to store the first selected card
  var currentCard = null


  // Iterate through the deck and bind a click event to each one
  for(let card of deck) {
    //  Create a new div element to be a card
    let cardEle = document.createElement('div')
    let cardEleValue = document.createElement('span')

    //  Add a 'card' class to the class list on the new div element
    cardEle.classList.add('card')

    //  Add a data value to the card with the card's value in it
    cardEleValue.dataset.value = card

    //  Bind the cardSelected function
    // to the click event on the cardEle
    cardEle.addEventListener('click', cardSelected)
    //append cardEleValue to cardEle
    cardEle.appendChild(cardEleValue)
    //append cardEle to cards
    cards.appendChild(cardEle)
    
  }


  // Create a function to store the logic
  // for when a card is selected
  function cardSelected (event) {
    
    console.log(state)
    if(!state) {
      let clickedCard = event.target
      clickedCard.classList.add('rotated')
      console.log(event.target)
      let cardChildSpan = event.target.querySelector('span')
      //adding a bit of a delay so that after the card start rotating it's
      //value  does not appear instantly
      setTimeout(function() {
        cardChildSpan.textContent = cardChildSpan.dataset.value
      },100)
      event.target.removeEventListener('click', cardSelected)
      //  Check if there is already a card selected
      if(currentCard != null) {
        console.log("Current card:",currentCard)
        //  Compare the cards
        if(currentCard.querySelector('span').dataset.value === cardChildSpan.dataset.value) {
          console.log("Cards are equal")
          //  Add a class to the 2 card elements
          // flipping them over
          currentCard.classList.add('flipped')
          currentCard.removeEventListener('click', cardSelected)
          event.target.classList.add('flipped')
          event.target.removeEventListener('click', cardSelected)       
          //  Add a point to the score for this player
          players[currentPlayer] += 1
          score.textContent = `Player 1: ${players[0]} - Player 2: ${players[1]}`

          // Tell the player to go again
          // (use string interpolation to show which player you're addressing)
          message.textContent = 
          `Congratulations! Player ${currentPlayer+1}, please go again!`
          currentCard = null
          
        } else {
          state = true
          message.textContent = "Oh, so sorry!!! But yer' not psychic!"
          setTimeout(function () {
            cardChildSpan.textContent = ""
            event.target.addEventListener('click',cardSelected)
            console.log(event.target)
            currentCard.querySelector('span').textContent = ""
            currentCard.addEventListener('click', cardSelected)
            clickedCard.classList.remove('rotated') 
            currentCard.classList.remove('rotated')        
            
          }, 1700)
          //  Provide a fail message to the player
          
          setTimeout(function() {
        
            //  Using a ternary, change players
            currentPlayer = (currentPlayer === 0 ) ? 1 : 0

            //  Concatenate a message to the message element
            // advising player 2 that it's their turn now
            // (use string interpolation to show which player you're addressing)
            message.textContent = `Player ${currentPlayer + 1}, it is your turn!`
            currentCard = null
            state = false
          }, 1750)
        }
      } else {
        //  Assign the card to currentCard
        currentCard = event.target
        console.log("currentCard set to ",event.target)
        // Step 5c - Tell the player to select another card
        // (use string interpolation to show which player you're addressing)
        message.textContent = `Player ${currentPlayer+1}, please select another card`
      }

      // Check if the board is full
      if(players[0] + players[1] === deck.length/2) {
        // Step 7a - Check if one of the players has won
        if(players[0] != players[1]) {
          // Step 7b - Tell the player they've won
          // (use string interpolation to show which player you're addressing)
          message.textContent = `Player ${(players[0] > players[1]) ? 1 : 2}, you won!!! Congratulations!`
        } else {
          //  Tell the players that the game has ended in a tie
          message.textContent = "The game was a tie! Nice try!"
        }

        //display the reset button
        reset.style.display = "flex"
      }
    } 
  }



  reset.addEventListener('click', resetGame)

  function resetGame(event) {
    
    reset.style.display = "none"
    currentPlayer = 0
   

    while(cards.childElementCount > 0)
    {
      cards.removeChild(cards.lastChild)
    }

   

    players[0] = 0
    players[1] = 0
    
    message.textContent = "Let's click to see what's hiding behind the cards"
    score.textContent = `Player 1: ${players[0]} - Player 2: ${players[1]}`
    
    displayStartScreen()

  }

}

