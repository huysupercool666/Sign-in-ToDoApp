function tasks() {
  this.listTask = [];
  this.idCounter = this.listTask.length > 0 ? this.listTask.length : 0;
}

tasks.prototype.addTask = function () {
  const taskName = document.getElementById("input-value").value.trim();
  if (taskName !== "") {
    const filterStatus = document.getElementById("filter").value;
    let newTask = {
      id: ++this.idCounter,
      name: taskName,
      completed: filterStatus === statusCondition.undone,
    };
    this.listTask.push(newTask);
    this.saveTasks();
    this.cancelTask();
    this.sortTask();
    this.filterTask();
  }
};
tasks.prototype.saveTasks = function() {
  localStorage.setItem('tasklist', JSON.stringify(this.listTask));
};

tasks.prototype.render = function (listArray) {
  const taskList = document.getElementById("tasklist");
  taskList.style.listStyleType = "none";
  taskList.innerHTML = "";
  taskList.innerHTML = listArray.map((item) => {
    return `<li>
              <input onchange="newTaskList.toggleCompleted(${item.id})" type="checkbox" ${item.completed ? "checked" : ""}>
              <span>${item.name}</span>
              <button class="button" onclick="newTaskList.editTask(${item.id})">Edit</button>
              <button class="button" onclick="newTaskList.deleteTask(${item.id})">Delete</button>
            </li>`;
  }).join("");
};

tasks.prototype.cancelTask = function () {
  document.getElementById("input-value").value = "";
};

tasks.prototype.deleteTask = function (id) {
  this.listTask = this.listTask.filter(item => item.id !== id);
  this.saveTasks();
  this.render(this.listTask);
};

tasks.prototype.editTask = function (id) {
  const task = this.listTask.find((task) => task.id === id);
  const newTaskName = prompt("Change your task here", task.name);
  if (newTaskName !== null && newTaskName.trim() !== "") {
      task.name = newTaskName.trim();
      this.saveTasks();
      this.render(this.listTask);
  }
};

tasks.prototype.filterTask = function () {
  const filterStatus = document.getElementById("filter").value;
  if (filterStatus === statusCondition.done) {
    this.render(this.listTask.filter(task => task.completed === true));
  } else if (filterStatus === statusCondition.unDone) {
    this.render(this.listTask.filter(task => task.completed === false));
  } else {
    this.render(this.listTask);
  }
};

tasks.prototype.toggleCompleted = function (id) {
  this.listTask = this.listTask.map(item =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  this.saveTasks();
  this.sortTask();
  this.filterTask();
};

tasks.prototype.sortTask = function () {
  this.listTask.sort(function (taskFirst, taskAfter) {
    if (taskFirst.completed != taskAfter.completed) {
      return taskFirst.completed - taskAfter.completed;
    }
    return !isNaN(taskFirst.name) && !isNaN(taskAfter.name)
      ? taskFirst.name - taskAfter.name
      : taskFirst.name.localeCompare(taskAfter.name);
  });
  this.render(this.listTask);
};

let newTaskList = new tasks();
document.getElementById("add-button").addEventListener("click", function () {
  newTaskList.addTask();
});

document.getElementById("cancel-button").addEventListener("click", function () {
  newTaskList.cancelTask();
});

document.getElementById("filter").addEventListener("change", function () {
  newTaskList.filterTask();
});


window.onload = function () {
  const rememberedUser = JSON.parse(localStorage.getItem("remembered-user"));
  const currentSessionUser = JSON.parse(sessionStorage.getItem("current-user"));
  const currentPage = window.location.pathname.split("/").pop();
  if (rememberedUser) {
    document.getElementById("greeting").innerText = `Hello ${rememberedUser.email?.split("@")[0]}`;
  } else if (currentSessionUser) {
    document.getElementById("greeting").innerText = `Hello ${currentSessionUser.email?.split("@")[0]}`;
  } else if (currentPage === "index.html" || currentPage === "") {
    window.location.href = "./login.html";
  }
};
