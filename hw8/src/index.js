require('./index.css');
/*
function callAPI(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, function(result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    });
}
*/
// var friendsList = document.querySelector('#friends');
// var loadFriends = document.querySelector('#loadFriends');

// loadFriends.addEventListener('click', () => {
//     login()
//         .then(() => callAPI('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100'] }))
//         .then(result => friendsList.innerHTML = createFriendsDiv(result.items))
//         .then(() => loadFriends.parentNode.removeChild(loadFriends))
//         .catch(() => alert('всё плохо'));
// });

// 5901122
// Все на промисах (каждый запрос), т.к. на каждой стадии запроса что-то может пойти не так

var loadFriends = document.querySelector('#loadFriends');
var leftList = document.querySelector('.friends_item_left_inner');
// Инициализация приложения и проверка - разрешили нам или нет
function login() {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 5901122
        })
        VK.Auth.login(function(result) {
            if(result.status == 'connected') {
                resolve();
            } else {
                reject(result.error);
            }
        })
    })
}

// Тут мы запрашиваем каким-то методом какие-то параметры.
function getFriends(method, params) {
    return new Promise(function(resolve, reject) {
        VK.Api.call(method, params, function(result) {
            if(result.error) {
                reject(result.error);
            } else {
                resolve(result.response);
            }
        })
    })
}
// Тут создаем DIV с другом. Берем шаблон через require
// Возвращаем шаблон. В handlebars передается объект, который можно крутить через синтаксис
// hbs = {{#each ПАРАМЕТР-объект}}
function createFriendsDiv(friends) {
    var templateFn = require('../../friend-template.hbs');

    return templateFn({
        friends: friends
    });
}

loadFriends.addEventListener('click', function() {
    login()
        .then(
            () => getFriends('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100'] })
        )
        .then(
            (result) => leftList.innerHTML = createFriendsDiv(result.items)
        )
        .catch(
            () => alert('Что-то пошло не так - ' + result.error)
        )
})

var left_friends_container = document.querySelector('.friends_item_left');
var left_friends = left_friends_container.querySelectorAll('.one_friend');


var right_friends_container = document.querySelector('.friends_item_right');


// var test = document.querySelector('#test');

// function me(){
//     var left_friends_container = document.querySelector('.friends_item_left');
//     var left_friends = left_friends_container.querySelectorAll('.one_friend');

//     console.log(left_friends_container);
//     console.log(left_friends);
// }

// test.addEventListener('click', me);

leftList.addEventListener('click', function(e) {
    
    var a = findParent(e.target);
    // Тот самый нужный элемент
    console.log(a)

    // addListeners(thisElement);


});

function findParent(elem) {
    var elemParent;

    if (elem.classList.contains('one_friend')) {
        console.log('111111');

        return elem;
    } else {
        console.log('22222')
        elem = elem.parentNode;

        return findParent(elem);
    }
}

function addListeners(target) {
    var isMovable = false;

    target.addEventListener('mousedown', function(e) {
        
        isMovable = true;
    })

    target.addEventListener('mouseup', function(e) {
        isMovable = false;
    })

    document.addEventListener('mousemove', function(e) {
        if(isMovable) {
            makeMovingBlock(e, target);
        }
    })
}

function makeMovingBlock(e, target) {

    target.style.left = e.pageX - target.offsetWidth / 2 + 'px';
    target.style.top = e.pageY - target.offsetHeight / 2 + 'px';
}