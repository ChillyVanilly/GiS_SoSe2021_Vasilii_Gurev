var Memory;
(function (Memory) {
    window.addEventListener("load", init);
    //width darf nicht ungerade sein. Man müsste dafür zusätzlichen code schreiben, der das überschüssige Element in eine neuee Zeile schreibt
    var width = 10;
    var height = 10;
    var maxTotalIndex = width * height;
    var memoryContainer;
    var maxShuffleAmount = 100;
    var shuffleAmount = 0;
    var maxFramesShowSolution = 200;
    var framesSinceSolutionShow = 0;
    var covered;
    var firstUncovered;
    var secondUncovered;
    function init(_event) {
        memoryContainer = document.querySelector(".memory-container");
        var totalIndex = 0;
        for (var rowIndex = 0; rowIndex < height; rowIndex++) {
            var newRow = document.createElement("div");
            newRow.setAttribute("class", "row");
            for (var elementIndex = 0; elementIndex < width / 2; elementIndex++) {
                generateElement(totalIndex, maxTotalIndex, newRow);
                generateElement(totalIndex, maxTotalIndex, newRow);
                totalIndex++;
            }
            memoryContainer.appendChild(newRow);
        }
        animate();
    }
    function animate() {
        if (!covered) {
            handleShuffle();
        }
        requestAnimationFrame(animate);
    }
    function cover() {
        for (var rowIndex = 0; rowIndex < memoryContainer.childElementCount; rowIndex++) {
            var currentRow = memoryContainer.children[rowIndex];
            for (var rowIndex_1 = 0; rowIndex_1 < memoryContainer.childElementCount; rowIndex_1++) {
                var currentElement = currentRow.children[rowIndex_1];
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
        var randomFirstIndex = Math.floor(Math.random() * maxTotalIndex);
        var randomSecondIndex = Math.floor(Math.random() * maxTotalIndex);
        var firstElementIndex = randomFirstIndex % width;
        var firstGridIndex = Math.floor(randomFirstIndex / width);
        var secondElementIndex = randomSecondIndex % width;
        var secondGridIndex = Math.floor(randomSecondIndex / width);
        var firstGrid = memoryContainer.children[firstGridIndex];
        var firstChild = firstGrid.children[firstElementIndex];
        var secondGrid = memoryContainer.children[secondGridIndex];
        var secondChild = secondGrid.children[secondElementIndex];
        var firstChildHue = +firstChild.getAttribute("hue");
        var secondChildHue = +secondChild.getAttribute("hue");
        firstChild.style.backgroundColor = getHSLString(secondChildHue);
        firstChild.setAttribute("hue", "" + secondChildHue);
        secondChild.style.backgroundColor = getHSLString(firstChildHue);
        secondChild.setAttribute("hue", "" + firstChildHue);
    }
    function getHSLString(_hue) {
        return "hsl(" + _hue + ", 100%, 50%)";
    }
    function generateElement(_totalIndex, _maxTotalIndex, _newRow) {
        var newElement = document.createElement("div");
        newElement.setAttribute("class", "memory-element");
        var factor = (_totalIndex * 2) / _maxTotalIndex;
        var hue = factor * 360;
        newElement.style.backgroundColor = "hsl(" + hue + ", 100%, 50%)";
        newElement.setAttribute("hue", "" + hue);
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
        this.style.backgroundColor = "hsl(" + this.getAttribute("hue") + ", 100%, 50%)";
    }
})(Memory || (Memory = {}));
//# sourceMappingURL=MemoryLogic.js.map