"use strict"
var XCOOR = 100;
var YCOOR = 50;
var LOG = false;
var running = false;
var mainContainer = document.getElementById("main-container");

var container = document.createElement('div');
container.className = "grid-container";
mainContainer.appendChild(container);

// create grid
function createGrid(){
  for (var y = 1;y <= YCOOR;y++){
    for (var x = 1;x <= XCOOR;x++){
      var item = document.createElement('div');
      item.setAttribute("onclick", "toggleCellState(this)");
      item.future = null;
      item.className = "grid-item dead";
      item.id = `cell-${x}-${y}`;
      container.appendChild(item);
    }
  }
}
function killAll(){
  for (var cell of document.getElementsByClassName("grid-item")){
    cell.className = "grid-item dead";
  }
}
function toggleOnOffSign(){
  var sign = document.getElementById("onOffSign");
  if (sign.className == "on"){
    sign.className = "off";
  }
  else {
    sign.className = "on";
  }
}
function toggleCellState(cell){
  if (cell.classList.contains("dead")){
    cell.className = "grid-item alive";
  }
  else{
    cell.className = "grid-item dead";
  }
}
function fillGrid(){

  for (var i=0;i<20;i++){
    var randy = Math.floor((Math.random() * YCOOR) + 1);
    var randx = Math.floor((Math.random() * XCOOR) + 1);

    var selitem = document.getElementById(`cell-${randx}-${randy}`);
    selitem.className = "grid-item alive";

    var neighs = getNeighbours(selitem);
    for (var neigh of neighs){
      if (neigh){
        neigh.className = "grid-item alive";
      }
    }
  }
}
function getNeighbours(cell){
  var cellNameItems = cell.id.split("-");
  var xcoor = parseInt(cellNameItems[1]);
  var ycoor = parseInt(cellNameItems[2]);
  return [document.getElementById(`cell-${xcoor}-${ycoor+1}`),
          document.getElementById(`cell-${xcoor}-${ycoor-1}`),
          document.getElementById(`cell-${xcoor-1}-${ycoor}`),
          document.getElementById(`cell-${xcoor+1}-${ycoor}`),
          document.getElementById(`cell-${xcoor+1}-${ycoor+1}`),
          document.getElementById(`cell-${xcoor-1}-${ycoor-1}`),
          document.getElementById(`cell-${xcoor-1}-${ycoor+1}`),
          document.getElementById(`cell-${xcoor+1}-${ycoor-1}`)
        ];
}
function getAmountAliveNeighbours(cell){
  var neighbours = getNeighbours(cell);
  var aliveAmount = 0;
  for (var neighbour of neighbours){
    if (neighbour && neighbour.classList.contains("alive")){
      aliveAmount++;
    }
  }
  return aliveAmount;
}
function update(){
  var aliveCells = document.getElementsByClassName("alive");

  for(var cell of aliveCells ){
    for (var neighbour of getNeighbours(cell)){
      if (neighbour) {
        var amountAlive = getAmountAliveNeighbours(neighbour);

        if (amountAlive <= 1 ){
          neighbour.future = false;
          if (LOG){
            console.log(`Cell ${neighbour.id} has 1 or fewer neighbours and died.`)
          }
        }
        else if (amountAlive >= 4){
          neighbour.future = false;
          if (LOG){
            console.log(`Cell ${neighbour.id} has 4 or more neighbours and died.`)
          }
        }
        else if (amountAlive == 3){
          neighbour.future = true;
          if (LOG){
            console.log(`Cell ${neighbour.id} has 3 or more neighbours and became alive.`)
          }
        }
        else {
          if (LOG){
            console.log(`Cell ${neighbour.id} has 3 or 2 neighbours and stayed alive.`)
          }
        }
      }
    }
  }
}
function draw(){
  var allCells  = document.getElementsByClassName("grid-item");

  for (var cell of allCells) {
    if (cell.future == true) {
      cell.className = "grid-item alive";
      cell.future = null;
    }
    else if (cell.future == false){
      cell.className = "grid-item dead";
      cell.future = null;
    }
  }
}
function toggleRunning(){
  if (running){
    toggleOnOffSign();
    running = false;
  }
  else {
    toggleOnOffSign();
    running = true;
  }
}
function run(){
  if (running){
    update();
    draw();
    window.requestAnimationFrame(run);
  }
}

createGrid();
fillGrid();
