import * as API from "./API_functions.js";
import * as VAR from '../variables.js';

window.addEventListener('DOMContentLoaded', getRememberMe());

VAR.form.addEventListener('submit', (event) => {
    isUser();
    event.preventDefault();
});

VAR.getemail.addEventListener('input', () => {
    removeWronginput();
});

VAR.getpassword.addEventListener('input', () => {
    removeWronginput();
});

VAR.guestbtn.addEventListener('click', () => {
    setUserGuest();
})

function loadMain() {
    window.open('./main/main.html', '_self');
}

async function setUserGuest() {
    removeRememberme();
    await API.setActualUser('Guest');
    loadMain();
}

async function isUser() {
    const users = await API.getUserData();
    for (let user of users) {
        checkEmail(user);
    }
    return;
}

async function rightUser(user) {
    await API.setActualUser(user['name']);
    checkOnrememberme();
    VAR.form.reset();
    loadMain();
}

function checkEmail(user) {
    if(VAR.getemail.value == user['email']) {
        checkPassword(user);
    }
}

function checkPassword(user) {
    if(VAR.getpassword.value === user['password']) {
        rightUser(user);
        return
    }
    wrongUser();
}

function wrongUser() {
    VAR.getpassword.classList.add('wronginput');
    VAR.getpassword.classList.remove('withinput');
    VAR.wrongpassword.classList.remove('d-none');
    resetInput();
    VAR.getpassword.value = '';
}

function resetInput() {
    VAR.inputlogologin.src = './assets/lock.svg';
    VAR.getpassword.type = 'password';
    VAR.getpassword.classList.remove('withinput');
}

function removeWronginput() {
    VAR.getpassword.classList.remove('wronginput');
    VAR.wrongpassword.classList.add('d-none');
}

/** Only working when log in is successful */
function checkOnrememberme() {
    if (VAR.remembermebox.checked) {
        setRememberMe();
    } else {
        removeRememberme();
    }
}

function setRememberMe() {
    localStorage.setItem('email', JSON.stringify(VAR.getemail.value));
    localStorage.setItem('password', JSON.stringify(VAR.getpassword.value));
}

function getRememberMe() {
    if (localStorage.getItem('email') && localStorage.getItem('password')) {
        VAR.getemail.value = JSON.parse(localStorage.getItem('email'));
        VAR.getpassword.value = JSON.parse(localStorage.getItem('password'));
        VAR.remembermebox.checked = true;
        VAR.inputlogologin.src = './assets/visible_off.svg';
    }
}

function removeRememberme() {
    localStorage.clear();
    VAR.remembermebox.checked = false;
}