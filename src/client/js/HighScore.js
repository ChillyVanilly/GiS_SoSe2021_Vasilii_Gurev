"use strict";
const url = "http://127.0.0.1:5001/";
window.addEventListener("load", onStart);
async function onStart() {
    // init highscore
    let highScore = await getHighScore();
    let ol = document.getElementById("highscores");
    if (ol == null) {
        alert("highscore element nicht gefunden!");
        return;
    }
    for (let i = 0; i < highScore.length; i++) {
        let elem = document.createElement("li");
        let text = document.createTextNode(highScore[i].name + " - " + highScore[i].score);
        elem.appendChild(text);
        ol.appendChild(elem);
    }
}
async function getHighScore() {
    let response = await fetch(url + "?" + "getHighScore");
    let data = await response.json();
    console.log(data);
    return data;
}
function backToGame() {
    window.location.href = window.location.href.replace("score.html", "index.html");
}
//# sourceMappingURL=HighScore.js.map