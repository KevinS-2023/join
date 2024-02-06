import * as API from '../../scripts/API_functions.js';
import * as selected from '../scripts/task.selector.js';
import Task from "../../classes/tasks.class.js";

const taskstodo = document.querySelector('.taskstodo');
const tasksinprogress = document.querySelector('.tasksinprogress');
const tasksawaitfeedback = document.querySelector('.tasksawaitfeedback');
const tasksdone = document.querySelector('.tasksdone');
const tasksshowof = document.querySelectorAll('.tasksshowof');
const searchtaskinput = document.querySelector('.searchtaskinput');
let iframeDocument = document.querySelector('.iframeTaskFormular').contentWindow.document;
let actualTask;

let taskinboard;
let contactelement;

let tasks;
let contacts;

let stateupbuttons;
let statedownbuttons;

let addedtasks = 0;

const classes = new Set(['taskstodo', 'tasksinprogress', 'tasksawaitfeedback', 'tasksdone']);

const classesobj = {
    'taskstodo': 'TODO',
    'tasksinprogress': 'IN-PROGRESS',
    'tasksawaitfeedback': 'AWAIT-FEEDBACK',
    'tasksdone': 'DONE'
};

getTasks();

// Set the button events of the full size task 
setFullsizeTaskButtonEvents();

tasksshowof.forEach((element) => {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    element.addEventListener('drop', async (e) => {
        const data = e.dataTransfer.getData('text/plain');
        let state = getNewState(e.target);
        changeTaskState(data, state);
        listTasksInBoard(tasks);
        API.setTasks(tasks);
    });
});

async function getTasks() {
    tasks = await API.getTasks();
    await getContacts();
    listTasksInBoard(tasks);
}

function clearBoard() {
    taskstodo.innerHTML = '';
    tasksinprogress.innerHTML = '';
    tasksawaitfeedback.innerHTML = '';
    tasksdone.innerHTML = '';
}

async function getContacts() {
    contacts = await API.getContacts();
}

function getContactsTask(task, tasksindex) {
    contactelement = document.querySelector(`.contactelements${task.taskid}`);
    addedtasks = 0;
    for (let contactid of task.assingto) {
        for (let contact of contacts) {
            checkAmountofcontacts(task, contact, contactid, tasksindex);
            if (addedtasks == 4) {
                break;
            }
        }
    }
}

function checkAmountofcontacts(task, contact, contactid, tasksindex) {
    if (contact.id == contactid && addedtasks < 3) {
        addedtasks++;
        contactelement.innerHTML += createContactElement(contact);
    } else if (addedtasks == 3 && task.assingto.length > 3) {
        addedtasks++;
        contactelement.innerHTML += showRestofContacts(task.assingto.length - 3);
        return;
    }
}

function createContactElement(contact) {
    return /*html*/ `
    <div class="showeduser" id="${contact.id}">
        ${contact.initials} <img src="../../assets/ellipse_users.svg" alt="" class="showeduserring ${contact.color}">
    </div>
    `;
}

function showRestofContacts(amount) {
    return /*html*/ `
    <div class="showeduser">
        +${amount} <img src="../../assets/ellipse_users.svg" alt="" class="showeduserring amountofrestcontacts">
    </div>
    `;
}

function setDragEvent() {
    taskinboard = document.querySelectorAll('.taskinboard');
    taskinboard.forEach((task) => {
        task.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            dragTaskstyle(task)
        });
    });
}

function listTasksInBoard(tasks) {
    clearBoard();
    tasks.forEach((task, index) => {
        sortTasks(task);
        getContactsTask(task, index);
        changeColorAtCategorie(task);
        setChangeButtonDisplay(task);
        checkForSubtasks(task);
    });
    changePlaceholderVisibility();
    setTaskClickEvent();
    setDragEvent();
    changeState();
}

function checkForSubtasks(task) {
    if (task.subtasks == "") {
        document.getElementById(`${task.taskid}progress`).style.display = 'none';
    }
}

function setChangeButtonDisplay(task) {
    if (task.state == 'TODO') {
        document.getElementById(`${task.taskid}up`).style.display = 'none';
    } else if (task.state == 'DONE') {
        document.getElementById(`${task.taskid}down`).style.display = 'none';
    }
}

function changeState() {
    stateupbuttons = document.querySelectorAll('.state-up');
    stateupbuttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            let done = false;
            let taskid = e.target.parentNode.parentNode.id;
            tasks.forEach((task) => {
                let newstate;
                if (task.taskid == taskid && !done) {
                    done = true;
                    if (task.state == 'TODO') {
                        return;
                    } else if (task.state == 'IN-PROGRESS') {
                        newstate = 'TODO';
                    } else if (task.state == 'AWAIT-FEEDBACK') {
                        newstate = 'IN-PROGRESS';
                    } else if (task.state == 'DONE') {
                        newstate = 'AWAIT-FEEDBACK';
                    }
                    task.state = newstate;
                    changeTaskPosition(task);
                    listTasksInBoard(tasks);
                    API.setTasks(tasks);
                }
            });
        });
    });
    statedownbuttons = document.querySelectorAll('.state-down');
    statedownbuttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            let done = false;
            let taskid = e.target.parentNode.parentNode.id;
            tasks.forEach((task) => {
                let newstate;
                if (task.taskid == taskid && !done) {
                    done = true;
                    if (task.state == 'TODO') {
                        newstate = 'IN-PROGRESS';
                    } else if (task.state == 'IN-PROGRESS') {
                        newstate = 'AWAIT-FEEDBACK';
                    } else if (task.state == 'AWAIT-FEEDBACK') {
                        newstate = 'DONE';
                    } else if (task.state == 'DONE') {
                        return;
                    }
                    task.state = newstate;
                    changeTaskPosition(task);
                    listTasksInBoard(tasks);
                    API.setTasks(tasks);
                }
            });
        });
    });
}

function sortTasks(task) {
    switch (task.state) {
        case 'IN-PROGRESS':
            tasksinprogress.innerHTML += returnListedTask(task);
            break;
        case 'AWAIT-FEEDBACK':
            tasksawaitfeedback.innerHTML += returnListedTask(task);
            break;
        case 'DONE':
            tasksdone.innerHTML += returnListedTask(task);
            break;
        case 'TODO':
            taskstodo.innerHTML += returnListedTask(task);
            break;
    }
}

function changeColorAtCategorie(task) {
    if (task.categorie == 'Technical Task') {
        document.getElementById(`${task.taskid}category`).classList.add('technicaltask');
    }
}

function getUndoneSubtasks(task) {
    let amount = 0;
    for (let value of task.suntasksdone) {
        if (value) { amount++; }
    }
    return amount;
}

function returnListedTask(task) { //task-
    return /*html*/ `
    <div class="taskinboard" id="${task.taskid}" draggable="true"> 
        <div class="taskcategory noevents" id="${task.taskid}category">${task.categorie}</div>
        <div class="change-state-container">
            <button class="state-up" id="${task.taskid}up">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                    <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
                </svg>
            </button>
            <button class="state-down" id="${task.taskid}down">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                    <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
            </button>
        </div>
        <h1 class="tasktitle noevents">${task.title}</h1>
        <div class="taskdescription noevents">${task.description}</div>
        <div class="subtaskprogress noevents" id="${task.taskid}progress">
            <div class="progresscontainer">
                <div class="progress" style="width: ${getUndoneSubtasks(task) / task.subtasks.length * 100}%"></div>
            </div>
            <div class="amountofsubtasks">${getUndoneSubtasks(task)}/${task.subtasks.length} Subtasks</div>
        </div>
        <div class="contacsandprio noevents">
            <div class="contactelements contactelements${task.taskid}"></div>
            <div class="prio" style="background-image: url(../../assets/${task.priority}.svg)"></div>
        </div>
    </div>`;
}

function getNewState(target) {
    if (classes.has(target.classList[1])) {
        return convertToState(String(target.classList[1]));
    } else if (classes.has(target.parentNode.classList[1])) {
        return convertToState(String(target.parentNode.classList[1]));
    }
}

function convertToState(targetclass) {
    return classesobj[targetclass];
}

function changeTaskState(taskid, newstate) {
    for (let task of tasks) {
        if (task.taskid == taskid) {
            task.state = newstate;
            standartTaskstyle(task);
            changeTaskPosition(task);
            break;
        }
    }
}

function standartTaskstyle(task) {
    task.style = "rotate: 0deg;  position: auto";
}

function dragTaskstyle(task) {
    task.style = "rotate: 10deg; opacity: 0.3";
}

function changeTaskPosition(task) {
    let tasksave = task;
    tasks.splice(tasks.indexOf(task), 1);
    tasks.push(tasksave);
}

function changePlaceholder(element, action) {
    if (element.innerHTML == '') {
        action(element);
    }
}

function changePlaceholderVisibility() {
    changePlaceholder(taskstodo, setToDoPlaceholder);
    changePlaceholder(tasksinprogress, setProgressPlaceholder);
    changePlaceholder(tasksawaitfeedback, setAwaitPlaceholder);
    changePlaceholder(tasksdone, setDonePlaceholder);
}

function setToDoPlaceholder(element) {
    element.innerHTML = `
        <div class="placeholder todoplaceholder">No task To do</div>
    `;
}

function setProgressPlaceholder(element) {
    element.innerHTML = `
        <div class="placeholder progressplaceholder">No task In progress</div>
    `;
}

function setAwaitPlaceholder(element) {
    element.innerHTML = `
        <div class="placeholder awaitplaceholder">No task Await feedback</div>
    `;
}

function setDonePlaceholder(element) {
    element.innerHTML = `
        <div class="placeholder doneplaceholder">No task Done</div>
    `;
}

searchtaskinput.addEventListener(('input'), () => { searchTask() });

function searchTask() {
    let searchvalue = searchtaskinput.value.toLowerCase();
    let searchedtasks = [];
    if (searchvalue == '') {
        listTasksInBoard(tasks);
        return;
    } else {
        for (let task of tasks) {
            if (checkSearchInput(task, searchvalue)) {
                searchedtasks.push(task);
            }
        }
        listTasksInBoard(searchedtasks);
    }
}

function checkSearchInput(task, searchvalue) {
    if (task.title.toLowerCase().includes(searchvalue)) {
        return true;
    } else if (task.description != undefined && task.description.toLowerCase().includes(searchvalue)) {
        return true;
    } else if (task.categorie.toLowerCase().includes(searchvalue)) {
        return true;
    }
}

// open full size task ------------------------------------------------------------------------------------
function openTask(id) {
    actualTask = tasks[returnArrayIndex(tasks, 'taskid', id)];
    const CONTAINER = document.querySelector('.fullsizeTask');
    document.querySelector('.fullSizeTaskCategorie').classList.remove('variant11', 'variant6');
    setFullSizeTaskValues();
    //document.querySelector('.boardcontainer').style.height = CONTAINER.offsetHeight + 'px'; // Bull
    translateContainer(CONTAINER);
}

// full size task values ------------------
function setFullSizeTaskValues() {
    document.querySelector('.fullSizeTaskCategorie').innerHTML = actualTask.categorie;
    document.querySelector('.fullSizeTaskCategorie').classList.add(returnTaskCategorieColor(actualTask.categorie));
    document.querySelector('.fullSizeTitel').innerHTML = actualTask.title;
    document.querySelector('.fullSizeDescription').innerHTML = actualTask.description;
    document.querySelector('.fullSizeDate').innerHTML = actualTask.date;
    setPriority();
    setFullSizeAssignedTo();
    // subtasks
    const ELEMENT = document.querySelector('.fullSizeSubTasksContainer');
    setSubTasks(ELEMENT);
}

// Priority --------------------------------
function setPriority() {
    document.querySelector('.fullSizePriotity').innerHTML = ` 
    <p>${actualTask.priority}</p>
    <img src="../../assets/${actualTask.priority}.svg" alt="">`;
}

// Assgigned contacts -----------------------
function setFullSizeAssignedTo() {
    const DIV = document.querySelector('.fullSizeAssignedContacts');
    DIV.innerHTML = '';
    actualTask.assingto.forEach((index) => {
        let contactIndex = returnArrayIndex(contacts, 'id', index);
        DIV.innerHTML += `
        <div class="asignedContainer">
            <div class="showeduser">
                ${contacts[contactIndex].initials} <img src="../../assets/ellipse_users.svg" alt="" class="showeduserring ${contacts[contactIndex].color}">
            </div>
            <p>${contacts[contactIndex].name}</p>
        </div>
        `;
    })
}

// subtasks ---------------------------------
function setSubTasks(addToElement) {
    addToElement.innerHTML = '';
    actualTask.subtasks.forEach((sub, index) => {
        addToElement.innerHTML += `
        <div class="flexNC fullSizeSubTask" id="fullSizeSubTask-${index}">
            <img src="${getSubtaskImgCheckbox(index)}" alt="" id=subTaskImg-${index} >
            <p>${sub}</p>
        </div>
        `;
        setTimeout(() => {
            setEventsOnDynamicElements(`fullSizeSubTask-`, index);
        }, 20)

    })
}

function setEventsOnDynamicElements(element, index) {
    const dynamicElement = document.getElementById(element + index);
    if (dynamicElement) {
        dynamicElement.addEventListener('click', () => { editSubtaskDone(index) })
    } else {
        // check again after the timer run out
        setTimeout(function () {
            setEventsOnDynamicElements(element, index);
        }, 500);
    }
}

function getSubtaskImgCheckbox(index) {
    if (actualTask.suntasksdone[index]) { return '../../assets/checkbox_checked.svg'; }
    else { return '../../assets/checkbox_unchecked.svg'; }
}

// task categorie color class ---------------
function returnTaskCategorieColor(categorie) {
    if (categorie == 'Technical Task') { return 'variant6'; }
    else { return 'variant11'; }
}

// set events -------------------------------
function setTaskClickEvent() {
    const DYNAMIC_ELEMENT = document.querySelectorAll('.taskinboard');

    DYNAMIC_ELEMENT.forEach(function (element) {
        element.addEventListener("click", function (event) {
            if (event.target.classList.contains('state-up') || event.target.classList.contains('state-down') || event.target.classList.contains('change-state-container')) { return; }
            openTask(element.id);
        });
    });
    document.querySelector('.addtaskbtn').addEventListener('click', () => { openAddTaskFormular() })
}

function setFullsizeTaskButtonEvents() {
    document.querySelector('.closeFullSizeTask').addEventListener('click', () => { translateContainerBack('.fullsizeTask') });
    document.querySelector('.deleteButton').addEventListener('click', () => { deleteTask(actualTask) });
    document.querySelector('.editButton').addEventListener('click', () => { openTaskFormularEdit() });
}

// change the status of the subtasks
function editSubtaskDone(index) {
    const ELEMENT = document.getElementById(`subTaskImg-${index}`);
    const INDEX = returnArrayIndex(tasks, 'taskid', actualTask.taskid);

    if (actualTask.suntasksdone[index]) {
        ELEMENT.src = '../../assets/checkbox_unchecked.svg';
        tasks[INDEX].suntasksdone[index] = false;
        ELEMENT.style.margin = '0px';
    }
    else {
        ELEMENT.src = '../../assets/checkbox_checked.svg';
        tasks[INDEX].suntasksdone[index] = true;
        ELEMENT.style.margin = '0px 3px 0px 3px';
    }
    API.setTasks(tasks);
    listTasksInBoard(tasks);
}

// edit task ---------------------------------------------------------------------------------------------------------
function openTaskFormularEdit() {
    const ELEMENT = document.querySelector('.iframeTaskFormular');
    // load the HTML document in the Iframe new
    ELEMENT.src = ELEMENT.src;
    const CONTAINER = document.querySelector('.iframeTaskFormular');
    setTimeout(() => {
        iframeDocument = document.querySelector('.iframeTaskFormular').contentWindow.document;
        translateContainerBack('.fullsizeTask');
        // const CONTAINER = document.querySelector('.iframeTaskFormular');
        setTaskFormularToEdit();
        translateContainer(CONTAINER);
    }, 600)
    document.querySelector('.boardcontainer').style.height = CONTAINER.offsetHeight + 'px';

}

function setTaskFormularToEdit() {
    // set the values in the input fields of the Task Formular
    setInputValues();
    // set the assigned contacts iof the Task formular
    setAssignedContactsEditForm(actualTask.assingto);
    // click on the prio Button in the Task formular
    iframeDocument.querySelector(`.priobutton[name="${actualTask.priority}button"]`).click();
    // the categorie can't change in the edit task formular
    iframeDocument.querySelector('.undercontainerCategory').style.display = 'none';
    //close button
    iframeCloseButton();
    // set the Subtasks of the edit Task Formular 
    setSubtasksEditForm();
    // clone the Task formular Buttons and set new Events
    changeButtons();
}

function deleteTask(actualTask) {
    let index = tasks.indexOf(actualTask);
    if (index !== -1) {
        tasks.splice(index, 1);
        listTasksInBoard(tasks);
        API.setTasks(tasks);
    }
    translateContainerBack('.fullsizeTask')
}

function iframeCloseButton() {
    const CLOSE_BUTTON = iframeDocument.querySelector('.closeImg');
    CLOSE_BUTTON.style.display = 'block';
    CLOSE_BUTTON.addEventListener('click', () => { translateContainerBack('.iframeTaskFormular') })
}

// set the input values from task ----------
function setInputValues() {
    iframeDocument.querySelector('.header').innerHTML = 'Edit Task'; //Header text
    iframeDocument.querySelector('.titleinput').value = actualTask.title; //titel
    iframeDocument.querySelector('.description').value = actualTask.description; // description
    iframeDocument.querySelector('.dateinput').value = actualTask.date; // date
}

// set assigned contacts --------------------
function setAssignedContactsEditForm(contacts) {
    // open the container
    iframeDocument.querySelector('.assignedarrow').click();
    // select the assigned contacts
    for (let i = 0; i < contacts.length; i++) {
        assigneContacs(contacts[i] + 'label');
    }
    // close the container
    iframeDocument.querySelector('.assignedarrow').click();
}

function assigneContacs(element) {
    const dynamicElement = iframeDocument.getElementById(element);
    if (dynamicElement) {
        dynamicElement.click();
    } else {
        // check again after the timer run out
        setTimeout(function () {
            assigneContacs(element);
        }, 800);
    }
}

// Subtasks ---------------------------------
function setSubtasksEditForm() {
    actualTask.subtasks.forEach(element => {
        const INPUT_SUBTASK = iframeDocument.querySelector('.inputsubtask');
        INPUT_SUBTASK.value = element;
        iframeDocument.querySelector('.addsubtask').click();
        iframeDocument.querySelector('.acceptsubtask').click();
    });
}

// replace the buttons and set new events---
function changeButtons() {
    const ELEMENT = document.querySelector('.iframeTaskFormular');
    ELEMENT.paddingTop = '0px';
    const IFRAME_DOCUMENT_NEW = document.querySelector('.iframeTaskFormular').contentWindow.document;
    IFRAME_DOCUMENT_NEW.querySelector('.desktopcreatebutton').innerHTML = 'ok <div></div>';
    IFRAME_DOCUMENT_NEW.querySelector('.mobilecreatebutton').innerHTML = 'ok <div></div>';
    // save the original buttons
    let originalDesktopButton = IFRAME_DOCUMENT_NEW.querySelector('.desktopcreatebutton');
    let originalMobileButton = IFRAME_DOCUMENT_NEW.querySelector('.mobilecreatebutton');
    // clone the original buttons
    const NEW_DESKTOP_BUTTON = originalDesktopButton.cloneNode(true);
    const NEW_MOBILE_BUTTON = originalMobileButton.cloneNode(true);
    // replace the buttons
    originalDesktopButton.replaceWith(NEW_DESKTOP_BUTTON);
    originalMobileButton.replaceWith(NEW_MOBILE_BUTTON);
    // set new events
    NEW_DESKTOP_BUTTON.addEventListener('click', () => {
        saveEditTask();
    })
    NEW_MOBILE_BUTTON.addEventListener('click', () => {
        saveEditTask();
    })
}

/**
 * save the new Values in tasks, update the tasks API and re-list the tasks in Board
 * @listTasksInBoard re-list the tasks in Board
 * @translateContainerBack translate the edit/add task formular back to psoition left: 110vw
 */
function saveEditTask() {
    const INDEX = returnArrayIndex(tasks, 'taskid', actualTask.taskid);
    tasks[INDEX].title = iframeDocument.querySelector('.titleinput').value;
    tasks[INDEX].description = iframeDocument.querySelector('.description').value;
    tasks[INDEX].date = iframeDocument.querySelector('.dateinput').value;
    tasks[INDEX].assingto = getAssignedUsers();
    tasks[INDEX].priority = getPriority();
    tasks[INDEX].subtasks = getSubTasks();
    API.setTasks(tasks);
    listTasksInBoard(tasks);
    translateContainerBack('.iframeTaskFormular');
}

function getPriority() {
    const BUTTONS = iframeDocument.querySelectorAll('.priobutton');

    for (let button of BUTTONS) {
        if (button.classList.contains('urgentbutton')) {
            return 'urgent';
        } else if (button.classList.contains('mediumbutton')) {
            return 'medium';
        } else if (button.classList.contains('lowbutton')) {
            return 'low';
        }
    }
}

function getAssignedUsers() {
    const ELEMENT = iframeDocument.querySelector('.selectedusersshowoff').children;
    let array = [];
    Array.from(ELEMENT).forEach(contact => { array.push(contact.id) });
    return array;
}

function getSubTasks() {
    const ELEMENT = iframeDocument.querySelector('.subtasks').getElementsByTagName('li');
    let array = [];
    Array.from(ELEMENT).forEach(liElement => { array.push(liElement.innerText) });
    return array;
}

// add task --------------------------------------------------------------------------------------------------------
function openAddTaskFormular(state) {
    const ELEMENT = document.querySelector('.iframeTaskFormular');
    ELEMENT.src = ELEMENT.src;
    ELEMENT.style.display = 'flex';
    ELEMENT.style.transition = 'transform 1400ms ease-in-out';
    ELEMENT.style.paddingTop = '50px';


    translateContainer(ELEMENT);
    setTimeout(() => {
        iframeDocument = document.querySelector('.iframeTaskFormular').contentDocument;
        assignId('.desktopcreatebutton', state, iframeDocument);
        assignId('.mobilecreatebutton', state, iframeDocument);
        getTasks();
        iframeCloseButton();
        iframeDocument.querySelector('.desktopcreatebutton').addEventListener('click', () => { getTasksWithTimeout()});
        iframeDocument.querySelector('.mobilecreatebutton').addEventListener('click', () => { getTasksWithTimeout() });
    }, 600);

}

function getTasksWithTimeout(){
    setTimeout(() => {
        getTasks();
        translateContainerBack('.iframeTaskFormular');
    }, 2500);
    
}

function assignId(selector, id, iframe) {
    let element = iframe.querySelector(selector);
    if (element) {
        element.id = id ? id : 'TODO';
    }
}

// set events for add buttons in Task Header -----------------------------------------------------------------------
// todo
document.querySelector('.addToDo').addEventListener('click', () => { openAddTaskFormular('TODO'); });
document.querySelector('.mobileaddbtn').addEventListener('click', () => { openAddTaskFormular('TODO'); });
// in progress
document.querySelector('.addInProgress').addEventListener('click', () => { openAddTaskFormular('IN-PROGRESS'); });
// await feedback
document.querySelector('.addAwaitFeedback').addEventListener('click', () => { openAddTaskFormular('AWAIT-FEEDBACK'); });

// general functions -----------------------------------------------------------------------------------------------
function translateContainer(element) {
    element.style.display = 'flex';
    element.style.transition = 'transform 500ms ease-in-out';

    let win = (window.innerWidth / 2) + (window.innerWidth * 0.1);
    if (window.innerWidth > 1250) { win -= 160; }
    const CONTAINER = element.offsetWidth / 2;

    setTimeout(function () {
        element.style.transform = `translateX(-${win + CONTAINER}px)`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

function translateContainerBack(container) {
    document.querySelector('.boardcontainer').style.removeProperty('height');
    const CONTAINER = document.querySelector(container);
    // move container back to left 110 vw
    CONTAINER.style.transition = 'transform 100ms ease-in-out';
    CONTAINER.style.transform = 'translateX(0)';
    CONTAINER.style.left = '110vw';
    // remove the Categorie color classes
    setTimeout(function () {
        CONTAINER.style.display = 'none';
    }, 150);
    document.body.style.overflowY = "auto";
}

/**
 * Search in an array for a key with a specific value and returns the index 
 * @param {The array you want to search} array 
 * @param {The key you want to search for} key 
 * @param {And the Value of the key} value 
 * @returns {returns the index of the key with the specific value}
 */
function returnArrayIndex(array, key, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return i;
        }
    }
}

window.addEventListener('resize', handleResize);

function handleResize() {
    translateContainerBack('.iframeTaskFormular');
    translateContainerBack('.fullsizeTask');
}

