import * as API from "../../scripts/API_functions.js";
import { selectedUserIds } from "./createcontactlist.js";
import Task from "../../classes/tasks.class.js";
import { desktopcreatebutton, mobilecreatebutton, dateinput, description, formselect, titleinput, taskcontainer, taskcreated } from "./task.selector.js";
import { prio, resetForms, subtaskslist } from "./tasks.js";

let tasks = [];

const boardbtn = window.parent.document.querySelector('[name="board"]');

function taskCreatedFeedback() {
    taskcreated.style.display = 'flex';
    setTimeout(() => {
        taskcreated.style.display = 'none';
    }, 2500);

}

/**
 * Hab ich hinzugefügt 
 */
window.addEventListener('DOMContentLoaded', () => {
    taskcontainer.onsubmit = function (event) {
        event.preventDefault();
        newTask(desktopcreatebutton.id);
    }
});

// desktopcreatebutton?.addEventListener('click', () => { newTask(desktopcreatebutton.id); });

// mobilecreatebutton?.addEventListener('click', () => { newTask(mobilecreatebutton.id); });

/**
 * 
 * @param {String} state - the state of the task TODO / AWAITFEEDBACK / INPROGRESS / DONE
 * @returns 
 */
async function newTask(state) {
    if (titleinput.value !== '' && dateinput.value !== '' && prio !== '' && formselect.value !== '' && desktopcreatebutton.textContent !== 'ok ') {
        await getTasks();
        const newTask = new Task(titleinput.value, description.value, selectedUserIds, dateinput.value, prio, formselect.value, subtaskslist, subtasksdone(), generateTaskId(), state);
        resetForms();
        taskCreatedFeedback()
        await setTasks(newTask);
        setTimeout(() => {
            boardbtn.click();
            return;
        }, 2000);
    }
}

/**
 * @returns {Array} - Returns all tasks from the API in an array which is iterable through [...data]
 */
async function getTasks() {
    tasks = [];
    let data = await API.getTasks();
    tasks = [...data];
}

/**
 * @returns {Number} - Returns the length of the tasks array when it it not empty, otherwise it returns 0
 */
function generateTaskId() {
    if (tasks.length > 0) {
        let ids = tasks.map(task => task['taskid']);
        return Math.max(...ids) + 1;
    }
    return 0;
}

/**
 * @returns {Array} - Returns an array filled with false values with the length of the subtaskslist array
 */
function subtasksdone() {
    return Array(subtaskslist.length).fill(false);
}

/**
 * Replaces the tasks array of the API with the actual tasks array
 */
async function setTasks(newTask) {
    tasks.push(newTask);
    await API.setTasks(JSON.stringify(tasks));
}

export { subtasksdone, newTask };