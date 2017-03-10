require('./index.css');
// 5901122
// Все на промисах (каждый запрос), т.к. на каждой стадии запроса что-то может пойти не так

var loadFriends = document.querySelector('#loadFriends');
var leftList = document.querySelector('.friends_item_left_inner');
var rightList = document.querySelector('.friends_item_right_inner');
var leftSearchInput = document.querySelector('.friends_item_search_left_input');
var rightSearchInput = document.querySelector('.friends_item_search_right_input');

var leftFriendsCounter = document.querySelector('#leftFriendsCounter');
var rightFriendsCounter = document.querySelector('#rightFriendsCounter');

// Инициализация приложения и проверка - разрешили нам или нет
function login() {
    return new Promise(function (resolve, reject) {
        // Инициализщируем API
        VK.init({
            apiId: 5901122
        })
        // Логинимся ВК. Если ОК, то resolve();
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

    var sortedFriends = friends.sort(sortingById);

    return templateFn({
        friends: sortedFriends
    });
}

function sortingById(a, b) {
    if (a.id > b.id) return 1;
    if (a.id < b.id) return -1;
}
// Эта функция запустится, когда шаблон с друзьями уже отработал, есть друзья с классами. 
// Делаем каждый элемент "двигательным"(или двигаемым, как сказать-то) путем задания ему
// draggable='true"
function setElementDraggable(elem) {
    var whereToInsert = document.querySelector(elem);
    var draggableElements = whereToInsert.querySelectorAll('.one_friend');

    for (var i = 0; i < draggableElements.length; i++) {
        draggableElements[i].setAttribute('draggable', 'true');
        draggableElements[i].setAttribute('ondragstart', 'drag(event)');
        draggableElements[i].setAttribute('id', i)
        draggableElements[i].setAttribute('ondrop', 'false')
    }
}



var allfriends;

var allfriendsRight = [];

loadFriends.addEventListener('click', function() {
    // Открывает окно с друзьями
    document.querySelector('.layout').classList.remove('hidden');
    rightList.innerHTML = null;
    login()
        .then(
            () => getFriends('friends.get', { v: 5.62,fields: ['city', 'country', 'photo_100', 'user_id', 'order: random'] })
        )
        .then(
            (result) => {
                leftList.innerHTML = createFriendsDiv(result.items);
                allfriends = result.items;
                leftFriendsCounter.innerHTML = allfriends.length;
                rightFriendsCounter.innerHTML = allfriendsRight.length;
            }
        )
        .then(
            () => setElementDraggable('.friends_item_left_inner')
        )
})
/*
document.addEventListener('click', function(e){
    if(e.target.classList.contains('layout_container_close') || e.target.getAttribute('src') == 'img/cross.png') {
        // Закрывает окно с друзьями
        document.querySelector('.layout').classList.remove('hidden');
    }
})
*/
// Ищем блок - родитель с классом one_friend.
function findParent(elem, classToFind) {
    if (elem.classList.contains(classToFind)) {

        return elem;
    }

    elem = elem.parentNode;

    return findParent(elem, classToFind);
}

// Функция для фильтрации, например. Совпадающий элемент удалим из массива
function removeElementFromFriendsList(arr, i) {
    allfriendsRight.unshift(arr[i]);
    return arr.splice(i, 1);
}

// Функция для фильтрации, например. Совпадающий элемент удалим из массива
function removeElementFromFriendsListRight(arr, i) {
    allfriends.unshift(arr[i]);
    return arr.splice(i, 1);
}

// Установка атрибутов id для элементов
function setId(arr) {
    for(var i = 0; i < arr.length; i++) {
        arr[i].setAttribute('id', i);
    }
}



// На "драггабельном" элементе вызываем функцию, которая 
// будет получать данные об этом элементе. Такой уж стандарт HTML5 drag-n-drop
window.drag = function(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}

window.drop = function(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData('text');

    ev.target.appendChild(document.getElementById(data));

    removeElementFromFriendsList(allfriends, data);

    

    leftList.innerHTML = createFriendsDiv(allfriends);

    setElementDraggable('.friends_item_left_inner');

    

    rightList.innerHTML = createFriendsDiv(allfriendsRight);

    leftFriendsCounter.innerHTML = allfriends.length;
    rightFriendsCounter.innerHTML = allfriendsRight.length;


    setId(rightList.children);
    setId(leftList.children);   
}

window.allowDrop = function(ev) {
    ev.preventDefault();
}

var inputFilterLeft = document.querySelector('.friends_item_search_left_input');
var inputFilterRight = document.querySelector('.friends_item_search_right_input');

// Клик по плюсику - из левой колонки переносим карточку элементу в правую колонку
leftList.addEventListener('click', leftPlusClick);

function leftPlusClick(e) {

    // Если target содержит класс нашей картинки или класс блока, в котором эта картинка
    if (e.target.classList.contains('one_friend_item_plus') || e.target.classList.contains('one_friend_item_plus_image')) {

        // ищем id кликнутого элемента(точнее родителя). id каждый раз переписывается!! так что номер 
        // элемента в массиве соответствует id. Ураа!! хех :-)
        var removedFromLeftNumber = findParent(e.target, 'one_friend').id;

        // Удаляем кликнутый элемент из массива друзей СЛЕВА
        removeElementFromFriendsList(allfriends, removedFromLeftNumber)

        // Заполняем левую часть по шаблону из получившегося нового массива объектов
        
        leftList.innerHTML = createFriendsDiv(allfriends);

        // На каждом заполнении мы будем назначать обработчики для drag-n-drop для элементов
        // Левой колонки
        setElementDraggable('.friends_item_left_inner');

        // В правую будет помещать опять ж создаваемый шаблон на основе удаленных элементов.
        
        rightList.innerHTML = createFriendsDiv(allfriendsRight);

        // Установить id кадому элементу
        setId(rightList.children);
        setId(leftList.children);

        leftFriendsCounter.innerHTML = allfriends.length;
        rightFriendsCounter.innerHTML = allfriendsRight.length;    

    } else {
        return;
    }
}

// Клик по крестику в правой колонке - будем удалять из правой, перемещать в левую
rightList.addEventListener('click', rightCossClick);

function rightCossClick(e) {
    if (e.target.classList.contains('one_friend_item_plus') || e.target.classList.contains('one_friend_item_plus_image')) {    

        // ищем id кликнутого элемента(точнее родителя). id каждый раз переписывается!! так что номер 
        // элемента в массиве соответствует id. Ураа!! хех :-)
        var removedFromRightNumber = findParent(e.target, 'one_friend').id;

        // Удаляем кликнутый элемент из массива друзей СПРАВА
        removeElementFromFriendsListRight(allfriendsRight, removedFromRightNumber);

        // Заполняем левую часть по шаблону из получившегося нового массива объектов
        
        leftList.innerHTML = createFriendsDiv(allfriends);

        setElementDraggable('.friends_item_left_inner');

        // Заполняем правую часть по шаблону из получившегося нового массива объектов
        
        rightList.innerHTML = createFriendsDiv(allfriendsRight);



        leftFriendsCounter.innerHTML = allfriends.length;
        rightFriendsCounter.innerHTML = allfriendsRight.length;

        setId(rightList.children);
        setId(leftList.children);

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

var layout_container_bottom_save = document.querySelector('.layout_container_bottom_save');




inputFilterLeft.addEventListener('keyup', function() {

    if(inputFilterLeft.value == '') {      
          
        leftList.innerHTML = createFriendsDiv(allfriends);


        setElementDraggable('.friends_item_left_inner');

        setId(rightList.children);
        setId(leftList.children);

        leftFriendsCounter.innerHTML = allfriends.length;

        return;
    }

    var newFilteredArrayLeft = []

    for(var i = 0; i < allfriends.length; i++) {
        if(isMatching(allfriends[i].first_name + ' ' + allfriends[i].last_name, inputFilterLeft.value)) {
            newFilteredArrayLeft.push(allfriends[i]);
        }
    }
    
    leftList.innerHTML = createFriendsDiv(newFilteredArrayLeft);

    setElementDraggable('.friends_item_left_inner');

    setId(rightList.children);
    setId(leftList.children);

    leftFriendsCounter.innerHTML = newFilteredArrayLeft.length;

})

inputFilterRight.addEventListener('keyup', function() {

    if(inputFilterRight.value == '') {
        
        rightList.innerHTML = createFriendsDiv(allfriendsRight);

        setElementDraggable('.friends_item_left_inner');

        setId(rightList.children);
        setId(leftList.children);

        rightFriendsCounter.innerHTML = allfriendsRight.length;

        return;
    }

    var newFilteredArrayRight = []

    for(var i = 0; i < allfriendsRight.length; i++) {
        if(isMatching(allfriendsRight[i].first_name + ' ' + allfriendsRight[i].last_name, inputFilterRight.value)) {
            newFilteredArrayRight.push(allfriendsRight[i]);
        }
    }
    rightList.innerHTML = createFriendsDiv(newFilteredArrayRight);

    setElementDraggable('.friends_item_left_inner');

    setId(rightList.children);
    setId(leftList.children);

    rightFriendsCounter.innerHTML = newFilteredArrayRight.length;
})

layout_container_bottom_save.addEventListener('click', function(e) {
    e.preventDefault();
    var data = {
        arrayLeft: allfriends,
        arrayRight: allfriendsRight
    }

    
    localStorage.myFriends = JSON.stringify(data);

})

window.addEventListener('load', function() {
    // console.log(JSON.parse(localStorage.myFriends));
    if(localStorage.length > 0) {

        leftList.innerHTML = createFriendsDiv(JSON.parse(localStorage.myFriends).arrayLeft);
        rightList.innerHTML = createFriendsDiv(JSON.parse(localStorage.myFriends).arrayRight);
        leftFriendsCounter.innerHTML = JSON.parse(localStorage.myFriends).arrayLeft.length;
        rightFriendsCounter.innerHTML = JSON.parse(localStorage.myFriends).arrayRight.length;
    }
})