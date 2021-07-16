// Globals for graphics
let framebuffer = []; // 16x16 pixel array of bools. True = black
let c = document.getElementById('display');
let ctx = c.getContext('2d');
let pixel_size = 16; // MUST BE DIVISIBLE BY CANVAS DIMENSIONS
let display_size = {x: c.width / pixel_size, y: c.height / pixel_size};

// Globals for turtle
let turtle = {
  x: Math.floor(display_size.x / 2), 
  y: display_size.y - 2, 
  direction: 0, 
  pen_down: true};
let directions = ["up", "right", "down", "left"];
let input_area = document.getElementById('input');

// Functions for graphics
// Init. Run this at startup to get everything ready
function init() {
  // Set framebuffer up blank
  for (let y = 0; y < display_size.y; y++) {
    framebuffer[y] = [];
    for (let x = 0; x < display_size.x; x++) {
      framebuffer[y][x] = false;
    };
  };
  turtle.x = Math.floor(display_size.x / 2);
  turtle.y = display_size.y - 2
  turtle.direction = 0;
  turtle.pen_down = true;
  draw();
};

// Draw a pixel at a given point
// Note that you need to all draw() to actually have it appear
function set_pixel(x, y, value) {
  framebuffer[y][x] = value;
};

function draw() {
  // Draw the background
  for (let y = 0; y < display_size.y; y++) {
    for (let x = 0; x < display_size.x; x++) {
      ctx.beginPath();
      ctx.rect(x * pixel_size, y * pixel_size, pixel_size, pixel_size);
      ctx.fillStyle = "white";
      ctx.fill();
      if (framebuffer[y][x]) {
        ctx.beginPath();
        ctx.rect(x * pixel_size + 1, y * pixel_size + 1, pixel_size - 2, pixel_size - 2);
        ctx.fillStyle = "black";
        ctx.fill();
      };
    };
  };
  // Draw the turtle
  ctx.beginPath();
  ctx.rect(turtle.x * pixel_size, turtle.y * pixel_size, pixel_size, pixel_size);
  ctx.fillStyle = "green";
  ctx.fill()
  ctx.beginPath();
  switch (turtle.direction) {
    case 0:
      ctx.rect(
        turtle.x * pixel_size + pixel_size / 3,
        turtle.y * pixel_size,
        pixel_size / 3,
        pixel_size / 2);
      break;
    case 1:
      ctx.rect(
        turtle.x * pixel_size + pixel_size / 2,
        turtle.y * pixel_size + pixel_size / 3,
        pixel_size / 2,
        pixel_size / 3);
      break;
    case 2:
      ctx.rect(
        turtle.x * pixel_size + pixel_size / 3,
        turtle.y * pixel_size + pixel_size / 2,
        pixel_size / 3,
        pixel_size / 2);
      break;
    case 3:
      ctx.rect(
        turtle.x * pixel_size,
        turtle.y * pixel_size + pixel_size / 3,
        pixel_size / 2,
        pixel_size / 3);
      break;
  };
  ctx.fillStyle = "red";
  ctx.fill();
};

function test_line() {
  init();
  for (let y = 0; y < display_size.y; y++) {
    for (let x = 0; x < display_size.x; x++) {
      if (Math.abs((y / display_size.y) - (x / display_size.x)) < 0.025) { 
        set_pixel(x, y, true);
      } else {
        set_pixel(x, y, false);
      };
    };
  };
  draw();
};

// Functions for turtle
// Pick up or put down the pen
function pen(x) {
  console.log(`Pen: ${x}`);
  if (x[0] == "down") {
    turtle.pen_down = true;
  } else if (x[0] == "up") {
    turtle.pen_down = false;
  };
};

// Move the turtle forward or backward
function move(n) {
  n = parseInt(n[0]);
  console.log(`Move: ${n}`);
  function clamp(nn, axis) { // true = horizontal
    if (axis) {
      if (nn < 0) {
        return 0;
      }
      if (nn > display_size.x) {
        return display_size.x;
      }
      return nn;
    } else {
      if (nn < 0) {
        return 0;
      }
      if (nn > display_size.y) {
        return display_size.y;
      };
      return nn;
    };
  };
  
  switch (turtle.direction) {
    case 0: // up
      var limit = clamp(n, false);
      for (var x = 0; x < limit; x++) {
        set_pixel(turtle.x, turtle.y, turtle.pen_down);
        turtle.y--;
      };
      break;
    case 1: // right
      var limit = clamp(n, false);
      for (var x = 0; x < limit; x++) {
        set_pixel(turtle.x, turtle.y, turtle.pen_down);
        turtle.x++;
      };
      break;
    case 2: // down
      var limit = clamp(n, false);
      for (var x = 0; x < limit; x++) {
        set_pixel(turtle.x, turtle.y, turtle.pen_down);
        turtle.y++;
      };
      break;
    case 3: // left
      var limit = clamp(n, false);
      for (var x = 0; x < limit; x++) {
        set_pixel(turtle.x, turtle.y, turtle.pen_down);
        turtle.x--;
      };
      break;
  }
  draw();
};

// Turn the turtle left or right
// The math used here seems odd, but essentially emulates a circular list
function turn(d) { // d = left or right
  console.log(`Turn: ${d}`);
  if (d[0] == "right") {
    turtle.direction = Math.abs((turtle.direction + 1 + 4) % 4); 
  } else if (d[0] == "left") {
    turtle.direction = Math.abs((turtle.direction - 1 + 4) % 4);
  };
  draw();
}

// Time for a really cool parsing trick: The Jump List
// If you've never seen this before, it's a dictionary. Keys are strings, values are functions.
// You can easily parse scripts by splitting by word and running the first word with the rest as arguments.
let turtle_functions = {
  "pen":  pen,
  "turn": turn,
  "move": move,
};

function parse(str) {
  var temp = str.toLowerCase().split(" ");
  console.log(temp);
  if (turtle_functions[temp[0]]) { // We have the instruction in the jump list
    turtle_functions[temp[0]](temp.slice(1, temp.length));
  } else { // We don't have the instruction in the jump list
    console.log("warning: was given an unknown instruction" + temp[0]);
  }
}

function run_script() {
  var script = input_area.value.split("\n");
  for (var s = 0; s < script.length; s++) {
    parse(script[s]);
  }
}


// Start everything up
window.onload = init();
