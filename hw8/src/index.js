require('./index.css');
// id моего приложения - 5901122
// Кнопка "загрузить всех друзей"
var loadFriends = document.querySelector('#loadFriends');
// Список друзей слева
var leftList = document.querySelector('.friends_item_left_inner');
// Список друзей справа
var rightList = document.querySelector('.friends_item_right_inner');
// Левый инпут для фильтрации
var inputFilterLeft = document.querySelector('.friends_item_search_left_input');
// Правый инпут для фильтрации
var inputFilterRight = document.querySelector('.friends_item_search_right_input');
// Счетчик друзей слева
var leftFriendsCounter = document.querySelector('#leftFriendsCounter');
// Счетчик друзей справа
var rightFriendsCounter = document.querySelector('#rightFriendsCounter');
// Массив друзей для отображения слева
var allfriends;
// Массив дрпузей для отображения справа
var allfriendsRight = [];
// Кнопка "сохранить" - сохранить состояние в localStorage
var layoutContainerBottomSave = document.querySelector('.layout_container_bottom_save');
// Кнопка очистки LocalStorage
var cleanLocalStorage = document.querySelector('.cleanLocalStorage');

// Инициализация приложения и проверка - разрешили нам или нет залогиниться
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

// Универсальная функция обращения к VK api указанным методом с указанными параметрами. Надо смотреть в VK api
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
    // На всякий случай сортируем друзей по их id вконтакте
    var sortedFriends = friends.sort(sortingById);

    return templateFn({
        friends: sortedFriends
    });
}

// Функция сортировки друзей при возвращении шаблона. Для функции выше
function sortingById(a, b) {
    if (a.id > b.id) {
        return 1
    }
    if (a.id < b.id) {
        return -1
    }
}

// Часто придется искать элемент с классом  .one_friend, поэтому
// Пишем универсальную функцию поиска родительского элемента с указанным классом. 
// Через рекурсию.
function findParent(elem, classToFind) {
    if (elem.classList.contains(classToFind)) {

        return elem;
    }

    elem = elem.parentNode;

    return findParent(elem, classToFind);
}

/* К сожалению, еще не понял как создать универсальную для обоих случаев. см. наверх*/
// Функция для фильтрации массива. Совпадающий элемент удалим из массива
function moveElementFromArr1ToArr2(fromArr, toArr, equall) {
    for(var i = 0; i < fromArr.lengthl; i++) {
        if(equall == 'me'+fromArr[i].id) {           
            toArr.unshift(fromArr[i])
            fromArr.splice(i, 1);
        }
    }
}
// Функция для фильтрации, например. Совпадающий элемент удалим из массива


// Генерация keyup 
function eventGenerate(eventName, onElement) {
    var newEvent = new Event(eventName);
    onElement.dispatchEvent(newEvent);
}
/*
    Три функции для drag-n-drop
*/

// На "драггабельном" элементе вызываем функцию, которая 
// будет получать данные об этом элементе. Такой уж стандарт HTML5 drag-n-drop
window.drag = function(ev) {
    console.log(ev.target.id)
    ev.dataTransfer.setData('text', ev.target.id);
}

window.drop = function(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData('text');

    ev.target.appendChild(document.querySelector('#' + data + ''));

    // Удаление из левой колонки элемента с id, перетаскиваем направо
    for(var i = 0; i < allfriends.length; i++) {
        if(data == 'me'+allfriends[i].id) {
            allfriendsRight.unshift(allfriends[i])
            allfriends.splice(i,1);
        }
    }

    leftList.innerHTML = createFriendsDiv(allfriends);
    rightList.innerHTML = createFriendsDiv(allfriendsRight);
    leftFriendsCounter.innerHTML = allfriends.length;
    rightFriendsCounter.innerHTML = allfriendsRight.length;

    // Чтобы поисковые данные не терялись - генерируем нажатие кнопки
    eventGenerate('keyup', inputFilterLeft);
    eventGenerate('keyup', inputFilterRight);
}

window.allowDrop = function(ev) {
    ev.preventDefault();
}

// Функция поиска совпадений по части слова в строке. Пригодится для фильтрации.
function isMatching(what, where) {

    var whatEqual = what.toLowerCase();
    var whereEqual = where.toLowerCase();

    var matchValue = whatEqual.indexOf(whereEqual);

    if (matchValue > -1) {
        return true;
    }

    return false;
}

// По клику на кнопку "загрузить всех друзей" выполняем последовательность действий
loadFriends.addEventListener('click', function() {
    // Открывает окно с друзьями
    document.querySelector('.layout').classList.remove('hidden');
    // Чистим левый список. Это на случай загрузки друзей из localStorage
    rightList.innerHTML = null;
    // Логинимся
    login()
        .then(
            // Запрашиваем список друзей 
            () => getFriends('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100', 'user_id', 'order: random'] })
        )
        .then(
            // С полученным результатом - объектом наполняем левую колонку блоками с друзьями.
            (result) => {
                leftList.innerHTML = createFriendsDiv(result.items);
                allfriends = result.items;
                // И заполняем счетчики друзей слева и справа
                leftFriendsCounter.innerHTML = allfriends.length;
                rightFriendsCounter.innerHTML = allfriendsRight.length;
            }
        )
})

document.addEventListener('click', function(e) {
    // Кликнули по картинке-крестику или его родителю?
    if (e.target.classList.contains('layout_container_close') || e.target.getAttribute('src') == 'img/cross.png') {
        // Закрывает окно с друзьями
        document.querySelector('.layout').classList.add('hidden');
    }
})

// Обработчики кликов по клюсику слева/крестику справа.
// НОВАЯ ПЕРЕДЕЛКА ПОСЛЕ КОММЕНТАРИЕВ НАСТИ
leftList.addEventListener('click', func);
rightList.addEventListener('click', func);

function func(e) {
    e.preventDefault()
    // Откуда удаляем
    var deleteFrom;
    // Куда помещаем
    var insertTo;
    // Кого перемещаем
    var whoMove;
    var leftlistfriends = leftList;
    var rightlistfriends = rightList;

    if (e.target.classList.contains('one_friend_item_plus') || e.target.classList.contains('one_friend_item_plus_image')) {
        if (findParent(e.target, 'friends_inner').id == 'friends_item_left_inner_block') {
            whoMove = findParent(e.target, 'one_friend').id;
            deleteFrom = allfriends;
            insertTo = allfriendsRight;
        }
        else if (findParent(e.target, 'friends_inner').id == 'friends_item_right_inner_block') {
            whoMove = findParent(e.target, 'one_friend').id;
            deleteFrom = allfriendsRight;
            insertTo = allfriends;
            leftlistfriends = rightList;
            rightlistfriends = leftList;
        } 
        for(var i = 0; i < deleteFrom.length; i++) {
            if(whoMove == 'me'+deleteFrom[i].id) {
                insertTo.unshift(deleteFrom[i]);
                deleteFrom.splice(i, 1);
            }
        }

        leftlistfriends.innerHTML = createFriendsDiv(deleteFrom);
        rightlistfriends.innerHTML = createFriendsDiv(insertTo);

        leftFriendsCounter.innerHTML = allfriends.length;
        rightFriendsCounter.innerHTML = allfriendsRight.length;

        eventGenerate('keyup', inputFilterRight);
        eventGenerate('keyup', inputFilterLeft);  
    }
}

// Фильтрации в левом инпуте по нажатию на кнопку. Точнее, по ее "отпусканию" после нажатия
inputFilterLeft.addEventListener('keyup', function() {
    // Если в фильтре ничего нет или мы все удалили
    if (inputFilterLeft.value == '') {      
        // Левый список наполняется друзьями
        leftList.innerHTML = createFriendsDiv(allfriends);
        leftFriendsCounter.innerHTML = allfriends.length;

        return;
    }
    // А если нет, то вот новый массив, куда будет складывать совпадения с введенным значением в инпуте
    var newFilteredArrayLeft = [];

    for (var i = 0; i < allfriends.length; i++) {
        // Если совпадение есть
        if (isMatching(allfriends[i].first_name + ' ' + allfriends[i].last_name, inputFilterLeft.value)) {
            // Поместим в новый массив 
            newFilteredArrayLeft.push(allfriends[i]);
        }
    }
    // С новым массивом выведем список
    leftList.innerHTML = createFriendsDiv(newFilteredArrayLeft);
    leftFriendsCounter.innerHTML = newFilteredArrayLeft.length;

})

inputFilterRight.addEventListener('keyup', function() {

    if (inputFilterRight.value == '') {
        
        rightList.innerHTML = createFriendsDiv(allfriendsRight);
        rightFriendsCounter.innerHTML = allfriendsRight.length;

        return;
    }

    var newFilteredArrayRight = []

    for (var i = 0; i < allfriendsRight.length; i++) {
        if (isMatching(allfriendsRight[i].first_name + ' ' + allfriendsRight[i].last_name, inputFilterRight.value)) {
            newFilteredArrayRight.push(allfriendsRight[i]);
        }
    }
    rightList.innerHTML = createFriendsDiv(newFilteredArrayRight);
    rightFriendsCounter.innerHTML = newFilteredArrayRight.length;
})

// По клику на кнопку "сохранить" - запишем состояние в localStorage. 
// На самом деле запишем туда массивы объектов друзей, чтобы при загрузке
// Они заново обрабатывались и выводились 
layoutContainerBottomSave.addEventListener('click', function(e) {
    e.preventDefault();
    var data = {
        arrayLeft: allfriends,
        arrayRight: allfriendsRight
    }    

    localStorage.myFriends = JSON.stringify(data);
    cleanLocalStorage.removeAttribute('disabled');
})

// Клик по кнопке очистки LocalStorage. Уточним у юзера хочет ли он этого.
cleanLocalStorage.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Вы действительно хотите очистить localStorage?')) {
        // Очищаем LocalStorage
        localStorage.clear();
        // Т.к. LocalStorage очищен, 
        // то и кнопка Очистить LocalStorage нам не нужна. disable её.
        cleanLocalStorage.setAttribute('disabled', 'true')
    } 
})

window.addEventListener('load', function() {
    // console.log(JSON.parse(localStorage.myFriends));
    if (localStorage.length < 1) {
        cleanLocalStorage.setAttribute('disabled', 'true');
    }
    if (localStorage.length > 0) {
        // Если в localstorage есть данные, то сразу покажем окно со списками друзей
        document.querySelector('.layout').classList.remove('hidden');
        // И кнопка Очистки localStorage пусть станет активной
        cleanLocalStorage.removeAttribute('disabled');
        // Левую колонку набиваем данными из LocalStorage
        leftList.innerHTML = createFriendsDiv(JSON.parse(localStorage.myFriends).arrayLeft);
        // Правую колонку набиваем данными из LocalStorage
        rightList.innerHTML = createFriendsDiv(JSON.parse(localStorage.myFriends).arrayRight);
        // Левый счетчик
        leftFriendsCounter.innerHTML = JSON.parse(localStorage.myFriends).arrayLeft.length;
        // Правый счетчик
        rightFriendsCounter.innerHTML = JSON.parse(localStorage.myFriends).arrayRight.length;
        // А это нужно, чтобы после загрузки списков из LocalStorage
        // у нас работали все ранее созданные обработчики. Иначе ссылки на разные 
        // массивы объектов
        allfriends = JSON.parse(localStorage.myFriends).arrayLeft;
        allfriendsRight = JSON.parse(localStorage.myFriends).arrayRight;
    }
})