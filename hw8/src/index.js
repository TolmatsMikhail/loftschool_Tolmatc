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
// Эта функция запустится, когда шаблон с друзьями уже отработал, есть друзья с классами. 
// Делаем каждый элемент "двигательным"(или двигаемым, как сказать-то) путем задания ему
// draggable='true", а также функций, необходимых для движения элемента по экрану. 
// HTML5 api drag-n-drop
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
function removeElementFromFriendsList(arr, i) {
    allfriendsRight.unshift(arr[i]);

    return arr.splice(i, 1);
}

// Функция для фильтрации, например. Совпадающий элемент удалим из массива
function removeElementFromFriendsListRight(arr, i) {
    allfriends.unshift(arr[i]);

    return arr.splice(i, 1);
}

// Установка атрибутов id для элементов. id будет соответствовать номеру в массиве.
// Пригодится.
function setId(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].setAttribute('id', i);
    }
}

/*
    Три функции для drag-n-drop
*/

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
        .then(
            // Делаем элементы двигаемыми
            () => setElementDraggable('.friends_item_left_inner')
        )
})

document.addEventListener('click', function(e) {
    // Кликнули по картинке-крестику или его родителю?
    if (e.target.classList.contains('layout_container_close') || e.target.getAttribute('src') == 'img/cross.png') {
        // Закрывает окно с друзьями
        document.querySelector('.layout').classList.add('hidden');
    }
})
// Клик по плюсику - из левой колонки переносим карточку элементу в правую колонку
leftList.addEventListener('click', leftPlusClick);

function leftPlusClick(e) {
    // Если target содержит класс нашей картинки-плюсика или класс блока, в котором эта картинка
    if (e.target.classList.contains('one_friend_item_plus') || e.target.classList.contains('one_friend_item_plus_image')) {

        // ищем id кликнутого элемента(точнее его родителя)
        var removedFromLeftNumber = findParent(e.target, 'one_friend').id;

        // Удаляем кликнутый элемент из массива друзей СЛЕВА
        removeElementFromFriendsList(allfriends, removedFromLeftNumber)

        // Заполняем левую часть по шаблону из получившегося нового массива объектов        
        leftList.innerHTML = createFriendsDiv(allfriends);

        // На каждом заполнении мы будем назначать обработчики для drag-n-drop для элементов. 
        // Левой колонки. Ато они удаляются
        setElementDraggable('.friends_item_left_inner');

        // В правую будет помещать опять ж создаваемый шаблон на основе удаленных элементов.        
        rightList.innerHTML = createFriendsDiv(allfriendsRight);

        // Установить id кадому элементу левой и правой колонки
        setId(rightList.children);
        setId(leftList.children);
        // Счетчики друзей слева и справа
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

// Фильтрации в левом инпуте по нажатию на кнопку. Точнее, по ее "отпусканию" после нажатия
inputFilterLeft.addEventListener('keyup', function() {
    // Если в фильтре ничего нет или мы все удалили
    if (inputFilterLeft.value == '') {      
        // Левый список наполняется друзьями
        leftList.innerHTML = createFriendsDiv(allfriends);
        // Делаем элементы слева двигаемыми
        setElementDraggable('.friends_item_left_inner');
        // Ставим id
        setId(rightList.children);
        setId(leftList.children);
        // Ставим счетчик
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

    setElementDraggable('.friends_item_left_inner');

    setId(rightList.children);
    setId(leftList.children);

    leftFriendsCounter.innerHTML = newFilteredArrayLeft.length;

})

inputFilterRight.addEventListener('keyup', function() {

    if (inputFilterRight.value == '') {
        
        rightList.innerHTML = createFriendsDiv(allfriendsRight);

        setElementDraggable('.friends_item_left_inner');

        setId(rightList.children);
        setId(leftList.children);

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

    setElementDraggable('.friends_item_left_inner');

    setId(rightList.children);
    setId(leftList.children);

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
        setId(rightList.children);
        setId(leftList.children);
        setElementDraggable('.friends_item_left_inner');
    }
})