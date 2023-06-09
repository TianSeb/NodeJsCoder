const socket = io()

// ----- Product Handler ----- //
socket.on('products', products => {
    makeHtmlTable(products).then(html => {
        document.getElementById('products-container').innerHTML = html
    })
})

function makeHtmlTable(products) {
    return fetch('views/productHistory.ejs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = ejs.compile(plantilla)
            const html = template({ products })
            return html
        })
}


// ----- ChatMessage Handler ----- //
const inputUserName = document.getElementById('inputUserName')
const inputMensaje = document.getElementById('inputMsg')
const btnEnviar = document.getElementById('btnEnviar')
const formPublicarMsg = document.getElementById('formPublicarMsg')
const msgBox = document.getElementById('msgBox')

socket.on('messages', data => {
    outputMsgs(data)
    msgBox.scrollTop = msgBox.scrollHeight
})

formPublicarMsg.addEventListener('submit', e => {
    e.preventDefault()
    console.log('msg sent')
    const data = {userEmail: inputUserName.value , msg: inputMensaje.value}
    socket.emit('msgSent', data)
    formPublicarMsg.reset()
    inputMensaje.focus()
})

inputUserName.addEventListener('input', () => {
    const emailTrue = inputUserName.value.length
    const msgTrue = inputMensaje.value.length
    inputMensaje.disabled = !emailTrue
    btnEnviar.disabled = !emailTrue || !msgTrue
})

inputMensaje.addEventListener('input', () => {
    const msgTrue = inputMensaje.value.length
    btnEnviar.disabled = !msgTrue
})


function outputMsgs(mensajes) {
    msgBox.innerHTML = ''
    mensajes.map(msg => {
        const div = document.createElement('div')
        div.classList.add('message')
        div.innerHTML = `
        <p class="meta">${msg.userEmail}</p>
        <p class="text">${msg.msg}</p>`
        msgBox.appendChild(div)
    })
}