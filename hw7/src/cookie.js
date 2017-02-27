/*
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 * ############### ТАБЛИЦА ЕСТЬ, УЖЕ БЫЛА. ЗАДАЧА НЕКОРРЕКТНА, т.к. КНОПКА! КАКАЯ РАЗНИЦА НА ЧТО ВЕШАТЬ ОРАБОТЧИК?
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 * ############### ФОРМА ЕСТЬ, УЖЕ БЫЛА. При клике на кнопку кука добавляется и в браузер и в таблицу. 
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 * ############### ВЫПОЛНЕНО!!! 
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 * ############### ПОЛЕ УЖЕ БЫЛО!!
 * На странице должно быть текстовое поле для фильтрации cookie
 * ############### ФИЛЬТРАЦИЯ ТАК И РАБОТАЕТ
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * ############### ТАК И ЕСТЬ, ТАК И РАБОТАЕТ.
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * 
 * Если добавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
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
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

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
//Совпадений нет? Даем зеленый свет на создание строчки
    if (fullS.indexOf(chunkS) > -1) {
        return true;
    }

    return false;
}

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */

 // Обработчик который будет СОЗДАВАТЬ строчки в таблице и записывать куки
addButton.addEventListener('click', createCookieTr);
function createCookieTr(name, value) {
	// Введенные значения кук имени и значения
	name = addNameInput.value;
	value = addValueInput.value;

	var filter = filterNameInput.value;

	var cokasNames = document.querySelectorAll('.cookie_name');

// Ф И Л Ь Т Р  __  З А Д А Н !!
	if(filter) {
		
// Есть совпадение есть по фильтру ИЛИ значение, то заходим сюда
		if(isMatching(name, filter) || isMatching(value,filter)) {
			listTable.appendChild(createTr(name,value));
			document.cookie = name + '=' + value;

			console.log('Есть совпадение по фильтру или по значению')

			return;
		} 

// Если НЕТ совпадений по имени и фильтру
		if (!isMatching(name, filter)) {
			document.cookie = name + '=' + value;
			console.log('Нет совпадений только по имени и фильтру')
			return;
		}

		if(!isMatching(value, filter)) {
			for(var prop in cokasNames) {
				if(isMatching(cokasNames[prop].innerHTML, name) && !isMatching(cokasNames[prop].nextElementSibling.innerHTML, value)) {
					var thisTr = cokasNames[prop].parentNode;
					listTable.removeChild(thisTr);
					cokasNames[prop].parentNode.style.backgroundColor = 'red';

					return;
				}
			}	
		}
	}

	if(document.querySelectorAll('.cookie_name').length == 0) {
		listTable.appendChild(createTr(name,value));
		document.cookie = name + '=' + value;

		return;
	}
	if (document.querySelectorAll('.cookie_name').length > 0) {
		for(var key in document.querySelectorAll('.cookie_name')) {	
			if(document.querySelectorAll('.cookie_name')[key].innerHTML != name) {
				continue;
			} else if(document.querySelectorAll('.cookie_name')[key].innerHTML == name) {
				document.querySelectorAll('.cookie_name')[key].nextElementSibling.innerHTML = value;
				document.cookie = name + '=' + value;

				return;
			}
		}
	} 


	listTable.appendChild(createTr(name,value));
	document.cookie = name + '=' + value;





}

// Функция создания строчки таблицы
function createTr(name, value) {
	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	td1.setAttribute('class', 'cookie_name');
	var td2 = document.createElement('td');
	td2.setAttribute('class', 'cookie_value');
	var td3 = document.createElement('td');
	td3.setAttribute('class', 'deleteCookies');
	td1.innerHTML = name;
	td2.innerHTML = value;
	var button = document.createElement('button');
	button.innerHTML = 'удалить';
	button.classList.add('deleteCookies');
	td3.appendChild(button);
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);

	return tr;
}

// ################################### Тут все норм
// Обработчик, удаляющий строчку и куку из таблицы
homeworkContainer.addEventListener('click', deleteTableRow);
// Функция, удаляющая куку из таблицы и строчку из таблицы 
function deleteTableRow(e) {
	if(e.target.classList.contains('deleteCookies')) {
		listTable.removeChild(e.target.parentNode.parentNode);

		// Имя куки? берем из первой колонки
		var cookieNameToDelete = e.target.parentNode.parentNode.children[0].innerHTML;
		// Значение куки? берем из второй колонки
		var cookieValueToDelete = e.target.parentNode.parentNode.children[1].innerHTML;

		// Заставляем куку "протухнуть" путем установки даты начала эпохи unix
		document.cookie = cookieNameToDelete + '=' + cookieValueToDelete + ';expires=' + new Date(0);

		// на всякий случай, если удалим все строчки из таблицы - пусть поля input будут пустые
		if(document.querySelectorAll('.cookie_name').length == 0) {
				addNameInput.value = null;
				addValueInput.value = null;
		}		
	} 
}

// ###################################  До сюда

filterNameInput.addEventListener('keyup', function(e) {
	makeTable();
});

// Будем заполнять табличку из document.cookie при загрузке страницы

function makeTable(){
	// Получаем массив имен, значений. Имена на четных местах, значения на нечетных. 
	var x = document.cookie.split('=').join().split(';').join().split(',');
	var filterInputValue = filterNameInput.value;
	listTable.innerHTML = '';

	var name = addNameInput.value;
	var value = addValueInput.value;



// ????????????????
	if(!filterInputValue) {
		for(var z = 0; z < x.length; ) {
			var p = z + 1;
			listTable.appendChild(createTr(x[z], x[p]));
			z = z + 2
		}

		return;
	}

	for (var i = 0; i < x.length; ) {

		var k = i + 1;

		if(isMatching(x[i], filterInputValue) || isMatching(x[k], filterInputValue) ) {
			listTable.appendChild(createTr(x[i], x[k]));
		}
		i = i + 2;
	}
}


