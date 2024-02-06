const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const TOKEN = '8GKN7DASXMN9URAH8C1AKMG6H4H86G3N6JMVGLRB';
const key = "USERS";
const actualuserkey = "actualuser";
const taskskey = "TASKS";
const contactskey = "CONTACTS";

async function setUserData(data) {
    const payload = { key: key, value: JSON.stringify(data), token: TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getUserData() {
    const url = `${STORAGE_URL}?key=${key}&token=${TOKEN}`;
    let data = await fetch(url).then(res => res.json());
    return data = JSON.parse(data['data']['value']);
}

async function setActualUser(name) {
    let username = JSON.stringify(name);
    const payload = { key: actualuserkey, value: username, token: TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getActualUser() {
    const url = `${STORAGE_URL}?key=${actualuserkey}&token=${TOKEN}`;
    let data = await fetch(url).then(res => res.json());
    return data['data'];
}

async function setContacts(contacts) {
    let contactsarray = JSON.stringify(contacts);
    const payload = { key: contactskey, value: contactsarray, token: TOKEN};
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
        .then(res => res.json());
}

async function getContacts() {
    const url = `${STORAGE_URL}?key=${contactskey}&token=${TOKEN}`;
    let contacts = await fetch(url).then(res => res.json());
    return JSON.parse(contacts['data']['value']);
}

async function setTasks(tasks) {
    let tasksarray = JSON.stringify(tasks);
    const payload = { key: taskskey, value: tasksarray, token: TOKEN};
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
        .then(res => res.json());
}

async function getTasks() {
    const url = `${STORAGE_URL}?key=${taskskey}&token=${TOKEN}`;
    let tasks = await fetch(url).then(res => res.json());
    return JSON.parse(tasks['data']['value']);
}

export {setUserData, getUserData, setActualUser, getActualUser,  setContacts, getContacts, setTasks, getTasks};