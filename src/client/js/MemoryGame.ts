window.addEventListener("load", init);

let urlArr: string[] = [];

let Zeit: number = 0;

// fangan();
let zeitvergleich: HTMLElement[] = [];
// function fangan(): void {
//   let storageName = localStorage.getItem("memoryGameName");

//   let name = prompt(
//     "Gebe deinen Namen an: \n",
//     storageName ? storageName : "Neuer Spieler"
//   );

//   if (name == null) {
//     alert("Bitte einen gültigen Namen eingeben!");
//     return;
//   }

//   localStorage.setItem("memoryGameName", name);
// }
let counterInterval = setInterval(counterew, 1000);

//width darf nicht ungerade sein. Man müsste dafür zusätzlichen code schreiben, der das überschüssige Element in eine neuee Zeile schreibt
let width: number = 4;
let height: number = 4;
// let url: string = "https://vasilii-server.herokuapp.com/";
const urlMemory: string = "http://127.0.0.1:5001/";

//anzahl der memorys generiert
let maxTotalIndex: number = width * height;
//generieren des layouts

let memoryContainer: HTMLDivElement;

let maxShuffleAmount: number = 100;
let shuffleAmount: number = 0;
//wie oft gemischt wird

let maxFramesShowSolution: number = 200;
//wie lang zeit zum merken

let framesSinceSolutionShow: number = 0;

let covered: boolean;

let firstUncovered: HTMLDivElement;
let secondUncovered: HTMLDivElement;

async function init(_event: Event): Promise<void> {
  let response: Response = await fetch(urlMemory + "?" + "getOrder=yes");
  let urls: Bilder[] = await response.json();

  for (let elem of urls) {
    if (!elem.url) {
      continue;
    }

    urlArr.push(elem.url);
  }

  console.log(urlArr);

  let ctr: number = urlArr.length;
  while (ctr > 0) {
    //Zufällige Stelle im Array auswählen
    let index: number = Math.floor(Math.random() * ctr);
    // Die Variable eins runterzählen, die letzte Position des Arrays ist eins kleiner als die Länge, weil wir bei  anfangen zu zählen
    ctr--;
    // Temporäre Variable für das Letzte Element im Array
    let temp: string = urlArr[ctr];
    // Dem Letzten Element die zufällig ausgesuchte Stelle geben
    urlArr[ctr] = urlArr[index];
    // Das Element von der zufälligen Stelle wird ans Ende des Arrays geschoben
    urlArr[index] = temp;
  }
  console.log("result", urlArr);
  memoryContainer = <HTMLDivElement>document.querySelector(".memory-container");
  //sucht element mit der Klasse memory-container

  let totalIndex: number = 0;

  for (let rowIndex: number = 0; rowIndex < height; rowIndex++) {
    let newRow: HTMLDivElement = document.createElement("div");
    newRow.setAttribute("class", "row");

    for (
      let elementIndex: number = 0;
      elementIndex < width / 2;
      elementIndex++
    ) {
      let randomPicture = getRandomImage();
      generateElement(totalIndex, maxTotalIndex, newRow, randomPicture);
      generateElement(totalIndex, maxTotalIndex, newRow, randomPicture);

      totalIndex++;
    }

    memoryContainer.appendChild(newRow);
  }
  animate();
}
function counterew(): void {
  Zeit++;
}

function animate(): void {
  if (!covered) {
    handleShuffle();
  }
  requestAnimationFrame(animate);
}

function cover(): void {
  for (
    let rowIndex: number = 0;
    rowIndex < memoryContainer.childElementCount;
    rowIndex++
  ) {
    let currentRow: HTMLDivElement = <HTMLDivElement>(
      memoryContainer.children[rowIndex]
    );
    for (
      let rowIndex: number = 0;
      rowIndex < memoryContainer.childElementCount;
      rowIndex++
    ) {
      let currentElement: HTMLDivElement = <HTMLDivElement>(
        currentRow.children[rowIndex]
      );
      currentElement.style.backgroundColor = "gray";
      currentElement.setAttribute("coverStatus", "covered");
      currentElement.style.backgroundImage = "";
    }
  }
  covered = true;
  // Funktion ändern - ganz am schluss unter der letzten funktion , if bedingung muss angepasst werden (wenn karten alle aufgedeckt sind, muss if bedingung ausgeführt werden)
}

function handleShuffle() {
  if (shuffleAmount < maxShuffleAmount) {
    shuffle();
    shuffleAmount++;
  } else {
    framesSinceSolutionShow++;
    if (framesSinceSolutionShow > maxFramesShowSolution) {
      cover();
    }
  }
}

function shuffle() {
  let randomFirstIndex: number = Math.floor(Math.random() * maxTotalIndex);
  let randomSecondIndex: number = Math.floor(Math.random() * maxTotalIndex);

  let firstElementIndex: number = randomFirstIndex % width;
  let firstGridIndex: number = Math.floor(randomFirstIndex / width);

  let secondElementIndex: number = randomSecondIndex % width;
  let secondGridIndex: number = Math.floor(randomSecondIndex / width);

  let firstGrid: HTMLDivElement = <HTMLDivElement>(
    memoryContainer.children[firstGridIndex]
  );
  let firstChild: HTMLDivElement = <HTMLDivElement>(
    firstGrid.children[firstElementIndex]
  );

  let secondGrid: HTMLDivElement = <HTMLDivElement>(
    memoryContainer.children[secondGridIndex]
  );
  let secondChild: HTMLDivElement = <HTMLDivElement>(
    secondGrid.children[secondElementIndex]
  );

  console.log("shuffle", firstChild, secondChild);
  let firstChildHue: number = parseFloat(
    firstChild.getAttribute("hue") as string
  );
  let secondChildHue: number = parseFloat(
    secondChild.getAttribute("hue") as string
  );

  let firstChildImage: string = firstChild.getAttribute("picture") as string;
  let secondChildImage: string = secondChild.getAttribute("picture") as string;

  firstChild.style.backgroundColor = getHSLString(secondChildHue);
  firstChild.setAttribute("hue", `${secondChildHue}`);
  firstChild.setAttribute("picture", `${secondChildImage}`);
  firstChild.style.backgroundImage = "url(" + secondChildImage + ")";

  secondChild.style.backgroundColor = getHSLString(firstChildHue);
  secondChild.setAttribute("hue", `${firstChildHue}`);
  secondChild.setAttribute("picture", `${firstChildImage}`);
  secondChild.style.backgroundImage = "url(" + firstChildImage + ")";
  // counter++;
  // if(counter == urlArr.length){
  //   counter = 0;
  // }
  // console.log(urlArr[counter]);
}

function getRandomImage(): string{
  let remainingLength = urlArr.length;
  let rndmIdx = Math.floor(Math.random()*remainingLength);
  let url = urlArr[rndmIdx];
  urlArr.splice(rndmIdx, 1);
  return url;
}

function getHSLString(_hue: number): string {
  return `hsl(${_hue}, 100%, 50%)`;
}

function generateElement(
  _totalIndex: number,
  _maxTotalIndex: number,
  _newRow: HTMLDivElement,
  randomPicture: string
) {
  let newElement: HTMLDivElement = document.createElement("div");
  newElement.setAttribute("class", "memory-element");

  //let factor: number = (_totalIndex * 2) / _maxTotalIndex;
  //let hue: number = factor * 360;

  // newElement.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
  // newElement.setAttribute("hue", `${hue}`);
  newElement.setAttribute("picture", `${randomPicture}`);
  newElement.style.backgroundImage = `url(${randomPicture})`;
  _newRow.appendChild(newElement);

  newElement.addEventListener("click", (ev: MouseEvent) => {
    onButtonClick(newElement, ev);
  });
}

async function onButtonClick(
  thisElem: HTMLDivElement,
  _event: MouseEvent
): Promise<void> {
  console.log(thisElem.style.backgroundColor);

  if (thisElem.style.backgroundColor != "gray") {
    alert("Dieses Feld hast du bereits schon angeklickt!");
    return;
  }

  if (firstUncovered == null && secondUncovered == null) {
    firstUncovered = thisElem;
  } else if (secondUncovered == null) {
    secondUncovered = thisElem;

    if (zeitvergleich.length == 14) {
      clearInterval(counterInterval);

      localStorage.setItem("memoryGameTime", Zeit.toString());

      let timeout = setTimeout(() => {
        window.location.href = window.location.href.replace(
          "index.html",
          "enterScore.html"
        );

        clearTimeout(timeout);
      }, 1000);
    }

    if (
      firstUncovered.getAttribute("hue") != secondUncovered.getAttribute("hue")
    ) {
      firstUncovered.style.backgroundColor = "gray";

      secondUncovered.style.backgroundColor = "gray";

      firstUncovered.style.backgroundImage = "";

      secondUncovered.style.backgroundImage = "";

      firstUncovered = null as any;
      secondUncovered = null as any;
      return;
    }
  } else {
    //wenn farben nicht matchen, werden sie wieder grau und klickbar

    if (
      firstUncovered.getAttribute("hue") != secondUncovered.getAttribute("hue")
    ) {
      firstUncovered.style.backgroundColor = "gray";

      secondUncovered.style.backgroundColor = "gray";

      firstUncovered.style.backgroundImage = "";

      secondUncovered.style.backgroundImage = "";
    } else if (
      firstUncovered.getAttribute("hue") == secondUncovered.getAttribute("hue")
    ) {
      zeitvergleich.push(firstUncovered);
      zeitvergleich.push(secondUncovered);
      console.log(zeitvergleich);
    }

    firstUncovered = null as any;
    secondUncovered = null as any;

    return;
  }

  thisElem.style.backgroundColor = `hsl(${thisElem.getAttribute(
    "hue"
  )}, 100%, 50%)`;

  thisElem.style.backgroundImage = `url(${thisElem.getAttribute("picture")})`;
}

interface Bilder {
  url: string;
  _id: string;
}
