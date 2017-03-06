require('./index.css');
// 5901122
// Все на промисах (каждый запрос), т.к. на каждой стадии запроса что-то может пойти не так

var loadFriends = document.querySelector('#loadFriends');
var leftList = document.querySelector('.friends_item_left_inner');
var rightList = document.querySelector('.friends_item_right_inner');

// Инициализация приложения и проверка - разрешили нам или нет
function login() {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 5901122
        })
        VK.Auth.login(function(result) {
            if (result.status == 'connected') {
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
            if (result.error) {
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

function setElementDraggable() {
    var draggableElements = document.querySelectorAll('.one_friend');

    for (var i = 0; i < draggableElements.length; i++) {
        draggableElements[i].setAttribute('draggable', 'true');
        draggableElements[i].setAttribute('ondragstart', 'drag(event)');
        draggableElements[i].setAttribute('id', i+1)
        draggableElements[i].setAttribute('ondrop', 'false')
    }
}

window.drag = function(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}

window.drop = function(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData('text');

    ev.target.appendChild(document.getElementById(data));
}

window.deleteFriend = function(ev) {
    ev.preventDefault();

    var data = ev.dataTransfer.getData('text');

    return new Promise(function(resolve, reject) {
        VK.Api.call('friends.delete', {user_id: 394404856} , function(result) {
            console.log(result)
        })
    })
}

window.allowDrop = function(ev) {
    ev.preventDefault();
}


loadFriends.addEventListener('click', function() {
    login()
        .then(
            () => getFriends('friends.get', { v: 5.62,fields: ['city', 'country', 'photo_100', 'user_id', 'order: random'] })
        )
        .then(
            (result) => leftList.innerHTML = createFriendsDiv(result.items)
        )
        .then(
            () => setElementDraggable()
        )
})

var leftSearchInput = document.querySelector('.friends_item_search_left_input');
var rightSearchInput = document.querySelector('.friends_item_search_right_input');

// Ищем блок - родитель с классом one_friend.
function findParent(elem, classToFind) {
    if (elem.classList.contains(classToFind)) {

        return elem;
    }

    elem = elem.parentNode;

    return findParent(elem, classToFind);

}
// Клик по плюсику - из левой колонки переносим карточку элементу в правую колонку
leftList.addEventListener('click', leftPlusClick);

function leftPlusClick(e) {
    // Если target содержит класс нашей картинки или класс блока, в котором эта картинка
    if (e.target.classList.contains('one_friend_item_plus') || e.target.classList.contains('one_friend_item_plus_image')) {
        rightList.appendChild(findParent(e.target, 'one_friend')) // .one_friend
    } else {
        return;
    }
}
// Клик по крестику в правой колонке - будем удалять из правой, перемещать в левую
rightList.addEventListener('click', rightCossClick);

function rightCossClick(e) {
    if (e.target.classList.contains('one_friend_item_plus') || e.target.classList.contains('one_friend_item_plus_image')) {
        // Возврат в список будет в начало этого списка, а не в конец как через appendChild
        // Пока я не понл как возвращать элементы именно на свое место.. 
        // можно как-то по id, т.к. каждому я присвоил свой номер в виде id..хм..
        leftList.insertBefore(findParent(e.target, 'one_friend'), leftList.children[0])    
    } else {
        return;
    }
}

// Функция поиска совпадений по части слова
function isMatching(what, where) {

    var whatEqual = what.toLowerCase();
    var whereEqual = where.toLowerCase();

    var matchValue = whatEqual.indexOf(whereEqual);

    if (matchValue > -1) {
        return true;
    }

    return false;
}
// Функция поиска по имени или фамилии в левой колонке
leftSearchInput.addEventListener('keyup', function(e) {
    e.preventDefault();
    var counter = 0;

    var friendsItem = document.querySelectorAll('.friends_item_left_inner .one_friend');

    for (var i = 0; i < friendsItem.length; i++) {
        if (!isMatching(friendsItem[i].innerText, leftSearchInput.value)) {
            friendsItem[i].style.display = 'none';
        } else {
            friendsItem[i].style.display = 'block';
            counter = counter + 1;
        }
    }
})
// Функция поиска по имени или фамилии в правой колонке
rightSearchInput.addEventListener('keyup', function(e) {
    e.preventDefault();

    var counter = 0;
    var friendsItem = document.querySelectorAll('.friends_item_right_inner .one_friend');

    for (var i = 0; i < friendsItem.length; i++) {
        if (!isMatching(friendsItem[i].innerText, rightSearchInput.value)) {
            friendsItem[i].style.display = 'none';
        } else {
            friendsItem[i].style.display = 'block';
            counter = counter + 1;
        }
    }
})

