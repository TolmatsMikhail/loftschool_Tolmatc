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

var layoutContainer = document.querySelector('.layout_container');

var movable = true;

var thisFriendCard;

function getStartCoordinates(elem) {
    var thisFriendCardStartX = elem.getBoundingClientRect().left;
    var thisFriendCardStartY = elem.getBoundingClientRect().top;

    var coordinates = {
        x: thisFriendCardStartX,
        y: thisFriendCardStartY
    }

    return coordinates;
}
// Нажмем на список, выберем среди друзей одного из друзей. 
leftList.addEventListener('mousedown', function(e) {

    movable = true;

    thisFriendCard = findParent(e.target);

    thisFriendCard.style.position = 'fixed';



    // И будем таскать его по странице
    document.addEventListener('mousemove', function(e) {
        if(movable) {
            makeMovingBlock(e, thisFriendCard);
        }
    })

});

document.addEventListener('mouseup', function(e) {

    movable = false;


        // Где правый блок?? Куда будем помещать карточки друзей?

    var right_friends_container_coord = {
        fromTop : right_friends_container.offsetHeight,
        fromLeft : right_friends_container.offsetWidth
    }
    if(!thisFriendCard) return;

    thisFriendCard.style.position = 'static';
    thisFriendCard.style.left = 'initial';
    thisFriendCard.style.top = 'initial';


})



// Задаем координаты блока для перемещения относительно страничи
function makeMovingBlock(e, target) {

    target.style.left = e.pageX - 50 + 'px';
    target.style.top = e.pageY - 25 +'px';

    console.log(e);

}


// Ищем блок с классом one_friend.
function findParent(elem) {
    var elemParent;

    if (elem.classList.contains('one_friend')) {

        return elem;
    } else {
        elem = elem.parentNode;

        return findParent(elem);
    }
}


// (function() {
//     var a = document.querySelector('.friends_item_right');
//     console.log(a.clientY)
//     console.log(a.clientX)
// })()


var basket = document.getElementById('basket');
var basketCoord = basket.getBoundingClientRect();
console.log(basketCoord.top + ' Сверху');
console.log(basketCoord.right + ' Справа');
console.log(basketCoord.bottom + ' Снизу');
console.log(basketCoord.left + ' Слева');
