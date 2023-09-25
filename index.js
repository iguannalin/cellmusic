window.addEventListener("load", () => {
  const alive = "🌹";
  const dead = "🥀";
  let gridWidth = 5;
  let gridHeight = 6;
  // let gridSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 30);
  let runTime;
  let reveal = document.getElementById("reveal");
  let interval;

  // notes from--https://github.com/Tonejs/Tone.js/tree/r12/examples/audio/salamander
  const notes = ["A0","A1","A2","A3","A4","A5","A6","A7","C1","C2","C3","C4","C5","C6","C7","C8","D#1","D#2","D#3","D#4","D#5","D#6","D#7","F#1","F#2","F#3","F#4","F#5","F#6","F#7"];
  let notesToPlay = [];

  function playNotes(notes) {
    let obj = {}; 
    notes.forEach((n) => {obj[n] = `${n.replace("#","s")}.mp3`});
    console.log(obj)
    const sampler = new Tone.Sampler({
      urls: obj, release: 1, baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();
    Tone.loaded().then(() => {
      sampler.triggerAttackRelease(notes, 4);
    });
  }

  const getSquare = (x,y) => {
    if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) return;
    const cell = document.getElementById(`${x}-${y}`);
    if (cell) return cell.innerText;
  }

  function getLiveNeighbors(x, y) {
    let n = 0;
    if (x-1 && y-1 && getSquare(x-1,y-1) == alive) // top-left
      n++;
    if (x && y-1 && getSquare(x,y-1) == alive) // top-center
      n++;
    if (x+1 && y-1 && getSquare(x+1,y-1) == alive) // top-right
      n++;
    if (x-1 && y && getSquare(x-1,y) == alive) // middle-left
      n++;
    if (x+1 && y && getSquare(x+1,y) == alive) // middle-right
      n++;
    if (x-1 && y+1 && getSquare(x-1,y+1) == alive) // bottom-left
      n++;
    if (x && y+1 && getSquare(x,y+1) == alive) // bottom-center
      n++;
    if (x+1 && y+1 && getSquare(x+1,y+1) == alive) // bottom-right
      n++;
    return n;
  }
  
  function init() {
    const grid = document.getElementById("grid");
    grid.addEventListener("click", init);
    grid.innerHTML = "";
    runTime = 50;
    reveal.innerHTML = "⚇";
    for (let i = 0; i < gridHeight; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < gridWidth; j++) {
        const td = document.createElement("td");
        td.innerText = Math.random() > 0.5 ? dead : alive;
        td.dataset.note = `${notes[(i*gridWidth)+j]}`;
        td.id = `${i}-${j}`;
        tr.appendChild(td);
      }
      grid.appendChild(tr);
    }
    interval = setInterval(play, 1000);
  }

  function play() {
    if (runTime < 0) {
      reveal.innerHTML = "⚉";
      clearInterval(interval);
      return;
    }
    runTime--;
    for (let i = 0; i < gridHeight; i++) {
      for (let j = 0; j < gridWidth; j++) {
        const cell = document.getElementById(`${i}-${j}`);
        const liveNeighbors = getLiveNeighbors(i,j);
        if (cell.innerText == alive) { // live cell
          if (liveNeighbors < 2 || liveNeighbors >= 4) cell.innerText = dead;
        } else { // dead cell
          if (liveNeighbors == 3) {
            notesToPlay.push(cell.dataset.note);
            cell.innerText = alive;
          }
        }
      }
    }
    playNotes(notesToPlay);
    notesToPlay = [];
  }

  init();
});