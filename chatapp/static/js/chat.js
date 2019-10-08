const socket = io();

let $formInput;
let $formButton;
let $sendLocationButton;
let $messages;
let $sidebar;

let chatMessageTemplate;
let locationTemplate;
let sidebarTemplate;

let {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

document.addEventListener('submit', function(event) {
    event.preventDefault();
    formText = document.getElementById('input').value;
    
    disableElement($formButton);
    socket.emit('sendMessage', formText, () => {
        console.log('Message delivered!');
        enableElement($formButton);
        $formInput.value = '';
        $formInput.focus();
    });
});
document.addEventListener('DOMContentLoaded', function() {
    locateElements();

    addEventListenerForSendLocation();
});

function locateElements() {
    $formInput = document.getElementById("input");
    $formButton = document.getElementById("formButton");
    $sendLocationButton = document.getElementById("send-location");
    $messages = document.getElementById('messages');
    $sidebar = document.getElementById('sidebar');
    chatMessageTemplate = document.getElementById('chat-message').innerHTML;
    locationTemplate = document.getElementById('location-link').innerHTML;
    sidebarTemplate = document.getElementById('sidebar-template').innerHTML;
}

function addEventListenerForSendLocation() {
    $sendLocationButton.addEventListener('click', () => {
        if (! navigator.geolocation)
            return alert('Geolocation unavailable');
        
        disableElement($sendLocationButton);
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
    
            socket.emit('send-location', {long, lat}, () => {
                console.log('location shared!');
                enableElement($sendLocationButton);
            });
        });
    });
}

// respond to socket message
socket.on('message', (msg) => {
    let html = Mustache.render(chatMessageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('HH:mm:ss')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});
socket.on('locationMessage', (msg) => {
    let html = Mustache.render(locationTemplate, {
        username: msg.username,
        url: msg.url,
        createdAt: moment(msg.createdAt).format('HH:mm:ss')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});
socket.on('roomData', (roomData) => {
    let html = Mustache.render(sidebarTemplate, roomData);
    $sidebar.innerHTML = html;  
});

// utility
function disableElement(elem) {
    elem.setAttribute('disabled', 'disabled');
}
function enableElement(elem) {
    elem.removeAttribute('disabled');
}
function autoscroll() {
    if (wasChatScrolledToBottomBeforeLatestMessage()) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}
function wasChatScrolledToBottomBeforeLatestMessage() {
    let $newMessage = $messages.lastElementChild;
    let newMessageHeight = getElementHeight($newMessage);
    let visibleHeight = $messages.offsetHeight;

    let totalHeightBeforeLastMessage = $messages.scrollHeight - newMessageHeight;
    let scrollOffset = Math.ceil($messages.scrollTop + visibleHeight);

    return totalHeightBeforeLastMessage <= scrollOffset;
}
function getElementHeight(element) {
    let elementStyle = getComputedStyle(element);
    return element.offsetHeight + parseInt(elementStyle.marginBottom, 10) + parseInt(elementStyle.marginTop, 10);
}

socket.emit('join', {username, room}, (error) => {
    if (!error) return;

    alert(error.error);
    location.href = '/';
});