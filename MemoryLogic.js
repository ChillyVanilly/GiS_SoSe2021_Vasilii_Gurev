"use strict";
var Memory;
(function (Memory) {
    let counter = 0;
    window.addEventListener("load", init);
    let urlArr = [];
    let Zeit = 0;
    fangan();
    let zeitvergleich = [];
    function fangan() {
        setTimeout(alert, 5000, "Viel Erfolg, du hast 1 Minute Zeit");
    }
    setInterval(counterew, 1000);
    //width darf nicht ungerade sein. Man müsste dafür zusätzlichen code schreiben, der das überschüssige Element in eine neuee Zeile schreibt
    let width = 4;
    let height = 4;
    let url = "https://vasilii-server.herokuapp.com/";
    //anzahl der memorys generiert
    let maxTotalIndex = width * height;
    //generieren des layouts
    let memoryContainer;
    //hallomeinnameistjohannes
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
        let response = await fetch(url + "?" + "getOrder=yes");
        let responseText = await response.text();
        let pretty = responseText.replace(/{\\"_id\\":|"\["|}"|\\"url\\":\\/g, "");
        let test = pretty.split('","');
        for (let elem of test) {
            let removed = elem.replace(/\\/g, "");
            let removeBracket = removed.replace(/\/"]"|]|\\"]"| \r\n/g, "");
            let index = removeBracket.indexOf("http");
            if (index > -1) {
                urlArr.push(removeBracket);
            }
        }
        let ctr = urlArr.length;
        while (ctr > 0) {
            //Zufällige Stelle im Array auswählen
            let index = Math.floor(Math.random() * ctr);
            // Die Variable eins runterzählen, die letzte Position des Arrays ist eins kleiner als die Länge, weil wir bei  anfangen zu zählen Äffchen-Emoji
            ctr--;
            // Temporäre Variable für das Letzte Element im Array
            let temp = urlArr[ctr];
            // Dem Letzten Element die zufällig ausgesuchte Stelle geben
            urlArr[ctr] = urlArr[index];
            // Das Element von der zufälligen Stelle wird ans Ende des Arrays geschoben
            urlArr[index] = temp;
        }
        memoryContainer = document.querySelector(".memory-container");
        //sucht element mit der Klasse memory-container
        let totalIndex = 0;
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            let newRow = document.createElement("div");
            newRow.setAttribute("class", "row");
            for (let elementIndex = 0; elementIndex < width / 2; elementIndex++) {
                generateElement(totalIndex, maxTotalIndex, newRow);
                generateElement(totalIndex, maxTotalIndex, newRow);
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
            let currentRow = memoryContainer.children[rowIndex];
            for (let rowIndex = 0; rowIndex < memoryContainer.childElementCount; rowIndex++) {
                let currentElement = currentRow.children[rowIndex];
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
        let firstGrid = memoryContainer.children[firstGridIndex];
        let firstChild = firstGrid.children[firstElementIndex];
        let secondGrid = memoryContainer.children[secondGridIndex];
        let secondChild = secondGrid.children[secondElementIndex];
        let firstChildHue = +firstChild.getAttribute("hue");
        let secondChildHue = +secondChild.getAttribute("hue");
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
    function getHSLString(_hue) {
        return `hsl(${_hue}, 100%, 50%)`;
    }
    function generateElement(_totalIndex, _maxTotalIndex, _newRow) {
        let newElement = document.createElement("div");
        newElement.setAttribute("class", "memory-element");
        let factor = (_totalIndex * 2) / _maxTotalIndex;
        let hue = factor * 360;
        newElement.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
        newElement.setAttribute("hue", `${hue}`);
        _newRow.appendChild(newElement);
        newElement.addEventListener("click", onButtonClick.bind(newElement));
    }
    async function onButtonClick(_event) {
        console.log(this.style.backgroundColor);
        if (this.style.backgroundColor != "gray") {
            console.log("hallomeinpenis");
            return;
        }
        if (firstUncovered == null && secondUncovered == null) {
            firstUncovered = this;
        }
        else if (secondUncovered == null) {
            secondUncovered = this;
            if (zeitvergleich.length == 14) {
                let spielername = prompt("Deine Zeit: " + Zeit + "Sekunden" + "\nTrage deinen Namen + Kontonummer ein: ");
                let response = await fetch(url + "?" + "saveHighscore=yes&" + Zeit);
                // alert(Zeit);
            }
        }
        else {
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
})(Memory || (Memory = {}));
//# sourceMappingURL=MemoryLogic.js.map