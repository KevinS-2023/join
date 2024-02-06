import * as API from "../scripts/API_functions.js";

const popupcontainer = document.querySelector('.popupcontainer');
const popup = document.querySelector('.popup');
const userprofile = document.querySelector('.userprofile');
const joincontent = document.querySelector('.joincontent');
const user_logo = document.querySelector('.user_logo');
const navitem = document.querySelectorAll('.navitem');
const logout = document.querySelector('[name="logout"]');

const URLs = new Map(
    [
        ['summary', '../templates/layouts/summary.html'],
        ['task', '../templates/layouts/tasks.html'],
        ['board', '../templates/layouts/board.html'],
        ['contacts', '../templates/layouts/contacts.html'],
        ['legalnotice', '../legalnotice/index.html'],
        ['privacypolicy', '../privacypolicy'],
        ['help', '../help/index.html']
    ]
);

main();

/**
 * Main function - sets the user logo and checks if a navitem is clicked
 */
function main() {
    setUserLogo();
    checkclicked();
}

/**
 * Eventlistener for the userprofile button - opens the popup
 */
userprofile?.addEventListener('click', () => {
    popupcontainer.classList.remove('d-none');
});

/**
 * Eventlistener for the popup - closes the popup if the user clicks outside of the popup
 */
popupcontainer?.addEventListener('click', (event) => {
    if (event.target != popup) {
        popupcontainer.classList.add('d-none');
    }
});

/**
 * Sets the user logo to the first letter of the username
 */
async function setUserLogo() {
    let user = await API.getActualUser();
    user_logo.innerHTML += user['value'][0].toUpperCase();
}

/**
 * Checks if a navitem is clicked and sets the selectedsidebaritem class to the navitem
 */
function checkclicked() {
    navitem.forEach(item => {
        item.addEventListener('click', (event) => {
            removeSelected();
            setSelected(event.target);
        });
    });
}

/**
 * 
 * @param {*} target - the clicked navitem
 * @returns
 * 
 * Sets the selectedsidebaritem class to the clicked navitem and changes the content of the iframe
 */
function setSelected(target) {
    if (target.classList.contains('sidebaritem')) {
        target.classList.add('selectedsidebaritem');
        changeContent(target.name);
        return;
    } else if (target.classList.contains('navitem')) {
        changeContent(target.name);
        return;
    }
}

/**
 * Removes the selectedsidebaritem class from all navitems
 */
function removeSelected() {
    navitem.forEach(item => {
        item.classList.remove('selectedsidebaritem');
    });
}


/**
 * 
 * @param {*} name - the name of the content to select the url
 * 
 * Changes the src of the iframe
 */
function changeContent(name) {
    joincontent.src = URLs.get(name);
}

/**
 * Eventlistener for the iframe - checks if the iframe is loaded and adds eventlisteners to the buttons
 */
joincontent.addEventListener('load', () => {
    const btns = joincontent.contentWindow.document.querySelectorAll('[name="task"]');
    const addcontact = joincontent.contentWindow.document.querySelector('.addcontact');
    const addTaskCompactBtns = joincontent.contentWindow.document.querySelectorAll('.addtaskcompact');
    addtaskEvent(addTaskCompactBtns);
    btnsEvent(btns);
    addContact(addcontact);
});

/**
 * 
 * @param {*} addTaskCompactBtns - the addtaskcompact buttons
 * 
 * Adds eventlisteners to the addtaskcompact buttons - opens the addtask
 */
function addtaskEvent(addTaskCompactBtns) {
    addTaskCompactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('[name="task"]').click();
        });
    });
}

/**
 * 
 * @param {*} btns - the task buttons
 * 
 * Adds eventlisteners to the task buttons - opens the board
 */
function btnsEvent(btns) {
    btns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                document.querySelector('[name="board"]').click();
            });
        }
    });
}

/**
 * 
 * @param {*} addcontact - the addcontact button
 * 
 * Adds eventlisteners to the addcontact button - opens the contacts
 */
function addContact(addcontact) {
    addcontact?.addEventListener('click', () => {
        document.querySelector('[name="contacts"]').click();
    });
}

/**
 * Eventlistener for the logout button - sets the actual user to guest and opens the index.html
 */
logout.addEventListener('click', async () => {
    await API.setActualUser('Guest');
    open('../index.html', '_self');
});