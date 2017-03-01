/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    seconds = seconds*1000;

    return new Promise(function(resolve) {
        setTimeout(function() {
            return resolve();
        }, seconds);
    })
}

/** 2
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return new Promise(function(resolve, reject) {
    // Создаем реквест
        var xhr = new XMLHttpRequest();

    // Хотим Получить данные с URL
        xhr.open('GET', url, false);
    // Добавляем состояние "Загружено!"
        xhr.addEventListener('load', function() {
        // То, что получили в качестве запроса переделываем в массив. Получается массив объектов
            var gotArr = JSON.parse(xhr.responseText);

            // 1 вариант сортировки 
            // Здесь делаем из полученного массива объектов нормальный новый массив
            // var arr2 = [];
            // for(var i = 0; i < gotArr.length; i++) {
            //  arr2.push(gotArr[i].name);
            // }
            // var arr3 = arr2.sort();
            // var towns = [];
            // for(var j = 0; j < arr3.length; j++) {
            //  towns.push({
            //      'name' : arr3[j]
            //  })
            // }
            // 2 вариант с использованием функции compare 
            // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/sort*/
            function compare(a, b, i) {
                i = i || 0;

                if (a.name.charAt(i) < b.name.charAt(i)) {
                    return -1;
                } else if (a.name.charAt(i) > b.name.charAt(i)) {
                    return 1;
                }

                return compare(a, b, ++i);
            }
            resolve(gotArr.sort(compare));
        })
        // А если не загружено? Ошибка
        xhr.addEventListener('error', function() {
            reject(error)
        })

        xhr.send();
    })
}

export {
    delayPromise,
    loadAndSortTowns
};
