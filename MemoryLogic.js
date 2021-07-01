var Memory;
(function (Memory) {
    window.addEventListener("load", init);
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
    async function connectdatabase() {
        let response = await fetch(url + "?" + "getOrder=yes");
        let responseText = await response.text();
        let pretty = responseText.replace(/\\|"url\":\|/g, "");
        var matches = responseText.match(/\bhttps?:\/\/\S+/gi);
        let linesbeauty = pretty.split('","');
        console.log(matches);
    }
    function init(_event) {
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
        connectdatabase();
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
        secondChild.style.backgroundColor = getHSLString(firstChildHue);
        secondChild.setAttribute("hue", `${firstChildHue}`);
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
    function onButtonClick(_event) {
        console.log(this.style.backgroundColor);
        if (this.style.backgroundColor != "gray") {
            return;
        }
        if (firstUncovered == null && secondUncovered == null) {
            firstUncovered = this;
        }
        else if (secondUncovered == null) {
            secondUncovered = this;
        }
        else {
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
})(Memory || (Memory = {}));
//# sourceMappingURL=MemoryLogic.js.map