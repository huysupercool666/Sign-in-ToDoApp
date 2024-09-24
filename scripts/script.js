function tasks() {
  this.taskList = [];
}

tasks.prototype.addTask = function () {
  const taskName = document.getElementById("input-value").value.trim();
  const currentUser = JSON.parse(sessionStorage.getItem("current-user")) || JSON.parse(localStorage.getItem("remembered-user"));
  
  if (currentUser && taskName !== "") {
    const filterStatus = document.getElementById("filter").value;
    const userID = currentUser.id;
    const userTasks = this.getUserTasks(userID);
    
    const idCounter = userTasks.length > 0 ? userTasks.reduce((max, task) => task.id > max ? task.id : max, 0) : 0;
    let newTask = {
      id: idCounter + 1,
      name: taskName,
      completed: filterStatus === statusCondition.undone,
    };
    userTasks.push(newTask);
    this.saveUserTasks(userID, userTasks);
    this.taskList = userTasks;
    this.cancelTask();
    this.sortTask();
    this.filterTask();
  }
};
tasks.prototype.getUserTasks = function (userID) {
  const tasksByUser = JSON.parse(localStorage.getItem("tasksByUser")) || {};
  return tasksByUser[userID] || []; 
};

tasks.prototype.saveUserTasks = function (userID, userTasks) {
  const tasksByUser = JSON.parse(localStorage.getItem("tasksByUser")) || {};
  tasksByUser[userID] = userTasks; 
  localStorage.setItem("tasksByUser", JSON.stringify(tasksByUser)); 
};

tasks.prototype.saveTasks = function () {
  const currentUser =
    JSON.parse(sessionStorage.getItem("current-user")) ||
    JSON.parse(localStorage.getItem("remembered-user"));

  if (currentUser) {
    const userID = currentUser.id;
    this.saveUserTasks(userID, this.taskList);
    this.render(this.taskList);
  }
};

tasks.prototype.loadTasks = function () {
  const currentUser =
    JSON.parse(sessionStorage.getItem("current-user")) ||
    JSON.parse(localStorage.getItem("remembered-user"));

  if (currentUser) {
    const userID = currentUser.id;
    this.taskList = this.getUserTasks(userID);    
    this.render(this.taskList); 
  }
};

tasks.prototype.render = function (listArray) {
  const taskList = document.getElementById("tasklist");
  taskList.style.listStyleType = "none";
  taskList.innerHTML = "";
  taskList.innerHTML = listArray
    .map((item) => {
      return `<li>
              <input onchange="newTaskList.toggleCompleted(${
                item.id
              })" type="checkbox" ${item.completed ? "checked" : ""}>
              <span>${item.name}</span>
              <button class="button" onclick="newTaskList.editTask(${
                item.id
              })">Edit</button>
              <button class="button" onclick="newTaskList.deleteTask(${
                item.id
              })">Delete</button>
            </li>`;
    })
    .join("");
};


tasks.prototype.cancelTask = function () {
  document.getElementById("input-value").value = "";
};

tasks.prototype.deleteTask = function (id) {
  const currentUser = JSON.parse(sessionStorage.getItem("current-user")) || JSON.parse(localStorage.getItem("remembered-user"));
  
  if (currentUser) {
    const userID = currentUser.id;
    let userTasks = this.getUserTasks(userID);
    userTasks = userTasks.filter((item) => item.id !== id);
    this.saveUserTasks(userID, userTasks);
    this.taskList = userTasks;
    this.render(this.taskList);
  }
};

tasks.prototype.editTask = function (id) {
  const task = this.taskList.find((task) => task.id === id);
  const newTaskName = prompt("Change your task here", task.name);
  if (newTaskName !== null && newTaskName.trim() !== "") {
    task.name = newTaskName.trim();
    this.saveTasks();
    this.render(this.taskList);
  }
};

tasks.prototype.filterTask = function () {
  const filterStatus = document.getElementById("filter").value;
  if (filterStatus === statusCondition.done) {
    this.render(this.taskList.filter((task) => task.completed === true));
  } else if (filterStatus === statusCondition.unDone) {
    this.render(this.taskList.filter((task) => task.completed === false));
  } else {
    this.render(this.taskList);
  }
};

tasks.prototype.toggleCompleted = function (id) {
  this.taskList = this.taskList.map((item) =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  this.saveTasks();
  this.sortTask();
  this.filterTask();
};

tasks.prototype.sortTask = function () {
  this.taskList.sort(function (taskFirst, taskAfter) {
    if (taskFirst.completed != taskAfter.completed) {
      return taskFirst.completed - taskAfter.completed;
    }
    return !isNaN(taskFirst.name) && !isNaN(taskAfter.name)
      ? taskFirst.name - taskAfter.name
      : taskFirst.name.localeCompare(taskAfter.name);
  });
  this.render(this.taskList);
};

let newTaskList = new tasks();
buttonAdd.addEventListener("click", function () {
  newTaskList.addTask();
});

buttonCancel.addEventListener("click", function () {
  newTaskList.cancelTask();
});

filterCondition.addEventListener("change", function () {
  newTaskList.filterTask();
});

window.onload = function () {
  const rememberedUser = JSON.parse(localStorage.getItem("remembered-user"));
  const currentSessionUser = JSON.parse(sessionStorage.getItem("current-user"));
  const currentPage = window.location.pathname.split("/").pop();
  if (rememberedUser || currentSessionUser) {
    let newTaskList = new tasks();
    newTaskList.loadTasks();
    if (rememberedUser) {
      greeting.innerText = `Hello ${
        rememberedUser.email?.split("@")[0]
      }`;
    } else if (currentSessionUser) {
      greeting.innerText = `Hello ${
        currentSessionUser.email?.split("@")[0]
      }`;
    } else if (currentPage === "index.html" || currentPage === "") {
      window.location.href = "./login.html";
    }
  }
};
