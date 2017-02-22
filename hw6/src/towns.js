/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 СДЕЛАНО (ИЗ ПРЕДЫДУЩЕГО ЗАДАНИЯ ВЫВОД)
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 СДЕЛАНО
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 СДЕЛАНО - проверял путем намеренной порчи путей в url

 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой *** НЕ ВЫПОЛНЕНО
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
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
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    return require('./index').loadAndSortTowns();
}

homeworkContainer.querySelector('#filter-input').style.display = 'none';

loadTowns()
.then(function(a) {
    let loadingBlock = homeworkContainer.querySelector('#loading-block');
    // let filterBlock = homeworkContainer.querySelector('#filter-block');
    let filterInput = homeworkContainer.querySelector('#filter-input');
    let filterResult = homeworkContainer.querySelector('#filter-result');

    loadingBlock.style.display = 'none';
    filterInput.style.display = 'block';
    filterResult.style.cursor = 'pointer';

    filterInput.addEventListener('keyup', function() {
        // Получаем значения того, что вводится в поле
        let value = this.value.trim();        
        // Обнуляем содержимое поле вывода результатов

        filterResult.innerHTML = '';
        // Если значение поля ввода пустое - в резалте пусто! 
        // Нужно ну случай, когда что-то было введено, а затем удалено
        if (value == '') {
            filterResult.innerHTML = '';
        } else {
            for (var i = 0; i < a.length; i++) {
                if (isMatching(a[i].name.trim(), value)) {
                    filterResult.innerHTML += '<div>' + a[i].name + '</div>';
                }
            }
        }
    });

    filterResult.addEventListener('click', function(e) {
        filterInput.value = e.target.innerHTML;
        filterResult.innerHTML = null;
    })
},
function(error){
	console.log(error)
})
/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    if (chunk == null) {
        chunk = '';
    }

    var fullS = full.toLowerCase();

    var chunkS = chunk.toLowerCase();

    if (fullS.indexOf(chunkS) < 0) {
        return false;
    }

    return true;
}

export {
    loadTowns,
    isMatching
};
