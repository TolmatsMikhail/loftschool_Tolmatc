/* ДЗ 5.2 - Div D&D */

/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом фона и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
// 1. Создадим элемент
    var div = document.createElement('div');

// 2. Присвоим элементу класс
    div.classList.add('draggable-div');

// 3. Получим случайные размеры для блока - не больше размера страницы
    var width = document.documentElement.clientWidth * Math.random() + 1;
    var height = document.documentElement.clientHeight * Math.random() + 1;

// 3.а) И зададим их для блока
    div.style.width = width / 2 + 'px';
    div.style.height = height / 2 + 'px';
// 4 Зададим позиционирование абсолютное
    div.style.position = 'absolute';
// 5. Зададим случайные координаты позиционирования. Сперва их получим исходя из размеров экрана
    var left = (document.documentElement.clientWidth * Math.random() + 1) / 2;
    var top = (document.documentElement.clientHeight * Math.random() + 1) / 2;

// 5.а) Установим блок по полученным случайным координатам
    div.style.left = left + 'px';
    div.style.top = top + 'px';
// 6. Получим случайные цвета. Вообще, планировался цвет в формате #80ffbc, но почему-то нет.
    var color1 = Math.ceil(Math.random()*255).toString(16);
    var color2 = Math.ceil(Math.random()*255).toString(16);
    var color3 = Math.ceil(Math.random()*255).toString(16);
    var color = '#' + color1 + color2 + color3;

// 6.а) Зададим сам цвет
    div.style.backgroundColor = color;

// Вернем сам элемент как по заданию. Не добавляем на страницу.
    return div;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {

    var isMovable = false;

    target.addEventListener('mousedown', function() {
        isMovable = true;
    })
    target.addEventListener('mouseup', function() {
        isMovable = false;
    })
    document.addEventListener('mousemove', function(e) {
        if (isMovable) {
            followCreatedBlockPosition(e, target);
        }
    })
}

// Этой функцией будем двигать цель!P Position ABSOLUTE, значит позиция слева
// позиция элемента будет зависеть от позиции курсора. 
function followCreatedBlockPosition(e, target) {
    target.style.left = e.pageX - target.offsetWidth / 2 + 'px';
    target.style.top = e.pageY - target.offsetHeight / 2 + 'px';
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
