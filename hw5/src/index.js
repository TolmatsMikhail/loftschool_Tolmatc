/* ДЗ 5.1 - DOM Events */

/** 1
 * Функция должна добавлять обработчик fn события eventName к элементу target
 *
 * @param {string} eventName - имя события, на которое нужно добавить обработчик
 * @param {Element} target - элемент, на который нужно добавить обработчик
 * @param {function} fn - обработчик
 */
function addListener(eventName, target, fn) {
    target.addEventListener(eventName, fn);
}

/** 2
 * Функция должна удалять обработчик fn события eventName у элемента target
 *
 * @param {string} eventName - имя события, для которого нужно удалить обработчик
 * @param {Element} target - элемент, у которого нужно удалить обработчик
 * @param {function} fn - обработчик
 */
function removeListener(eventName, target, fn) {
    target.removeEventListener(eventName, fn);
}

/** 3
 * Функция должна добавлять к target обработчик события eventName, который должен отменять действие по умолчанию
 *
 * @param {string} eventName - имя события, для которого нужно удалить обработчик
 * @param {Element} target - элемент, на который нужно добавить обработчик
 */
function skipDefault(eventName, target) {
    // target.addEventListener(eventName, e => e.preventDefault()); - это уже было написано, почему-то
    target.addEventListener(eventName, function(e) {
        e.preventDefault();
    })
}

/** 4
 * Функция должна эмулировать событие click для элемента target
 *
 * @param {Element} target - элемент, на который нужно добавить обработчик
 */
function emulateClick(target) {
    var newEvent = new Event('click');

    target.dispatchEvent(newEvent);
}

/** 5 
 * Функция должна добавить такой обработчик кликов к элементу target
 * который реагирует (вызывает fn) только на клики по элементам BUTTON внутри target
 *
 * @param {Element} target - элемент, на который нужно добавить обработчик
 * @param {function} fn - функция, которую нужно вызвать при клике на элемент BUTTON внутри target
 */
function delegate(target, fn) {
    var handler = function(e) {
        if (e.target.nodeName == 'BUTTON') {
            fn();
        }
    }

    target.addEventListener('click', handler);
}

/**
 * *** Со звездочкой ***
 * Функция должна добавить такой обработчик кликов к элементу target
 * который сработает только один раз и удалится
 * Постарайтесь не создавать глобальных переменных
 *
 * @param {Element} target - элемент, на который нужно добавить обработчик
 * @param {function} fn - обработчик
 */
function once(target, fn) {
    var handler = function() {
        fn();
        target.removeEventListener('click', handler);
    }

    target.addEventListener('click', handler);
}

export {
    addListener,
    removeListener,
    skipDefault,
    emulateClick,
    delegate,
    once
};