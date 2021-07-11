"use strict";
window.addEventListener("load", onLoad);
const urlEnterScore = "https://vasilii-server.herokuapp.com/";
function onLoad() {
    let elem = document.getElementById("scoreValue");
    if (elem == null) {
        return;
    }
    let Zeit = localStorage.getItem("memoryGameTime");
    elem.innerHTML =
        "Deine Zeit beträgt " + (Zeit ? Zeit : "Keine Zeit") + " Sekunden";
}
async function saveScore() {
    let name = document.getElementById("nameInput");
    if (!name) {
        alert("Bitte einen gültigen Namen eingeben!");
        return;
    }
    let Zeit = localStorage.getItem("memoryGameTime");
    if (Zeit == null) {
        alert("Aufgrund mangelender Daten, kann man deinen Highscore momentan nicht speichern!");
        return;
    }
    await fetch(urlEnterScore + "?" + "saveHighscore=yes", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: JSON.stringify({ name: name.value, score: parseInt(Zeit) }),
    });
    let timeout = setTimeout(() => {
        // redirect
        window.location.href = window.location.href.replace("enterScore.html", "score.html");
        clearTimeout(timeout);
    }, 500);
}
//# sourceMappingURL=MemoryEnterScore.js.map