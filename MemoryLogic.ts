namespace Memory {
  let counter: number = 0;
  window.addEventListener("load", init);
  let urlArr: string[] = [];
  let Zeit: number = 0;
  fangan();
  let zeitvergleich: HTMLElement[] = [];
  function fangan(): void {
    setTimeout(alert, 5000, "Viel Erfolg, du hast 1 Minute Zeit");
  }
  setInterval(counterew, 1000);





  //width darf nicht ungerade sein. Man müsste dafür zusätzlichen code schreiben, der das überschüssige Element in eine neuee Zeile schreibt
  let width: number = 4;
  let height: number = 4;
  let url: string = "https://vasilii-server.herokuapp.com/";

  //anzahl der memorys generiert
  let maxTotalIndex: number = width * height;
  //generieren des layouts

  let memoryContainer: HTMLDivElement;
  //hallomeinnameistjohannes

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
    let response: Response = await fetch(url + "?" + "getOrder=yes");
    let responseText: string = await response.text();
    let pretty: string = responseText.replace(/{\\"_id\\":|"\["|}"|\\"url\\":\\/g, "");
    let test: string[] = pretty.split('","');

    for (let elem of test) {
      let removed: string = elem.replace(/\\/g, "");
      let removeBracket: string = removed.replace(/\/"]"|]|\\"]"| \r\n/g, "");
      let index: number = removeBracket.indexOf("http");
      if (index > -1) {
        urlArr.push(removeBracket);
      }
    }
    let ctr: number = urlArr.length;
    while (ctr > 0) {
      //Zufällige Stelle im Array auswählen
      let index: number = Math.floor(Math.random() * ctr);
      // Die Variable eins runterzählen, die letzte Position des Arrays ist eins kleiner als die Länge, weil wir bei  anfangen zu zählen Äffchen-Emoji
      ctr--;
      // Temporäre Variable für das Letzte Element im Array
      let temp: string = urlArr[ctr];
      // Dem Letzten Element die zufällig ausgesuchte Stelle geben
      urlArr[ctr] = urlArr[index];
      // Das Element von der zufälligen Stelle wird ans Ende des Arrays geschoben
      urlArr[index] = temp;
    }
    memoryContainer = <HTMLDivElement>document.querySelector(".memory-container");
    //sucht element mit der Klasse memory-container

    let totalIndex: number = 0;


    for (let rowIndex: number = 0; rowIndex < height; rowIndex++) {

      let newRow: HTMLDivElement = document.createElement("div");
      newRow.setAttribute("class", "row");

      for (let elementIndex: number = 0; elementIndex < width / 2; elementIndex++) {

        generateElement(totalIndex, maxTotalIndex, newRow);
        generateElement(totalIndex, maxTotalIndex, newRow);

        totalIndex++;

      }

      memoryContainer.appendChild(newRow);
    }
    animate();
  }
  function counterew(): void {
    Zeit++
  }

  function animate(): void {
    if (!covered) {
      handleShuffle();

    }
    requestAnimationFrame(animate);
  }

  function cover(): void {
    for (let rowIndex: number = 0; rowIndex < memoryContainer.childElementCount; rowIndex++) {
      let currentRow: HTMLDivElement = <HTMLDivElement>memoryContainer.children[rowIndex];
      for (let rowIndex: number = 0; rowIndex < memoryContainer.childElementCount; rowIndex++) {
        let currentElement: HTMLDivElement = <HTMLDivElement>currentRow.children[rowIndex];
        currentElement.style.backgroundColor = "gray";
        currentElement.setAttribute("coverStatus", "covered");
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


    let firstGrid: HTMLDivElement = <HTMLDivElement>memoryContainer.children[firstGridIndex];
    let firstChild: HTMLDivElement = <HTMLDivElement>firstGrid.children[firstElementIndex];

    let secondGrid: HTMLDivElement = <HTMLDivElement>memoryContainer.children[secondGridIndex];
    let secondChild: HTMLDivElement = <HTMLDivElement>secondGrid.children[secondElementIndex];


    let firstChildHue: number = +firstChild.getAttribute("hue");
    let secondChildHue: number = +secondChild.getAttribute("hue");

    firstChild.style.backgroundColor = getHSLString(secondChildHue);
    firstChild.setAttribute("hue", `${secondChildHue}`);
    // firstChild.style.backgroundImage =  "url(" + urlArr[counter] + ")";

    secondChild.style.backgroundColor = getHSLString(firstChildHue);
    secondChild.setAttribute("hue", `${firstChildHue}`);
    // secondChild.style.backgroundImage =  "url(" + urlArr[counter] + ")";
    // counter++;
    // if(counter == urlArr.length){
    //   counter = 0;
    // }
    // console.log(urlArr[counter]);
  }

  function getHSLString(_hue: number): string {
    return `hsl(${_hue}, 100%, 50%)`;
  }

  function generateElement(_totalIndex: number, _maxTotalIndex: number, _newRow: HTMLDivElement) {
    let newElement: HTMLDivElement = document.createElement("div");
    newElement.setAttribute("class", "memory-element");

    let factor: number = (_totalIndex * 2) / _maxTotalIndex;
    let hue: number = factor * 360;


    newElement.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    newElement.setAttribute("hue", `${hue}`);
    _newRow.appendChild(newElement);


    newElement.addEventListener("click", onButtonClick.bind(newElement));
  }

  async function onButtonClick(this: HTMLDivElement, _event: MouseEvent): Promise <void> {
    console.log(this.style.backgroundColor);
    if (this.style.backgroundColor != "gray") {
      console.log("hallomeinpenis");
      return;
    }

    if (firstUncovered == null && secondUncovered == null) {

      firstUncovered = this;

    } else if (secondUncovered == null) {

      secondUncovered = this;
      if (zeitvergleich.length == 14) {
        let spielername = prompt("Deine Zeit: " + Zeit + "Sekunden" + "\nTrage deinen Namen + Kontonummer ein: ");
        let response: Response = await fetch(url + "?" + "saveHighscore=yes&" + Zeit);
        // alert(Zeit);

      }

    } else {
      //wenn farben nicht matchen, werden sie wieder grau und klickbar

      if (firstUncovered.getAttribute("hue") != secondUncovered.getAttribute("hue")) {
        firstUncovered.style.backgroundColor = "gray";

        secondUncovered.style.backgroundColor = "gray";
      }
      else if (firstUncovered.getAttribute("hue") == secondUncovered.getAttribute("hue")) {
        zeitvergleich.push(firstUncovered);
        zeitvergleich.push(secondUncovered);
        console.log(zeitvergleich);
      }

      firstUncovered = null;
      secondUncovered = null;

      return;
    }


    this.style.backgroundColor = `hsl(${this.getAttribute("hue")}, 100%, 50%)`;
  }
}

