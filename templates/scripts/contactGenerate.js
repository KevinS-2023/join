import { contacts, saveNewContact, openContactEditForm, showContactInformation, saveEditedContact, deleteContact } from '../scripts/contact.js';
import { sortJson, getInitials, element, } from "../scripts/contactsHelpFunctions.js";

// set contact formular buttons for add contact---------------------------------------------------------------
function setContactFormButtonsToAdd(id) {
    // first button
    element('contactFormFirstButton').innerHTML = `
        <h4>Cancel</h4>`;
        generateCancelSvg();

    // second button
    element('contactFormSecondButton').innerHTML = `
        <h4>Create contact</h4>
        <img src="../../assets/check_white.svg">
        <input type="submit" style="display:none" id="submit-btn"/>`;

    element('contactFormInputAndButtons').onsubmit = function (event) {
        event.preventDefault();
        saveNewContact(id);
    }
}

// set contact formular buttons for edit contact---------------------------------------------------------------
function setContactFormButtonsToEdit(id) {
    // First Button
    element('contactFormFirstButton').innerHTML = `
        <h4>Delete</h4>`;
    generateCancelSvg();
    setFirstButtonEvent(id);

    // Second Button
    element('contactFormInputAndButtons').onsubmit = null;
    element('contactFormSecondButton').innerHTML = `
        <h4>Save</h4>
        <img src="../../assets/check_white.svg">
        <input type="submit" style="display:none" id="submit-btn" />`;
    element('contactFormInputAndButtons').onsubmit = function (event) {
        event.preventDefault();
        saveEditedContact(id);
    }
}

function setFirstButtonEvent(id){
    const FIRST_BUTTON = element('contactFormFirstButton');
    const FIRST_BUTTON_CLONE = FIRST_BUTTON.cloneNode(true);
    FIRST_BUTTON.parentNode.replaceChild(FIRST_BUTTON_CLONE, FIRST_BUTTON);
    FIRST_BUTTON_CLONE.addEventListener('click', (event) => { event.preventDefault(), deleteContact(id)});
}

// Contact List  ---------------------------------------------------------------------------------------------
function generateContactsList() {
    const BOX = element('contactList');
    sortJson(contacts);
    const FIRST_CHARS = getFirstChar(contacts);
    BOX.innerHTML = '';
    let index = 0;

    for (let i = 0; i < FIRST_CHARS.length; i++) {
        generateFirstChar(BOX, FIRST_CHARS[i].toUpperCase());

        for (let x = 0; x < contacts.length; x++) {
            const CONTACT = returnContactObject(x);

            if (FIRST_CHARS[i] == CONTACT['letter']) {
                generateContact(BOX, CONTACT['contactId'], CONTACT['initials'], CONTACT['name'], CONTACT['email'], CONTACT['colorClass']);
                index++;
            }
        }
    }
    setContactsClickEvent();
}

function returnContactObject(index) {
    const NAME = contacts[index]['name'];

    const CONTACT = {
        'name': NAME,
        'initials': getInitials(NAME),
        'email': contacts[index]['email'],
        'colorClass': contacts[index]['color'],
        'letter': NAME.charAt(0),
        'contactId': contacts[index]['id']
    };

    return CONTACT;
}

function generateContact(container, contactId, initials, name, email, color) {
    container.innerHTML += `
            <div class="contact displayCenterCenter" id="${contactId}" > 
                <div class="contactInitialsContactList displayCenterCenter ${color}">${initials}</div>
                <div class="contactNameAndMail">
                    <h3>${name}</h3>
                    <a>${email}</a>
                </div>
            </div>`
}

function setContactsClickEvent() {
    const CONTACTS_BOX = document.querySelectorAll('.contact');
    CONTACTS_BOX.forEach((contact) => {
        contact.addEventListener('click', () => {
            showContactInformation(contact.id);
        });
    });
}

// contacts initals --------------------------------------------------------------------------------------
function generateFirstChar(element, char) {
    element.innerHTML += `
    <div class="contactListChar">
        <h3>${char}</h3>
    <div>`;

    element.innerHTML += `
    <div class="contactListLineContainer displayCenterCenter">
        <div class="contactListLine"></div>
    </div>`;
}

function getFirstChar(array) {
    const FIRST_CHARS = [];

    for (let i = 0; i < array.length; i++) {
        if (!FIRST_CHARS.includes(array[i]['name'].charAt(0))) {
            FIRST_CHARS.push(array[i]['name'].charAt(0));
        }
    }
    return FIRST_CHARS;
}


// generate SVG Functions for hover effect ------------------------------------------------------------------
function generateEditSvg() {
    element('infoEditButton').innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="editSvg" d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
    </svg> Edit`;
}

function generateDeleteSvg() {
    element('infoDeleteButton').innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="deleteSvg" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/>
    </svg> Delete`;
}

function generateCancelSvg() {
    element('contactFormFirstButton').innerHTML += `
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="cancelSvg" d="M7.001 6.50008L12.244 11.7431M1.758 11.7431L7.001 6.50008L1.758 11.7431ZM12.244 1.25708L7 6.50008L12.244 1.25708ZM7 6.50008L1.758 1.25708L7 6.50008Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#29ABE2"/>
    </svg>`;
}
// 
export { setContactFormButtonsToAdd, setContactFormButtonsToEdit, generateContactsList, generateEditSvg, generateDeleteSvg, generateCancelSvg };