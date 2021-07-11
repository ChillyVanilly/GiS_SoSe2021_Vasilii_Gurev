window.addEventListener("load", onLoadAdmin);

const urlAdmin: string = "https://vasilii-server.herokuapp.com/"

async function onLoadAdmin() {
  let pictures = await getPictures();

  let container = document.getElementById("grid-container");

  if (!container) {
    alert("Kein Container gefunden");
    return;
  }

  for (let i = 0; i < pictures.length; i++) {
    if (pictures[i].url == null) {
      continue;
    }

    let newElem = document.createElement("div");

    newElem.classList.add("grid-item");
    newElem.style.backgroundImage = "url(" + pictures[i].url + ")";

    let inputElem = document.createElement("input");

    inputElem.value = pictures[i].url;

    let binElem = document.createElement("div");

    binElem.classList.add("grid-item", "delete");

    // trash icon
    binElem.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/tatice/just-bins/16/bin-black-full-icon.png')";

    newElem.appendChild(inputElem);

    binElem.addEventListener("click", () => deleteImage(pictures[i]._id));

    newElem.appendChild(binElem);

    container.appendChild(newElem);
  }
}

async function getPictures() {
  let response: Response = await fetch(urlAdmin + "?" + "getOrder=yes");
  let urls: Bilder[] = await response.json();

  return urls;
}

async function addImage() {
  let input = <HTMLInputElement>document.getElementById("inputNewImage");

  let value = input.value;

  let res = await fetch(urlAdmin + "?" + "addPicture", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(value),
  });

  const text = await res.text();

  alert(text);

  window.location.reload();
}

async function deleteImage(id: string) {
  let pictures = await getPictures();

  let found = pictures.find((e) => e._id === id);

  if (found == null) {
    alert("Unerwarteter Fehler beim Löschen.");
    return;
  }

  console.log(found);

  let res = await fetch(urlAdmin + "?" + "deletePicture", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(found._id),
  });

  const text = await res.text();

  alert(text);

  window.location.reload();
}
