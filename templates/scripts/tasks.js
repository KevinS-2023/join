import * as selected from "./task.selector.js"
import { reset } from "./createcontactlist.js";

let listedsubtasks;
let subtasksbuttons;

let isopen = false;

let subtaskslist = [];

let prio = '';

/**
 * Eventlisteners for the priority buttons - changes the priority of the task
 */
selected.priobutton.forEach((button) => {
    button.addEventListener('click', (event) => {
        let name = event.target.name;
        let target = event.target;
        if (event.target.classList.contains('buttonimg')) {
            name = event.target.parentNode.name;
            target = event.target.parentNode;
        }
        clearProirity();
        changeImg(name);
        target.classList.add(`${target.name}`);
        event.preventDefault();
    });
});

/**
 * Clears the priority to undefined and removes the classes from the buttons
 */
function clearProirity() {
    selected.priobutton.forEach((button) => {
        button.classList.remove('urgentbutton', 'mediumbutton', 'lowbutton');
    });
    selected.buttonimg[0].src = "../../assets/urgent.svg";
    selected.buttonimg[1].src = "../../assets/medium.svg";
    selected.buttonimg[2].src = "../../assets/low.svg";
    prio = undefined;
}

/**
 * 
 * @param {String} name - the name of the button
 * 
 * Changes the image of the button to the white version when it is selected 
 */
function changeImg(name) {
    switch (name) {
        case 'urgentbutton':
            selected.buttonimg[0].src = "../../assets/urgent_white.svg";
            prio = 'urgent';
            break;
        case 'mediumbutton':
            selected.buttonimg[1].src = "../../assets/medium_white.svg";
            prio = 'medium';
            break;
        case 'lowbutton':
            selected.buttonimg[2].src = "../../assets/low_white.svg";
            prio = 'low';
            break;
        default:
            break;
    }
}

/**
 * Opens and closes the formselect element
 */
selected.formselect.addEventListener('click', (event) => {
    openAndcloseformselect();
});

/**
 * Opens and closes the formselect element when the arrow is clicked
 */
selected.categoryarrow.addEventListener('click', (event) => {
    openAndcloseformselect();
});

/**
 * Eventlistener for the categorylist - changes the value of the formselect to the clicked category and closes the formselect
 */
selected.categorylist.addEventListener('click', (event) => {
    if (event.target.id) {
        selected.formselect.value = event.target.id;
        openAndcloseformselect();
    }
});

/**
 * Eventlistener for the addsubtask button - focuses the inputsubtask element
 */
selected.addsubtask.addEventListener('click', (event) => {
    selected.inputsubtask.focus();
});

/**
 * Focuses the inputsubtask element and shows the subtask buttons
 */
selected.inputsubtask.addEventListener('focus', (event) => {
    inputsubtaskfocus();
});

/**
 * Focuses the inputsubtask element and clears the value
 */
selected.clearsubtask.addEventListener('click', (event) => {
    selected.inputsubtask.value = '';
    selected.inputsubtask.focus();
});

/**
 * Adds the subtask to the subtaskslist and inserts the list
 */
selected.acceptsubtask.addEventListener('click', (event) => {
    addSubtask();
});

/**
 * Resets the forms and the subtaskslist
 */
selected.clearbutton.addEventListener('click', (event) => {
    resetForms();
});

/**
 * Set the min value for the date input field to today's date
 */
window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.dateinput').min = new Date().toISOString().split('T')[0];
    changeImg('mediumbutton');
});

/**
 * Eventlistener for the document - closes the formselect and the inputsubtask element when the user clicks outside of the elements
 */
document.addEventListener('click', (event) => {
    if (event.target !== selected.inputsubtask && event.target !== selected.addsubtask && event.target !== selected.clearsubtask && event.target !== selected.acceptsubtask) {
        inputsubtaskblur();
    }
    if (!event.target.classList.contains('category') && event.target !== selected.categoryarrow && event.target !== selected.categorylist && event.target !== selected.formselect) {
        isopen = true;
        openAndcloseformselect();
    }
});

/**
 * Opens and closes the formselect element
 */
function openAndcloseformselect() {
    selected.categorylist.classList.toggle('d-none', isopen);
    selected.categoryarrow.classList.toggle('rotate', !isopen)
    isopen = !isopen;
}

/**
 * 
 */
function inputsubtaskfocus() {
    selected.subtaksbuttons.classList.remove('d-none');
    selected.addsubtask.classList.add('d-none');
}

/**
 * Blurs the inputsubtask element and hides the subtask buttons
 */
function inputsubtaskblur() {
    selected.subtaksbuttons.classList.add('d-none');
    selected.addsubtask.classList.remove('d-none');
    selected.inputsubtask.blur();
}

/**
 * 
 * @returns
 * 
 * Adds the subtask to the subtaskslist and inserts the list
 */
function addSubtask() {
    selected.inputsubtask.focus();
    if (selected.inputsubtask.value == '') {
        selected.inputsubtask.value = '';
        return;
    }
    inputsubtaskblur();
    subtaskslist.push(selected.inputsubtask.value);
    selected.inputsubtask.value = '';
    insertList();
}

/**
 * Inserts the subtaskslist into the subtaskslist element
 */
function insertList() {
    selected.subtasks.innerHTML = '';
    for (let index = 0; index < subtaskslist.length; index++) {
        selected.subtasks.innerHTML += `<li class="subtaskitem" id="${index}">${subtaskslist[index]}</li>`;
    }
    changeli();
}

/**
 * Eventlistener for the subtaskitems - changes the subtask to an input element when the user double clicks on the subtask
 * To change the subtask value the user has to click on the okay button
 */
function changeli() {
    listedsubtasks = document.querySelectorAll('.subtaskitem').forEach((item) => {
        item.addEventListener('click', (event) => {
            changeToInput(parseInt(item.id));
        });
    });
}

/**
 * 
 * @param {Number} id - the id of the subtask
 * 
 * Changes the subtask to an input element when the user double clicks on the subtask
 */
function changeToInput(id) {
    selected.subtasks.innerHTML = '';
    subtaskslist.map((item, index) => {
        if (id === index) {
            createSubtaskinput(index);
        } else {
            selected.subtasks.innerHTML += `<li class="subtaskitem" id="${index}">${item}</li>`;
        }
        editButtonfunctions();
    });
}

/**
 * Eventlistener for the editbuttons - deletes or saves the subtask
 */
function editButtonfunctions() {
    subtasksbuttons = document.querySelectorAll('.editbutton').forEach((button) => {
        button.addEventListener('click', (event) => {
            if (button.src.includes('trash')) {
                deleteSubtask(parseInt(button.parentNode.id));
            } else if (button.src.includes('okay')) {
                saveSubtask(parseInt(button.parentNode.id));
            }
        });
    });
}

/**
 * 
 * @param {Number} id - the id of the subtask
 * 
 * Deletes the subtask from the subtaskslist and inserts the list
 */
function deleteSubtask(id) {
    subtaskslist.splice(id, 1);
    insertList();
}

/**
 * 
 * @param {Number} id - the id of the subtask
 * 
 * Saves the subtask to the subtaskslist and inserts the list 
 */
function saveSubtask(id) {
    const editinput = document.querySelector(`.editinput`);
    if (editinput.value !== '') {
        subtaskslist[id] = editinput.value;
        insertList();
    } else {
        editinput.classList.add('editinputwrong');
        editinput.addEventListener('input', () => {
            editinput.classList.remove('editinputwrong');
        });
    }
}

/**
 * Resets the forms and the subtaskslist and the priority and loads the subtaskslist
 */
function resetForms() {
    subtaskslist = [];
    insertList();
    clearProirity();
    reset();
}

/**
 * 
 * @param {Number} index - the index of the subtask
 * 
 * Creates an input element for the subtask
 */
function createSubtaskinput(index) {
    selected.subtasks.innerHTML += /*html*/ `
            <div class="editcontainer">
                <input type="text" class="editinput" id="input${index}" value="${subtaskslist[index]}">
                <div class="editbuttons" id="${index}">
                    <img src="../../assets/trash.svg" alt="" class="subtasksbutton editbutton">
                    <img src="../../assets/smallpartingline.svg" alt="" class="smallpartingline">
                    <img src="../../assets/okay.svg"  alt="" class="subtasksbutton editbutton">
                </div>
            </div>
            `;
}

export { subtaskslist, prio, resetForms }