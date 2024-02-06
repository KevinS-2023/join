import * as API from "../../scripts/API_functions.js";

const greeting = document.querySelector('.greeting');
const greetingname = document.querySelector('.greetingname');
const todoamount = document.querySelector('.todoamount');
const doneamount = document.querySelector('.doneamount');
const urgentamount = document.querySelector('.urgentamount');
const date = document.querySelector('.date');
const tasksamount = document.querySelector('.tasksamount');
const tasksinprogressamount = document.querySelector('.tasksinprogressamount');
const awaitingfeedbackamount = document.querySelector('.awaitingfeedbackamount');

const URGENT = 'urgent';
const TODO = 'TODO';
const DONE = 'DONE';
const IN_PROGRESS = 'IN-PROGRESS';
const AWAIT_FEEDBACK = 'AWAIT-FEEDBACK';

let actualdate = new Date();
let tasks;
let user;

main();

/**
 * Sets user to the actual user which is logged in
 */
async function main() {
    user = await API.getActualUser()
    setGreeting();
    setGreetingName();
    setBoardInfo();
}

function setGreeting() {
    greeting.innerHTML = getTime();
}

/**
 * Sets the greeting name to the actual user which is logged in
 */
function setGreetingName() {
    greetingname.innerHTML = user['value'] == 'Guest' ? "Guest" : user['value'][0].toUpperCase() + user['value'].slice(1);
}

/**
 * 
 * @returns {String} - Returns the greeting of checkTime() depending on the actual time
 */
function getTime() {
        let hours = actualdate.getHours();
        let value = checkTime(hours);
        return value;
}

/**
 * 
 * @param {Number} hours - The actual hour
 * @returns {String} - Returns the greeting depending on the actual time
 */
function checkTime(hours) {
    let value = 'Good Evening,';
    if (hours >= 5 && hours < 12) {
        value = 'Good Morning,';
    } else if (hours >= 12 && hours < 17) {
        value = 'Good Afternoon,';
    }
    return user['value'] == "Guest" ? value.replace(",", "") : value;
}

/**
 * Sets the board info to actual values
 */
async function setBoardInfo () {
    tasks = await API.getTasks();
    setTasksAmount();
    countStates();
}

/**
 * Counts the amount of tasks in each state and calls setAmounts() with the values
 */
function countStates() {
    let todos = tasks.filter(task => task['state'] === TODO).length;
    let dones = tasks.filter(task => task['state'] === DONE).length;
    let inprogress = tasks.filter(task => task['state'] === IN_PROGRESS).length;
    let urgents = tasks.filter(task => task['priority'] === URGENT).length;
    let awaitingfeedback = tasks.filter(task => task['state'] === AWAIT_FEEDBACK).length;
    setAmounts(todos, dones, urgents, inprogress, awaitingfeedback);
}

/**
 * 
 * @param {Number} todos - Amount of tasks in todo state
 * @param {Number} dones - Amount of tasks in done state
 * @param {Number} urgents - Amount of tasks in urgent state
 * @param {Number} inprogress - Amount of tasks in in-progress state
 * @param {Number} awaitingfeedback - Amount of tasks in awaiting-feedback state
 */
function setAmounts(todos, dones, urgents, inprogress, awaitingfeedback) {
    todoamount.innerHTML = todos;
    doneamount.innerHTML = dones;
    tasksinprogressamount.innerHTML = inprogress;
    urgentamount.innerHTML = urgents;
    awaitingfeedbackamount.innerHTML = awaitingfeedback;
    checkUrgentDate(urgents);
}

/**
 * 
 * @param {Number} urgents - Amount of tasks in urgent state
 * Gets all tasks with the priority urgent and calls checkNearestDate() with the array of the urgent tasks
 */
function checkUrgentDate(urgents) {
    if (urgents > 0) {
        let urgenttasks = tasks.filter(task => task['priority'] == "urgent");
        checkNearestDate(urgenttasks);
    }
}

/**
 * 
 * @param {Array} urgenttasks - Array of tasks with the priority urgent
 * 
 * Get the task with priority urgent which has the nearest date and calls setUrgentDate() with the task
 */
function checkNearestDate(urgenttasks) {
    let dates = urgenttasks.map(task => parseInt(task['date'].replace("-", "").replace("-", "")));
    let nearestDate = Math.min(...dates);
    setUrgentDate(urgenttasks[dates.indexOf(nearestDate)]);
}

/**
 * 
 * @param {Object} task - Task with the priority urgent which has the nearest date
 * 
 * Sets the converted date, Month in letters, day and year in numbers, to the date element
 */
function setUrgentDate(task) {
    let dateObject = new Date(task['date']);
    let formattedDate = dateObject.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    date.textContent = formattedDate;
}

/**
 * Sets the amount of tasks in the tasksamount element
 */
function setTasksAmount() {
    tasksamount.innerHTML = tasks.length;
}