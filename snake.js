window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

let finalDirection;



const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const box = 32; //every single unit

const ground = new Image();
ground.src = "img/ground3.png";

const foodImage = new Image();
foodImage.src = "img/food2.png";

let snake = [];

snake[0] = {
  x: 9 * box,
  y: 10 * box,
};

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

let score = 0;

let d;
//
// event listener

// document.addEventListener("keydown", direction);
recognition.addEventListener("result", direction);

function direction(event) {

  const hello = Array.from(event.results).map((result)=> result[0].transcript);
  finalDirection = hello[0];
  console.log(hello)
  
  let key = finalDirection;

  if (key == 'left'  && d != "RIGHT") {
    d = "LEFT";
  } else if (key == 'up' || key=='app' && d != "DOWN") {
    d = "UP";
  } else if (key == 'right' && d != "LEFT") {
    d = "RIGHT";
  } else if (key == 'down' && d != "UP") {
    d = "DOWN";
  }
}

//collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function draw() {
  //ground drawing
  ctx.drawImage(ground, 0, 0);
  for (let i = 0; i < snake.length; i++) {
    //fill the snake
    ctx.fillStyle = i == 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    //add stroke
    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
  //food drawing
  ctx.drawImage(foodImage, food.x, food.y);

  //score drawing
  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2 * box, 1.6 * box);

  //OLD HEAD
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  //giving direction
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  //add new head
  let newHead = {
    x: snakeX,
    y: snakeY
  };
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else {
    snake.pop();
  }
  //game over
  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
  }

  snake.unshift(newHead);
}
recognition.addEventListener("end", recognition.start);

let game = setInterval(draw, 500);
recognition.start();