import * as VAR from "./variables.js";

let passwordlogin = false;
let passwordClicked = false;
let passwordRefClicked = false;

VAR.logobig.addEventListener('animationend', () => {
    VAR.logobig.classList.remove('animateLogo');
    VAR.logobig.classList.add('animated');
    VAR.logosmall.classList.remove('animateLogo-small');
    VAR.logosmall.classList.add('animatedLogo-small');
});

VAR.logosmall.addEventListener('animationend', () => {
    VAR.logobig.classList.remove('animateLogo');
    VAR.logobig.classList.add('animated');
    VAR.logosmall.classList.remove('animateLogo-small');
    VAR.logosmall.classList.add('animatedLogo-small');
});

VAR.signupbtn.addEventListener('click', () => {
    openResgistration();
});

VAR.arrow.addEventListener('click', () => {
    closeRegistration();
});

VAR.form_inputpassword.addEventListener('input', () => {
    togglePasswordVisibility(VAR.form_inputpassword, VAR.inputlogologin);
    checkInput(VAR.form_inputpassword, VAR.inputlogologin);
});

VAR.inputlogologin.addEventListener('click', () => {
    passwordlogin = true;
    togglePasswordVisibility(VAR.form_inputpassword, VAR.inputlogologin, passwordlogin);
});

VAR.passwordinput.addEventListener('input', () => {
    togglePasswordVisibility(VAR.passwordinput, VAR.passwordlogo);
    checkInput(VAR.passwordinput, VAR.passwordlogo);
});

VAR.passwordlogo.addEventListener('click', () => {
    passwordClicked = true;
    togglePasswordVisibility(VAR.passwordinput, VAR.passwordlogo, passwordClicked);
});

VAR.passwordinputref.addEventListener('input', () => {
    togglePasswordVisibility(VAR.passwordinputref, VAR.passwordlogoref);
    checkInput(VAR.passwordinputref, VAR.passwordlogoref);
    VAR.wrongpasswordregister.classList.add('d-none');
    VAR.passwordinputref.classList.remove('wronginput');
});

VAR.passwordlogoref.addEventListener('click', () => {
    passwordRefClicked = true;
    togglePasswordVisibility(VAR.passwordinputref, VAR.passwordlogoref, passwordRefClicked);
});

function openResgistration() {
    VAR.signupcontainer.classList.add('d-none');
    VAR.logincontainer.classList.add('d-none');
    VAR.registrationframe.classList.remove('d-none');
    VAR.extra.classList.add('d-none');
}

function closeRegistration() {
    VAR.signupcontainer.classList.remove('d-none');
    VAR.logincontainer.classList.remove('d-none');
    VAR.registrationframe.classList.add('d-none');
    VAR.extra.classList.remove('d-none');
}

function togglePasswordVisibility(input, logo, clicked) {
    if (clicked && input.value !== '') {
        input.type = input.type === 'password' ? 'text' : 'password';
        logo.src = input.type === 'password' ? './assets/visible_off.svg' : './assets/visible_on.svg';
    }
}

function checkInput(input, logo) {
    if (input.value !== '') {
        logo.src = './assets/visible_off.svg';
        input.classList.add('withinput');
    } else if (input.value === '') {
        logo.src = './assets/lock.svg';
        input.type = 'password';
        input.classList.remove('withinput');
    }
}