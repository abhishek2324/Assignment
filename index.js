// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks"));
if (tasks === null) {
    tasks = [];
}

let currentFilter = "all";

// Load tasks on page load
window.onload = function () {
    displayTasks();
};

// Add new task
function addItem() {
    let input = document.getElementById("txt");
    let text = input.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    let task = {
        id: Date.now(),
        text: text,
        completed: false,
        editing: false
    };

    tasks.push(task);
    saveTasks();
    input.value = "";
    displayTasks();
}

// Display tasks
function displayTasks() {
    let list = document.getElementById("itemList");
    list.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {

        if (currentFilter === "active" && tasks[i].completed) continue;
        if (currentFilter === "completed" && !tasks[i].completed) continue;

        let li = document.createElement("li");
        li.className = "task-item";

        let leftDiv = document.createElement("div");
        leftDiv.className = "left";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tasks[i].completed;
        checkbox.onclick = function () {
            toggleTask(tasks[i].id);
        };

        leftDiv.appendChild(checkbox);

        if (tasks[i].editing) {
            let editInput = document.createElement("input");
            editInput.value = tasks[i].text;
            editInput.className = "edit-input";

            editInput.onblur = function () {
                saveEdit(tasks[i].id, editInput.value);
            };

            leftDiv.appendChild(editInput);
        } else {
            let span = document.createElement("span");
            span.innerText = tasks[i].text;

            if (tasks[i].completed) {
                span.className = "completed";
            }

            leftDiv.appendChild(span);
        }

        let actions = document.createElement("div");

        let editBtn = document.createElement("button");
        editBtn.innerText = tasks[i].editing ? "Save" : "Edit";
        editBtn.onclick = function () {
            enableEdit(tasks[i].id);
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = function () {
            deleteTask(tasks[i].id);
        };

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(leftDiv);
        li.appendChild(actions);
        list.appendChild(li);
    }
}

// Toggle complete
function toggleTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }
    saveTasks();
    displayTasks();
}

// Enable edit mode
function enableEdit(id) {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].editing = tasks[i].id === id;
    }
    displayTasks();
}

// Save edited task
function saveEdit(id, newText) {
    if (newText.trim() === "") return;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].text = newText;
            tasks[i].editing = false;
            break;
        }
    }
    saveTasks();
    displayTasks();
}

// Delete task
function deleteTask(id) {
    let newTasks = [];

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== id) {
            newTasks.push(tasks[i]);
        }
    }

    tasks = newTasks;
    saveTasks();
    displayTasks();
}

// Filter tasks
function filterTasks(type) {
    currentFilter = type;
    displayTasks();
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
