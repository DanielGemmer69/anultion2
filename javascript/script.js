"use strict"

window.addEventListener("load", function()
{
    let map = document.querySelector("div.mapContainer");
    map.addEventListener("click", clickEvent);
    let bookButton = document.getElementById("bookButton");
    bookButton.addEventListener("click", book);
    let removeButton = document.getElementById("removeButton");
    removeButton.addEventListener("click", remove);
    let queueButton = document.getElementById("queueButton");
    queueButton.addEventListener("click", queue);
    let popUpContainer = document.getElementById("popUpContainer");
    popUpContainer.addEventListener("click", clearScreen);
});

let tableBookings = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
let table = null;
let index = null;

function clickEvent(event) //när någon har klickat på en knapp
{
    if(event.target.tagName === "ARTICLE")
    {
        index = event.target.getAttribute("id");
        table = event.target;
        if(tableBookings[index] === "")
            bookTable();
        else
            showTable();
    }
}

function book()
{
    let nameInput = document.getElementById("name");
    if (nameInput.value !== "")
    {
      tableBookings[index] = nameInput.value;
      table.style.backgroundColor = "rgb(198, 57, 69)";
      addToTable.style.display = "none";
      clearError();
      clearPanel();
      index = null;
      table = null;
    }else
    {
      setError("Du måste mata in ett namn först");
    }
}

function queueBook(event)
{
    if(table !== null && tableBookings[index] === "") //bordet måste vara tomt
    {
        tableBookings[index] = event.currentTarget.textContent;
        table.style.backgroundColor = "rgb(198, 57, 69)";
        addToTable.style.display = "none";
        clearError();
        clearPanel();
        event.currentTarget.removeEventListener("click", queueBook);
        event.currentTarget.remove();
        queueEmptyCheck();
    }else if(table === null)
    {
        queueError("Du måste välja ett bord först");
    }else
    {
        queueError("Du måste avboka bordet först");
    }
}

function remove()
{
    tableBookings[index] = "";
    table.style.backgroundColor = "rgb(65, 96, 199)";
    let showTable = document.getElementById("showTable");
    showTable.style.display = "none";
    index = null;
    table = null;
    clearError();
    clearPanel();
}

function queue()
{
    let nameInput = document.getElementById("queueInput");
    let InputNum = document.getElementById("queueInputNum");
    let queue = document.getElementById("queue");

    if (nameInput.value !== "")
    {
        let queueEmpty = document.getElementById("queueEmpty");
        queueEmpty.style.display = "none";
        let buttonContainer = document.createElement("div");
        buttonContainer.addEventListener("click", removeFromQueue);
        buttonContainer.classList.add("buttonContainer");
        let trashImage = document.createElement("img");
        trashImage.src = "source/delete.png";
        trashImage.classList.add("trashIcon");
        let button = document.createElement("button");
        button.classList.add("queueButton");
        let numInput = document.getElementById("queueInputNum");
        button.textContent = nameInput.value;
        buttonContainer.textContent = "Antal gäster: " + numInput.value;
        buttonContainer.style.textShadow = "none";
        buttonContainer.append(button);
        buttonContainer.append(trashImage);
        queue.append(buttonContainer);
        clearError();
        nameInput.value = "";
        InputNum.value = "";
        button.addEventListener("click", queueBook);
        
    }else
    {
        queueError("Du måste mata in ett namn först")
    }
}

function removeFromQueue(event)
{
    let trashIcons = document.querySelectorAll(".trashIcon");

    for(let i = 0; i < trashIcons.length; i++)
        if(event.target === trashIcons[i]) //om event.target finns i DOMen
        {
            let itemToRemove = event.currentTarget;
            clearPanel();
            let popup = document.getElementById("popUpContainer");
            popup.style.display = "flex";
            let removeQueue = document.getElementById("removeQueue");
            removeQueue.style.display = "flex";
            let removeQueueButton = document.getElementById("removeQueueButton");
            removeQueueButton.addEventListener("click", function ()
            {
                itemToRemove.remove();
                table = null;
                index = null;
                clearPanel();
            });
        }
}

function queueEmptyCheck()
{
    let queueButton = document.querySelector(".queueButton");
    let queueEmpty = document.getElementById("queueEmpty");
    if(queueButton !== null) //om det finns knappar
    {
        queueEmpty.style.display = "none";
    }else
    {
        queueEmpty.style.display = "block";
    }
}

function clearScreen(event)
{
    let popUpContainer = document.getElementById('popUpContainer');

    if (event.target === popUpContainer)
    {
        table = null;
        index = null;
        clearPanel();
    } 
}

function bookTable()
{
    clearPanel();
    let popup = document.getElementById("popUpContainer");
    popup.style.display = "flex";
    let addToTable = document.getElementById("addToTable");
    addToTable.style.display = "flex";
    drawPreview(addToTable);
}

function showTable()
{
    clearPanel();
    let popup = document.getElementById("popUpContainer");
    popup.style.display = "flex";
    let showTable = document.getElementById("showTable");
    showTable.style.display = "flex";
    drawPreview(showTable);
    let nameDisplay = document.getElementById("bookingName");
    nameDisplay.textContent = tableBookings[index];
}

function setError(message)
{
    let errorCont = document.getElementById("error");
    errorCont.style.display = "block";
    errorCont.textContent = message;
}

function queueError(message)
{
    let errorCont = document.getElementById("queueError");
    errorCont.style.display = "block";
    errorCont.textContent = message;
}

function clearError()
{
    setError("");
    queueError("");
}

function clearPanel()
{
    let popup = document.getElementById("popUpContainer");
    popup.style.display = "none";
    let showTable = document.getElementById("showTable");
    showTable.style.display = "none";
    let removeQueue = document.getElementById("removeQueue");
    removeQueue.style.display = "none";
    let addToTable = document.getElementById("addToTable");
    let input = document.getElementById("name");
    input.value = "";
    addToTable.style.display = "none";
    let tablePreview = document.getElementById("temp");
    if(tablePreview !== null)
        tablePreview.remove();
}

function drawPreview(parent)
{
    let elementExists = document.getElementById("temp");
    if(elementExists === null)
    {
        let tablePreview = table.cloneNode(true); //skapar en kopia av elementet som visas upp i data-spalten
        tablePreview.id = "temp"; //tar bort id:t för att den inte ska positionera sig på kartan
        tablePreview.style.position = "static";
        parent.prepend(tablePreview);
    }
}