
let serverURL = "https://glorious-giggle-jpq97j9xgxwcpxww-8000.app.github.dev/CS/"

let keysPressed = []

let url = new URL(window.location.href)
let params = url.searchParams

let user = {
    "Username":params.get("user"),
    "Password":params.get("pass")
}

if(user.Username == null || user.Password == null){
    alert("GET OUT")
}

window.addEventListener('keydown', (ev) => {

    let data = {
        "key":ev.key,
        "alt":ev.altKey,
        "ctrl":ev.ctrlKey,
        "shift":ev.shiftKey,
        "meta":ev.metaKey
    }

    let request = new XMLHttpRequest()
    request.open("POST", serverURL + "keys")
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify({
        "USERDATA":user,
        "data":data
    }))

})

window.addEventListener('mousemove', (ev) => {

    data = {
        "x":ev.clientX,
        "y":ev.clientY
    }

    let request = new XMLHttpRequest()
    request.open("POST", serverURL + "mousemove")
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify({
        "USERDATA":user,
        "data":data
    }))

})

window.addEventListener('mousedown', (ev) => {

    data = {
        "x":ev.clientX,
        "y":ev.clientY
    }

    let request = new XMLHttpRequest()
    request.open("POST", serverURL + "mousedown")
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify({
        "USERDATA":user,
        "data":data
    }))
    

})

function load(image){
    const base64Data = "data:image/png;base64," + image
    document.getElementById('image').src = base64Data
    document.getElementById('image').style.width = document.getElementsByTagName('html')[0].clientWidth
    document.getElementById('image').style.height = document.getElementsByTagName('html')[0].clientHeight
    document.getElementsByTagName('body')[0].style.position = 'fixed';
    document.getElementsByTagName('body')[0].style.top = 0
    document.getElementsByTagName('body')[0].style.left = 0
}


setInterval(() => {

    let request = new XMLHttpRequest()
    request.open("GET", serverURL + `getImage?user=${user['Username']}&pass=${user['Password']}`)
    request.send()
    request.onload = () => {
        load(request.response)
    }

}, 1000)