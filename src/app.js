import {createModal, isValid} from "./utils";
import {Question} from "./question";
import './styles.css'
import {authWithEmailAndPassword, getAuthForm} from "./auth";

const modalBtn = document.getElementById('modal-btn')
const form = document.getElementById('form')
const input = form.querySelector('#question-input')
const submit = form.querySelector('#submit')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submit.disabled = !isValid(input.value)
})
function submitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)){
        const question = {
            text: input.value,
            date: new Date().toJSON()
        }

        submit.disabled = true
        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            submit.disabled = false
        })
    }
}

function openModal() {
    createModal('Authorisation', getAuthForm())
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event){
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true
    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}


function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Error!', content)
    }
    else {
        createModal('List of questions', Question.listToHTML(content))
    }

}