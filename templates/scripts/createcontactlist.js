import * as API from '../../scripts/API_functions.js';
import * as selected from "./task.selector.js";

let labels;
let showoffusers;
let users;

let isopen = false;

let selectedUserIds = [];
let searchusers = [];
let classlist = ['assignedinput', 'selectuserslist', 'listeduser', 'contact', 'addcontact', 'assignedarrow', 'd-none'];

/**
 * Eventlistener for the window resize - sets the margin of the left form
 */
window.addEventListener('resize', (event) => {
    setMargin();
});

/**
 * Eventlisteners for the assigned users list - opens and closes the list
 */
selected.assignedinput.addEventListener('click', (event) => {
    openList();
});

/**
 * Eventlistener for the document - closes the list if the user clicks outside of the list
 */
document.addEventListener('click', (event) => {
    let classes = Array.from(event.target.classList);
    if (!classes.some((element) => classlist.includes(element))) {
        closeList();
    }
});

/**
 * Eventlistener for the addcontact button - prevents the default behaviour
 */
selected.addcontact.addEventListener('click', (event) => {
    event.preventDefault();
});

/**
 * Eventlistener for the assigned input - searches the list for the input value
 */
selected.assignedinput.addEventListener('input', (event) => {
    searchList();
});

/**
 * Eventlistener for the assigned input - clears the input value when the user clicks outside of the input
 */
selected.assignedinput.addEventListener('focusout', (event) => {
    selected.assignedinput.value = '';
});

/**
 * Eventlistener for the assigned arrow - opens and closes the list
 */
selected.assignedarrow.addEventListener('click', (event) => {
    if (isopen) {
        closeList();
    } else if (!isopen) {
        openList();
    }
});

/**
 * 
 * @returns
 * 
 * Opens the list and flips the isopen variable
 */
function openList() {
    if (!isopen) {
        selected.selectuserslist.classList.remove('d-none');
        selected.addcontact.classList.remove('d-none');
        selected.fillspace.classList.remove('d-none');
        selected.assignedarrow.classList.add('rotate');
        isopen = !isopen;
        getUsers();
        return;
    }
}

/**
 * 
 * @returns
 * 
 * Closes the list and flips the isopen variable
 */
function closeList() {
    if (isopen) {
        selected.selectuserslist.classList.add('d-none');
        selected.addcontact.classList.add('d-none');
        selected.fillspace.classList.add('d-none');
        selected.assignedarrow.classList.remove('rotate');
        isopen = !isopen;
        return;
    }
}

/**
 * Requests the users from the API and creates the list
 */
async function getUsers() {
    users = await API.getContacts();
    createList(users);
}

/**
 * 
 * @param {JSON} datapack - the data from the API
 * 
 * Creates the list from the datapack
 */
function createList(datapack) {
    selected.selectuserslist.innerHTML = '';
    for (let user of datapack) {
        selected.selectuserslist.innerHTML += createListElement(user['name'], user['id'], user['initials'], user['color']);
    }
    createEventlistener();
}

/**
 * 
 * @param {String} name 
 * @param {Number} id 
 * @param {String} initials 
 * @param {String} color 
 * @returns HTML element
 */
function createListElement(name, id, initials, color) {
    return /*html*/`
    <li class="listeduser">
        <input type="checkbox" class="d-none" name="" id="${id}check">
        <label for="${id}check" class="contact" id="${id}label">
            <div class="contacstlogo ${color}">
                <img src="../../assets/ellipse_users.svg" alt="" class="contactslogoring">
                <div class="contactslogoname">${initials}</div>
            </div>
            <p class="contactname">${name}</p>
            <div class="listeduserimgcontainer">
                <img src="../../assets/checkbox_unchecked.svg" alt="">
            </div>
        </label>
    </li>
    `;
}

/**
 * Creates the eventlistener for the listed contacts
 */
function createEventlistener() {
    labels = document.querySelectorAll('.contact').forEach((label) => {
        includedByAssignedusers(label);
        actualEventlistener(label);
    });
}

/**
 * 
 * @param {HTMLLabelElement} label
 * 
 * Changes the checkbox to checked
 */
function checkedbox(label) {
    label.children[2].children[0].src = "../../assets/checkbox_checked.svg";
}

/**
 * 
 * @param {HTMLLabelElement} label
 * 
 * Changes the checkbox to unchecked
 */
function uncheckedbox(label) {
    label.children[2].children[0].src = "../../assets/checkbox_unchecked.svg";
}

/**
 * 
 * @param {HTMLLabelElement} label
 * 
 * Checks if the user is already assigned to the task and checks the checkbox if true
 */
function includedByAssignedusers(label) {
    if (selectedUserIds.includes(label.id.replace('label', ''))) {
        document.getElementById(label.id.replace('label', 'check')).checked = true;
        checkedbox(label);
    }
}

/**
 * 
 * @param {event} event 
 * @param {HTMLLabelElement} label 
 * @returns
 * 
 * Checks if the checkbox is checked or unchecked and changes the checkbox and the selectedUserIds array
 */
function checkIfChecked(event, label) {
    if (event.target.checked) {
        checkedbox(label);
        selectedUserIds.push(label.id.replace('label', ''));
        createSelectedUsersShowoff();
        return;
    } else if (!event.target.checked) {
        uncheckedbox(label);
        selectedUserIds.splice(selectedUserIds.indexOf(label.id.replace('label', '')), 1);
        createSelectedUsersShowoff();
        return;
    }
}

/**
 * 
 * @param {HTMLLabelElement} label 
 * 
 * Creates the eventlistener for the listed contacts
 */
function actualEventlistener(label) {
    document.getElementById(label.id.replace('label', 'check')).addEventListener('change', (event) => {
        checkIfChecked(event, label);
    });
}

/**
 * Shows the selected users in the left form in the showoff div
 */
function createSelectedUsersShowoff() {
    selected.selectedusersshowoff.innerHTML = '';
    for (let id of selectedUserIds) {
        id = parseInt(id);
        users.map((user) => {
            if (user['id'] == id) {
                selected.selectedusersshowoff.innerHTML += createSelectedUsers(user['id'], user['initials'], user['color']);
            }
        });
    }
    showoffusers = document.querySelectorAll('.showeduser').forEach((user) => {
        user.addEventListener('click', (event) => {
            deleteSelectedUser(event);
            setMargin();
        });
    });
    setMargin();
}

/**
 * 
 * @param {event} event
 * 
 * Deletes the selected user from the selectedUserIds array and calls the createSelectedUsersShowoff function
 */
function deleteSelectedUser(event) {
    selectedUserIds.splice(selectedUserIds.indexOf(event.target.id), 1);
    createSelectedUsersShowoff();
}

/**
 * 
 * @param {Number} id 
 * @param {String} initials 
 * @param {String} color 
 * @returns HTML element
 * 
 * Creates the selected users in the left form in the showoff div
 */
function createSelectedUsers(id, initials, color) {
    return /*html*/`
    <div class="showeduser" id="${id}">
        ${initials} <img src="../../assets/ellipse_users.svg" alt="" class="showeduserring ${color}">
    </div>
    `;
}

/**
 * Searches the list for the input value
 */
function searchList() {
    searchusers = [];
    if (selected.assignedinput.value.length > 0) {
        getSearchedUsers();
        createList(searchusers);
    } else if (selected.assignedinput.value.length == 0) {
        createList(users);
        searchusers = [];
    }
}

/**
 * Loops through the users array and pushes the users that includes the input value to the searchusers array
 */
function getSearchedUsers () {
    for (let user of users) {
        if (user['name'].toLowerCase().includes(selected.assignedinput.value.toLowerCase())) {
            if (!searchusers.includes(user)) {
                searchusers.push(user);
            }
        }
    }
}

/**
 * Resets the selectedUserIds array and calls the createSelectedUsersShowoff function
 */
function reset() {
    selectedUserIds = [];
    createSelectedUsersShowoff();
}

/**
 * Sets the margin of the left form
 */
function setMargin() {
    if (selectedUserIds.length > 0 && window.innerWidth < 1250) {
        selected.leftform.style.setProperty("margin-bottom", "80px", "important");
    } else if (window.innerWidth < 1250) {
        selected.leftform.style.setProperty("margin-bottom", "40px", "important");
    } else {
        selected.leftform.style.setProperty("margin-bottom", "71px", "important");
    }
}

export { reset, selectedUserIds };