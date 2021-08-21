let form = document.querySelector('#form-element')
let container = document.querySelector('#container')
let inputField = document.querySelector("#inputField")
let username

let socket = io()

//receiving session username from server
socket.on('Username', function(data) {
    username = data.username
})

socket.on('MessageFromServer', function(data) {
    let ourHTML = `
    <div class="chat-message">
        <div class='message-text'>${data.joinMessage}</div><div class='body'>joined the chat.</div>
        <div class="date">${new Date().toLocaleString()}</div>
    </div>
    `
    container.insertAdjacentHTML("beforeend", ourHTML)
    container.scrollTop = container.scrollHeight
})

socket.on('ResponseFromServer', function(data) {
    let serverHTML = `
    <div class="chat-message">
        <div class='message-text'>${data.username}</div><div class='body'>${data.text}</div>
        <div class="date">${new Date().toLocaleString()}</div>
    </div>
    `
    container.insertAdjacentHTML("beforeend", serverHTML)
    container.scrollTop = container.scrollHeight
})

form.addEventListener("submit", function(e) {
    e.preventDefault()
    socket.emit('MessageFromBrowser', {text: inputField.value, date: new Date().toLocaleString()})
    let ourHTML = `
    <div class="chat-message">
        <div class='message-text'>${username}</div><div class='body'>${inputField.value}</div>
        <div class="date">${new Date().toLocaleString() }</div>
    </div>
    `
    if (!inputField.value == "") {
        container.insertAdjacentHTML("beforeend", ourHTML)
        container.scrollTop = container.scrollHeight
        inputField.value = ""
        inputField.focus()
    } else {
        console.log("Failed.")
    }
})
