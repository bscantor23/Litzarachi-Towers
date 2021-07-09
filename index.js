let disks = 2;
let crono_seg = 0;
let currentStep = 0;
let steps = 0;
let currentDisk = 0;
let draggedElement;

let interval;

let allContainers = document.getElementsByClassName("tower-container");
let allTowers = document.getElementsByClassName("pieces-space");
let start_button = document.getElementById("start_button");
let dificulty_button = document.getElementsByClassName("d-but");
let dificulty_container = document.getElementById("d-cont");

let movements = document.getElementById("movements-history");
let move_container = document.getElementById("movements-container");
let num_movements = document.getElementById("num_movements");

let crono = document.getElementById("cronomete");

//Configure Difficulty Buttons
for (let but of dificulty_button) {
  but.addEventListener('click', () => {
    disks = but.dataset.id == 1 ? 2 : but.dataset.id;

    for (let dif of dificulty_button) {
      if (dif.dataset.id <= disks) {
        dif.classList.remove("color-1")
        dif.classList.add("color-3")
      } else {
        dif.classList.remove("color-3")
        dif.classList.add("color-1")
      }
    }
  })
}

function start_crono() {
  crono_seg = 0;
  interval = setInterval(function () {

    crono_seg++;
    let h = Math.floor(crono_seg / 3600) % 24;
    let m = Math.floor(crono_seg / 60) % 60;
    let s = crono_seg % 60;
    crono.innerText = `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`
  }, 1000)
}

//ComprobateWin
function comprobateWin() {
  console.log(allTowers[2].childNodes.length);
  if (allTowers[2].childNodes.length == disks) {
    let cont = 1;
    for (let piece of allTowers[2].childNodes) {
      if (cont != piece.dataset.id) {
        return
      }
      cont++;
    }
    alert("Has ganado!");
    clearInterval(interval);
  }
}


function stop_timer() {
  crono.innerText = "00:00:00"
  clearInterval(interval);
}

function reset() {

  stop_timer();

  //Remove Previous pieces
  for (let space of allTowers) {
    let child = space.lastChild;
    while (child) {
      child.remove()
      child = space.lastChild
    }
  }

  movements.remove()
  const ul = document.createElement('ul');
  ul.id = "movements-history"
  move_container.prepend(ul)
  movements = ul

  num_movements.innerText = "000";

}

//StartGame
function start() {

  reset();

  //Min steps for win
  steps = Math.pow(2, disks) - 1;
  currentStep = 0;
  currentDisk = 0;

  //Create pieces
  while (currentDisk++ < disks) {
    const piece = document.createElement('div');
    piece.style.backgroundImage = `url(./assets/piece-${currentDisk}.png)`;
    piece.id = `piece-${currentDisk}`;
    piece.dataset.id = currentDisk;
    piece.draggable = true;
    piece.className = "piece";
    piece.style.width = `${90 / disks * currentDisk}%`
    allTowers[0].appendChild(piece);
    console.log("test")
  }

  for (let tower of allContainers) {
    tower.addEventListener('dragover', e => {
      e.preventDefault();
    })
    tower.addEventListener('drop', e => {
      let space = document.getElementById(`space-${tower.dataset.id}`);
      if (draggedElement.parentElement.firstChild == draggedElement) {
        if (!space.firstChild || draggedElement.dataset.id < space.firstChild.dataset.id) {
          currentStep = currentStep + 1;
          const info = document.createElement('li');
          info.innerText = `${currentStep}. F${draggedElement.dataset.id} - T${draggedElement.parentElement.dataset.id} : T${e.target.dataset.id}`;
          movements.prepend(info)

          num_movements.innerText = currentStep

          space.prepend(draggedElement);
          if (currentStep >= steps) {
            comprobateWin();
          }
        }
      }
    })
  }

  let allElements = document.getElementsByClassName("piece");

  for (let el of allElements) {
    el.addEventListener('dragstart', e => {
      console.log(e.target.dataset.id);
      draggedElement = e.target;
    });
  }

  setTimeout(start_crono(), 1000)
}

reset_button.addEventListener("click", () => {
  reset();
})


start_button.addEventListener("click", () => {
  start();
})









