/* ДЗ 3 - объекты и массивы */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */

 /*
Метод для каждого элемента массива вызывает функцию callback(item, i, arr)
 */
function forEach(array, fn) {
	if(!Array.isArray(array) || array.length == 0){
		throw new Error('array is not array or empty array');
	}
	if(typeof fn != 'function'){
		throw new Error('fn is not a function')
	}
	for(var i = 0; i < array.length; i++){
		fn(array[i], i, array);
	}

}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
 /*
arr.map(callback[, thisArg]) используется для трансформации массива. Возвращает новый массив
 */

function map(array, fn) {
	if(!Array.isArray(array) || array.length == 0){
		throw new Error('array is not array or empty array');
	}
	if(typeof fn != 'function'){
		throw new Error('fn is not a function')
	}

	var a;

	var array2 = [];
	for(var i = 0; i < array.length; i++){
		a = fn(array[i], i, array);
		array2.push(a);
	}
	return array2;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
//Пусть то, что вернет reduce назовем result(результат выполнения этого reduce'a.)
    var result = initial;
 //Счетчик нужен для того, чтобы если initial'a нет, то нет смысла вызывать fn для первой итерации.
    var counter = 0;
// Не задан initial?? Тогда итерации пойдут с единицы, а первым элементом передастся не результат вызова, а первый элемент массива
    if (arguments.length < 3) {
        result = array[0];
        counter++;
    }    

    for (var i = counter; i < array.length; i++) {
        result = fn(result, array[i], i, array);
    }

    return result;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
	var keys = Object.keys(obj);
	for (var i = 0; i < keys.length; i++) {
		if(keys[i] == prop){
			delete obj[prop];
		}
	}
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
	var obj_properties = Object.keys(obj);

	for(var i = 0; i< obj_properties.length; i++){
		if(obj_properties[i] == prop){
			return true;
		}
	}	

	return false;
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
 /*
	Object.keys возвращает как раз массив с перечисляемыми свойствами. Удача!!!
 */
function getEnumProps(obj) {
	var arr = [];
	for(var key in obj){
		arr.push(key);
	}
	
	return arr;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
 /*
Object.getOwnPropertyNames() возвращает вообще все свойства. Тут надо прям все, но Сергей в лекци(12-42 / 11.02.2017) сказал, что все равно что брать :-)
 */
function upperProps(obj) {
	var all_keys = Object.getOwnPropertyNames(obj);
	for(var i = 0; i < all_keys.length; i++){
		all_keys[i] = all_keys[i].toUpperCase();
	}

	return all_keys;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами

 Метод slice(begin, end) копирует участок массива от begin до end, не включая end. Исходный массив при этом не меняется
 */
function func(array, from, to) {

}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */


function createProxy(obj) {
	obj = {};
	var validator = {
		set: function(obj, prop, value){
			obj[prop] = value * value;
			return true;
		}

	}
	return new Proxy(obj, validator);
}


export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    //slice,
    createProxy
};
