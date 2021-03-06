var taskIdCounter = 0;
var tasks = [];
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var pushedArr = [1, 2, 3];

pushedArr.push(4); 
// pushedArr is now [1,2,3,4]

pushedArr.push("Taskinator"); 
// pushedArr is now [1,2,3,4,"Taskinator"]

pushedArr.push(10, "push", false); 
// pushedArr is now [1,2,3,4,"Taskinator",10,"push",false]

console.log(tasks);

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }

  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  //check if task is new or one being edited by seeing if it has a data-task-id attribute
  var isEdit = formEl.hasAttribute("data-task-id");
  
  // has data attribute, so get task id and call function to complete edit process
if (isEdit) {
  var taskId = formEl.getAttribute("data-task-id");
  completeEditTask(taskNameInput, taskTypeInput, taskId);
} else {
// no data attribute, so create object as normal and pass to createTaskEl function

  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
  };
  
  createTaskEl(taskDataObj);
 }
};

var createTaskEl = function(taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  
  tasksToDoEl.appendChild(listItemEl);
  
  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks();

  // increase task counter for next unique id
  taskIdCounter++;

  console.log(taskDataObj);
  console.log(taskDataObj.status);
};       


var createTaskActions = function(taskId) {
  
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  //create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  //create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  //status select
  var statusSelectEl = document.createElement("select");
  
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
      // create option element
      var statusOptionEl = document.createElement("option");

      
      statusOptionEl.setAttribute("value", statusChoices[i]);
      statusOptionEl.textContent = statusChoices[i];

      //append to select
      statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;

};

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// set new values
taskSelected.querySelector("h3.task-name").textContent = taskName;
taskSelected.querySelector("span.task-type").textContent = taskType;

// loop through tasks array and task object with new content
for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].id === parseInt(taskId)) {
    tasks[i].name = taskName;
    tasks[i].type = taskType;
  }

alert("Task Updated!");
saveTasks();

formEl.removeAttribute("data-task-id");
formEl.querySelector("#save-task").textContent = "Add Task";
}};


var taskButtonHandler = function(event) {
  //get target element from event
  var targetEl = event.target;
  
  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    //get the element's task id
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } else if (targetEl.matches(".delete-btn")) {
    //get the element's task id
    console.log("delete", targetEl)
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function(event) {
  console.log(event.target.value);
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");
  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

 
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update task's in tasks array
for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].id === parseInt(taskId)) {
    tasks[i].status = statusValue;
  }
}
console.log(tasks);
saveTasks();
};

var editTask = function(taskId) {
  console.log(taskId);

  //get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");


// get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;

var taskType = taskSelected.querySelector("span.task-type").textContent;
console.log(taskType);

document.querySelector("input[name='task-name']").value = taskName;
document.querySelector("select[name='task-type']").value = taskType;


formEl.setAttribute("data-task-id", taskId);
formEl.querySelector("#save-task").textContent = "Save Task";

};

var deleteTask = function(taskId) {
  console.log(taskId);
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

// loop through current tasks
for (var i = 0; i < tasks.length; i++) {
  // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
  if (tasks[i].id !== parseInt(taskId)) {
    updatedTaskArr.push(tasks[i]);
  }
}
// reassign tasks array to be the same as updatedTaskArr
tasks = updatedTaskArr;
saveTasks();
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


var loadTasks = function() {
  var savedTasks = localStorage.getItem("tasks");
  // if there are no tasks, set tasks to an empty array and return out of the function
  if (!savedTasks) {
    return false;
  }
  console.log("Saved tasks found!");
  // else, load up saved tasks

  // parse into array of objects
  savedTasks = JSON.parse(savedTasks);

  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  }
};


formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();