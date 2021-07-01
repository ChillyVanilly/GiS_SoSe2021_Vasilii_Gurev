namespace Memory {
  window.addEventListener("load", init);


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
  async function connectdatabase(): Promise<void> {
    let response: Response = await fetch(url + "?" + "getOrder=yes");
    let responseText: string = await response.text();
    let pretty: string = responseText.replace(/\\|"url\":\|/g, "");
    var matches = responseText.match(/\bhttps?:\/\/\S+/gi);
    let linesbeauty: string[] = pretty.split('","');
    console.log(matches);
  }

  function init(_event: Event): void {
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
    connectdatabase();
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

    secondChild.style.backgroundColor = getHSLString(firstChildHue);
    secondChild.setAttribute("hue", `${firstChildHue}`);
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

  function onButtonClick(this: HTMLDivElement, _event: MouseEvent): void {
    console.log(this.style.backgroundColor);
    if (this.style.backgroundColor != "gray") {
      return;
    }

    if (firstUncovered == null && secondUncovered == null) {

      firstUncovered = this;

    } else if (secondUncovered == null) {

      secondUncovered = this;

    } else {

      if (firstUncovered.getAttribute("hue") != secondUncovered.getAttribute("hue")) {
        firstUncovered.style.backgroundColor = "gray";

        secondUncovered.style.backgroundColor = "gray";
      }

      firstUncovered = null;
      secondUncovered = null;

      return;
    }


    this.style.backgroundColor = `hsl(${this.getAttribute("hue")}, 100%, 50%)`;
  }
}

