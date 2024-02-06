import * as API from "./API_functions.js";
import * as VAR from '../variables.js';
import * as usc from '../classes/user.class.js';

let userdata;

/**
 *  resetUsers() is to remove before project is finished!
 */

VAR.registrationemail.addEventListener('input', () => {
    VAR.registrationemail.classList.remove('wronginput');
});

VAR.customcheckbox.addEventListener('click', () => {
    if (VAR.customcheckbox.checked) {
        VAR.submitbutton.disabled = false;
    } else {
        VAR.submitbutton.disabled = true;
    }
});

VAR.resistrationform.addEventListener('submit', (event) => {
    event.preventDefault();
    register();
});

async function resetUsers() {
    API.setUserData([new usc.default('guest', 'guest@guest.com', 'guest')]);
}

async function register() {
    await getUsers();
    if (!checkPassword()) {
        return
    }
    if (userExists()) {
        return;
    }
    let newuser = new usc.default(VAR.registrationname.value, VAR.registrationemail.value, VAR.passwordinput.value);
    userdata.push(newuser);
    API.setUserData(userdata);
    resetForm();
    backToLogin();
}

function userExists() {
    for (let user of userdata) {
        if (user['email'] == VAR.registrationemail.value) {
            VAR.registrationemail.classList.add('wronginput');
            userExistsInfo();
            return true;
        }
    }
    playAnimation();
    return false;
}

async function getUsers() {
    userdata = await API.getUserData();
}

function checkPassword() {
    if (VAR.passwordinput.value === VAR.passwordinputref.value) {
        return true;
    } else {
        VAR.wrongpasswordregister.classList.remove('d-none');
        VAR.passwordinputref.classList.add('wronginput');
        return false;
    }
}

function resetForm() {
    VAR.resistrationform.reset();
    resetInputandLogo();
}

function resetInputandLogo() {
    VAR.passwordlogo.src = "./assets/lock.svg";
    VAR.passwordlogoref.src = "./assets/lock.svg";
    VAR.passwordinput.type = 'password';
    VAR.passwordinputref.type = 'password';
    VAR.passwordinput.classList.remove('withinput', 'wronginput');
    VAR.passwordinputref.classList.remove('withinput', 'wronginput');
}

function userExistsInfo() {
    VAR.popupregister.innerHTML = 'User already exists';
    playAnimation();
    setTimeout(() => {
        VAR.popupregister.innerHTML = 'You Signed Up successfully';
    }, 5000);
}

function playAnimation() {
    VAR.popupregister.classList.remove('animation_stop');
    VAR.popupregister.classList.add('animation_play');
    setTimeout(() => {
        VAR.popupregister.classList.add('animation_stop');
        VAR.popupregister.classList.remove('animation_play');
    }, 4000);
}

function backToLogin() {
    VAR.signupcontainer.classList.remove('d-none');
    VAR.logincontainer.classList.remove('d-none');
    VAR.registrationframe.classList.add('d-none');
}