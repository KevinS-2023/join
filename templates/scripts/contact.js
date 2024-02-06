import * as API from "../../scripts/API_functions.js";
import { setContactFormButtonsToAdd, setContactFormButtonsToEdit, generateContactsList, generateEditSvg, generateDeleteSvg } from "../scripts/contactGenerate.js"
import {
    getInitials, getValue, element, getColorNumber, assignID, returnJsonIndex, clearInputFields, setInputValues,
    removeAllColorClasses, unselectAllContacts, selectContact, getWidthForTransition, setInformationContainerPosition } from "../scripts/contactsHelpFunctions.js"
import Contact from '../../classes/contacts.class.js';
export { contacts };
let contacts = await API.getContacts();




init();

// functions -------------------------------------------------------------------------------------------------------
function init() {
    setClickEvents();
    generateContactsList(contacts);
    setInformationContainerPosition();
    window.addEventListener("resize", onResize);
    element('buttonInfoContainerMobile').addEventListener('click', openEditAndDeleteButtons);
    element('contactListContainer').classList.add("custom-scrollbar");
}

function setClickEvents() {
    element('btnAddNewContact').addEventListener('click', (event) => { openContactFormAdd(event) });
    element('closeButton').addEventListener('click', () => { closeContactForm() });
    element('contactFormFirstButton').addEventListener('click', () => { closeContactForm() });
    element('contactFormSecondButton').addEventListener('click', () => { onclick = "document.getElementById('submit-btn').click()" });
    element('informationContainer').addEventListener('click', (event) => { closeEditAndDeleteButtons(event) });
    element('imgArrowBack').addEventListener('click', () => { onResize() });
    element('buttonInfoContainerMobile').addEventListener('click', (event) => { openEditAndDeleteButtons(event) });
}

//  Open Contact Form Add Contact -----------------------------------------------------------------------------------
function openContactFormAdd() {
    let box = element("contactForm");
    setContactFormToAdd();
    setContactFormButtonsToAdd();
    checkMediaQuery();
    box.style.transition = '1400ms ease-in-out';
    box.style.transform = 'translateX(-110vw)';
}

function setContactFormToAdd() {
    // Set Left Side Text
    element('contactFormLeftSideText').innerHTML = '<h1>Add contact</h1> <h4>Tasks are better with a team!</h4>';
    //Set User Img to person.svg
    element('contactInitials').innerHTML = '<img src="../../assets/person_white.svg">';
    element('contactInitials').style.backgroundColor = '#D9D9D9';
}

// Open Contact Form Edit -------------------------------------------------------------------------------------------
function openContactEditForm(id) {
    let box = element("contactForm");
    setContactFormButtonsToEdit(id);
    setContactFormToEdit(id);
    box.style.transition = '1400ms ease-in-out';
    box.style.transform = 'translateX(-110vw)';
}

function setContactFormToEdit(id) {
    // get the contact index from the json
    let index = returnJsonIndex(contacts, 'id', id);
    let initials = getInitials(contacts[index]['name']);
    // Set Left Side Text
    removeAllColorClasses('contactInitials', contacts[index]['color']);
    element('contactFormLeftSideText').innerHTML = '<h1>Edit contact</h1>';
    element('contactInitials').innerHTML = `<h1>${initials}</h1>`;
    setInputValues(contacts[index]['name'], contacts[index]['email'], contacts[index]['phone']);
}

// Close ContactForm -----------------------------------------------------------------------------------------------
function closeContactForm() {
    element("contactForm").style.transform = 'translateX(110vw)';
    clearInputFields();
}

// Add new Contact -----------------------------------------------------------------------------------------------
function saveNewContact() {
    const NAME_FROM_INPUT = getValue('inputName');
    const CAPITALIZED_NAME = NAME_FROM_INPUT.charAt(0).toUpperCase() + NAME_FROM_INPUT.slice(1);
    const EMAIL = getValue('inputMail');
    const PHONE_NUMBER = getValue('inputPhone');
    const COLOR = `variant` + getColorNumber();
    const INITALS = getInitials(NAME_FROM_INPUT);

    addContact(CAPITALIZED_NAME, EMAIL, PHONE_NUMBER, COLOR, INITALS);
    API.setContacts(contacts);
    return false;
}

function addContact(name, email, phone, color, initals) {
    // if name is already taken
    if (contacts.some(contact => contact.name == name)) {
        element('inputName').value = '';
        element('inputName').placeholder = 'Name bereits vergeben';
        element('inputName').style.color = 'red';
        return;
    }
    // create new contact
    pushNewContact(name, email, phone, color, initals);
    element('inputName').style.color = 'black';

    closeContactForm();
    slideButton('Contact succesfully created');
    init();
}


function pushNewContact(name, email, phone, color, initals) {
    const ID = assignID();

    const NEW_CONTACT = new Contact(name, email, phone, ID, initals, color);
    contacts.push(NEW_CONTACT);
}

//edit Contact -------------------------------------------------------------------------------------------------------
function saveEditedContact(id) {
    const INDEX = returnJsonIndex(contacts, 'id', id);
    const NAME = getValue('inputName');
    const MAIL = getValue('inputMail');
    const PHONE_NUMBER = getValue('inputPhone');

    contacts[INDEX]['name'] = NAME;
    contacts[INDEX]['email'] = MAIL;
    contacts[INDEX]['phone'] = PHONE_NUMBER;

    closeContactForm();
    slideButton('Contact succesfully modified');
    init();
    API.setContacts(contacts);
}

function deleteContact(id) {
    contacts.splice(returnJsonIndex(contacts, 'id', id), 1);
    setContactsIdNew();
    init();
    onResize();
    API.setContacts(contacts);
}

function setContactsIdNew(){
    for(let i = 0; i < contacts.length; i++){
        contacts[i]['id'] = i;
    }
}

// Media Query  and Resize ------------------------------------------------------------------------------------------
function checkMediaQuery() {
    if (window.innerWidth <= 720) {
        element('contactFormFirstButton').style.display = "none";
    }
    else {
        element('contactFormFirstButton').style.display = "flex";
    }
}

function onResize() {
    closeContactForm();
    setInformationContainerPosition();
    element('informationContainer').style.display = "none";
    unselectAllContacts();
    editAndDeleteButtonsOnResize();
    element('slideButton').style.left = '110vw';
}


// Contact Informations -----------------------------------------------------------------------------------------------
function showContactInformation(id) {
    unselectAllContacts();
    selectContact(id);
    setNewDeleteButtonEvent(id);
    element('infoEditButton').onclick = function () { openContactEditForm(id) };
    generateEditSvg();
    generateDeleteSvg();
    setContactInformations(id);
    transformInformationContainer();
}

function setNewDeleteButtonEvent(id){
    const deleteButton = element('infoDeleteButton');
    const deleteButtonClone = deleteButton.cloneNode(true);
    deleteButton.parentNode.replaceChild(deleteButtonClone, deleteButton);
    deleteButtonClone.addEventListener('click', () => { deleteContact(id) })
}

function setContactInformations(id) {
    const INDEX = returnJsonIndex(contacts, 'id', id);
    const NAME = contacts[INDEX]['name'];
    const MAIL = contacts[INDEX]['email'];
    const PHONE = contacts[INDEX]['phone'];
    const COLOR = contacts[INDEX]['color'];

    setInformations(NAME, MAIL, PHONE, COLOR);
}

function setInformations(name, email, phone, color) {
    element('contactInformationName').innerHTML = name;
    removeAllColorClasses('contactInformationInitials', color);
    element('contactInformationInitials').innerHTML = `<h1>${getInitials(name)}</h1>`;

    element('infoMailAndPhone').innerHTML = `
        <p>Contact Information</p>
            <div>
                <h4>Email</h4>
                <a href="mailto: ${email}">${email}</a>
                <h4>Phone</h4>
                <p>${phone}</p>
            </div>`;
}

// information container transition / Anmiation -------------------------------------------------------------------------
function transformInformationContainer() {
    transformInformationContainerOut();
    const INFOCONTAINER = element('informationContainer');
    INFOCONTAINER.style.display = 'flex';
    INFOCONTAINER.style.transition = '1000ms ease-in-out';
    INFOCONTAINER.style.transform = `translateX(-${getWidthForTransition()}px)`;
}

function transformInformationContainerOut() {
    const INFOCONTAINER = element('informationContainer');
    INFOCONTAINER.style.display = 'none';
    INFOCONTAINER.style.transition = '1ms ease-in-out';
    setInformationContainerPosition();
}

// set buttons to display none or flex at mobile version ----------------------------------------------------------------
function openEditAndDeleteButtons(event) {
    event.stopPropagation();
    element('informationButtons').style.display = 'flex';
}

function closeEditAndDeleteButtons(event) {
    let box = element('informationButtons');

    if (window.innerWidth < 721) {
        box.style.display = 'none';
        event.stopPropagation();
    }
}

function editAndDeleteButtonsOnResize(){
    if(window.innerWidth > 720){element('informationButtons').style.display = 'flex';}
    else{element('informationButtons').style.display = 'none';}
}

// success button animation -----------------------------------------------------------------------------------------------
function slideButton(text) {
    const BUTTON = element('slideButton');
    BUTTON.innerHTML = `<h4>${text}</h4>`;

    BUTTON.style.transition = '2000ms ease-in-out';
    if(window.innerWidth > 600){BUTTON.style.left = '50vw';}
    else{BUTTON.style.left = '10vw';}

    setTimeout(function () {
        BUTTON.style.opacity = '0';
    }, 2500);

    setTimeout(function () {
        BUTTON.style.transition = 'none';
        BUTTON.style.left = '110vw';
        BUTTON.style.opacity = '1';
    }, 4000);
}

// export ------------------------------------------------------------------------------------------------------------------
export { saveNewContact, openContactEditForm, showContactInformation, saveEditedContact, deleteContact };