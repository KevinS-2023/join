import {contacts} from '../scripts/contact.js';

// sort an JSON 
function sortJson(json){
    json = json.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if(a.name > b.name){
            return 1;
        }
        return 0;
      });   
}

// returns the initials from the first and second name ---------------------------------------------
function getInitials(name){
    const NAMES = name.split(" ");
    let initials = "";

    for (var i = 0; i < NAMES.length; i++) {
        initials += NAMES[i].charAt(0).toUpperCase();
      }

    return initials;
}

// returns the value from an element by id ---------------------------------------------------------
function getValue(id){
    return document.getElementById(id).value;
}

// returns the element by id -----------------------------------------------------------------------
function element(id){
    return document.getElementById(id);
}

// Generate a random number between 1 and 15 ------------------------------------------------------
function getColorNumber(){
    return Math.floor(Math.random() * 15) + 1;
}

// returns an id number for a new Contact ----------------------------------------------------------
function assignID() {
    if (contacts.length == 0) {
        return '0';
    }
    const USED_IDS = new Set(contacts.map(contact => parseInt(contact['id'])).filter(id => !isNaN(id)));
    let nextID = 0;

    while (USED_IDS.has(nextID)) {
        nextID++;
    }

    return nextID.toString();
}

// returns the Index from jason object by key value --------------------------------------------------------------------
function returnJsonIndex(json, key, value){
    for(let i = 0; i <json.length; i++){
        if(json[i][key] == value){
            return i;
        }
    }
}

// Input Elements clear n setValue -------------------------------------------------------------------
function clearInputFields(){
    element('inputName').value = "";
    element('inputMail').value = "";
    element('inputPhone').value = "";
}

function setInputValues(name, mail, phone){
    element('inputName').value = name;
    element('inputMail').value = mail;
    element('inputPhone').value = phone;
}

// set functions ---------------------------------------------------------------------------------
function removeAllColorClasses(id, setColor){
    for(let i = 1; i <= 15; i++){
        element(id).classList.remove(`variant` + i);
    }
    element(id).classList.add(setColor);
}

function unselectAllContacts() {
    let contactElements = document.querySelectorAll(".contact");

    // remove selectedContact from every contact
    for (var i = 0; i < contactElements.length; i++) {
        contactElements[i].classList.remove("selectedContact");
    }
}

function selectContact(id){
    element(id).classList.add("selectedContact");
}

//  Transition -----------------------------------------------------------------------------------------------
function getWidthForTransition(){
    let width = window.innerWidth * 0.1;
    let contactDataContainer = element('contactDataContainer').offsetWidth * 0.5;
    let informationContainer = element('informationContainer').offsetWidth * 0.5;
    let contactListContainer = element('contactListContainer').offsetWidth + 40;

    if(window.innerWidth >= 1250){
        return window.innerWidth * 1.1 - (contactListContainer + 232);
    }
    else if(window.innerWidth > 720){
        return window.innerWidth * 1.1 - contactListContainer;
    }
    else{
        return window.innerWidth * 1.1;
    } 
}

// -----------------------------------------------------------------------------------------------------------
function setInformationContainerPosition(){
    // offset heigth + height of the DataTextContainer + 50px distance 
    let height = element('contactDataHeadText').offsetTop + 73 + 50;
    let container = element('informationContainer');
    let width = window.innerWidth + window.innerWidth * 0.1;

    container.style.top = height;
    element('informationContainer').style.transform = `translateX(${width}px)`;
    
}

export { sortJson, getInitials, getValue, element, getColorNumber, assignID, returnJsonIndex, clearInputFields,setInputValues, 
    removeAllColorClasses, unselectAllContacts,selectContact, getWidthForTransition, setInformationContainerPosition };