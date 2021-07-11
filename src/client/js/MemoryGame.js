"use strict";
window.addEventListener("load", init);
let urlArr = [];
let Zeit = 0;
// fangan();
let zeitvergleich = [];
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
let width = 4;
let height = 4;
// let url: string = "https://vasilii-server.herokuapp.com/";
const urlMemory = "http://127.0.0.1:5001/";
//anzahl der memorys generiert
let maxTotalIndex = width * height;
//generieren des layouts
let memoryContainer;
let maxShuffleAmount = 100;
let shuffleAmount = 0;
//wie oft gemischt wird
let maxFramesShowSolution = 200;
//wie lang zeit zum merken
let framesSinceSolutionShow = 0;
let covered;
let firstUncovered;
let secondUncovered;
async function init(_event) {
    let response = await fetch(urlMemory + "?" + "getOrder=yes");
    let urls = await response.json();
    for (let elem of urls) {
        if (!elem.url) {
            continue;
        }
        urlArr.push(elem.url);
    }
    console.log(urlArr);
    let ctr = urlArr.length;
    while (ctr > 0) {
        //Zufällige Stelle im Array auswählen
        let index = Math.floor(Math.random() * ctr);
        // Die Variable eins runterzählen, die letzte Position des Arrays ist eins kleiner als die Länge, weil wir bei  anfangen zu zählen
        ctr--;
        // Temporäre Variable für das Letzte Element im Array
        let temp = urlArr[ctr];
        // Dem Letzten Element die zufällig ausgesuchte Stelle geben
        urlArr[ctr] = urlArr[index];
        // Das Element von der zufälligen Stelle wird ans Ende des Arrays geschoben
        urlArr[index] = temp;
    }
    console.log("result", urlArr);
    memoryContainer = document.querySelector(".memory-container");
    //sucht element mit der Klasse memory-container
    let totalIndex = 0;
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        let newRow = document.createElement("div");
        newRow.setAttribute("class", "row");
        for (let elementIndex = 0; elementIndex < width / 2; elementIndex++) {
            let randomPicture = getRandomImage();
            generateElement(totalIndex, maxTotalIndex, newRow, randomPicture);
            generateElement(totalIndex, maxTotalIndex, newRow, randomPicture);
            totalIndex++;
        }
        memoryContainer.appendChild(newRow);
    }
    animate();
}
function counterew() {
    Zeit++;
}
function animate() {
    if (!covered) {
        handleShuffle();
    }
    requestAnimationFrame(animate);
}
function cover() {
    for (let rowIndex = 0; rowIndex < memoryContainer.childElementCount; rowIndex++) {
        let currentRow = (memoryContainer.children[rowIndex]);
        for (let rowIndex = 0; rowIndex < memoryContainer.childElementCount; rowIndex++) {
            let currentElement = (currentRow.children[rowIndex]);
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
    }
    else {
        framesSinceSolutionShow++;
        if (framesSinceSolutionShow > maxFramesShowSolution) {
            cover();
        }
    }
}
function shuffle() {
    let randomFirstIndex = Math.floor(Math.random() * maxTotalIndex);
    let randomSecondIndex = Math.floor(Math.random() * maxTotalIndex);
    let firstElementIndex = randomFirstIndex % width;
    let firstGridIndex = Math.floor(randomFirstIndex / width);
    let secondElementIndex = randomSecondIndex % width;
    let secondGridIndex = Math.floor(randomSecondIndex / width);
    let firstGrid = (memoryContainer.children[firstGridIndex]);
    let firstChild = (firstGrid.children[firstElementIndex]);
    let secondGrid = (memoryContainer.children[secondGridIndex]);
    let secondChild = (secondGrid.children[secondElementIndex]);
    console.log("shuffle", firstChild, secondChild);
    let firstChildHue = parseFloat(firstChild.getAttribute("hue"));
    let secondChildHue = parseFloat(secondChild.getAttribute("hue"));
    let firstChildImage = firstChild.getAttribute("picture");
    let secondChildImage = secondChild.getAttribute("picture");
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
function getRandomImage() {
    let remainingLength = urlArr.length;
    let rndmIdx = Math.floor(Math.random() * remainingLength);
    let url = urlArr[rndmIdx];
    urlArr.splice(rndmIdx, 1);
    return url;
}
function getHSLString(_hue) {
    return `hsl(${_hue}, 100%, 50%)`;
}
function generateElement(_totalIndex, _maxTotalIndex, _newRow, randomPicture) {
    let newElement = document.createElement("div");
    newElement.setAttribute("class", "memory-element");
    //let factor: number = (_totalIndex * 2) / _maxTotalIndex;
    //let hue: number = factor * 360;
    // newElement.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    // newElement.setAttribute("hue", `${hue}`);
    newElement.setAttribute("picture", `${randomPicture}`);
    newElement.style.backgroundImage = `url(${randomPicture})`;
    _newRow.appendChild(newElement);
    newElement.addEventListener("click", (ev) => {
        onButtonClick(newElement, ev);
    });
}
async function onButtonClick(thisElem, _event) {
    console.log(thisElem.style.backgroundColor);
    if (thisElem.style.backgroundColor != "gray") {
        alert("Dieses Feld hast du bereits schon angeklickt!");
        return;
    }
    if (firstUncovered == null && secondUncovered == null) {
        firstUncovered = thisElem;
    }
    else if (secondUncovered == null) {
        secondUncovered = thisElem;
        if (zeitvergleich.length == 14) {
            clearInterval(counterInterval);
            localStorage.setItem("memoryGameTime", Zeit.toString());
            let timeout = setTimeout(() => {
                window.location.href = window.location.href.replace("index.html", "enterScore.html");
                clearTimeout(timeout);
            }, 1000);
        }
        if (firstUncovered.getAttribute("hue") != secondUncovered.getAttribute("hue")) {
            firstUncovered.style.backgroundColor = "gray";
            secondUncovered.style.backgroundColor = "gray";
            firstUncovered.style.backgroundImage = "";
            secondUncovered.style.backgroundImage = "";
            firstUncovered = null;
            secondUncovered = null;
            return;
        }
    }
    else {
        //wenn farben nicht matchen, werden sie wieder grau und klickbar
        if (firstUncovered.getAttribute("hue") != secondUncovered.getAttribute("hue")) {
            firstUncovered.style.backgroundColor = "gray";
            secondUncovered.style.backgroundColor = "gray";
            firstUncovered.style.backgroundImage = "";
            secondUncovered.style.backgroundImage = "";
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
    thisElem.style.backgroundColor = `hsl(${thisElem.getAttribute("hue")}, 100%, 50%)`;
    thisElem.style.backgroundImage = `url(${thisElem.getAttribute("picture")})`;
}
//# sourceMappingURL=MemoryGame.js.map