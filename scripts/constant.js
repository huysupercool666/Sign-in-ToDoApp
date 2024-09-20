const specialCharacter = /[^a-zA-Z0-9]/;
const statusCondition = {
    done: "done",
    unDone: "undone"
};

const buttonAdd = document.getElementById("add-button");
const buttonCancel = document.getElementById("cancel-button");
const filterCondition = document.getElementById("filter");
const greeting = document.getElementById("greeting");