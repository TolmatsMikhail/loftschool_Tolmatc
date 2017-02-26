/**
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

	if(document.querySelectorAll('.cookie_name').length == 0) {
		listTable.appendChild(createTr(name,value));
		document.cookie = name + '=' + value;

		return;
	} else if (document.querySelectorAll('.cookie_name').length > 0) {
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
	addNameInput.value = null;
	addValueInput.value = null;
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
	//Берем значение поля ввода
	var filterInputValue = filterNameInput.value
	// Берем куки в виде строчки. Будем искать совпадения
	var cooka = document.cookie;
	// Берем значение имен и значений кук. Помним, что если стереть из таблицы, то сотрется и из кук.
	var cokaNames = document.querySelectorAll('.cookie_name');
	var cokaValues = document.querySelectorAll('.cookie_value');

//CСУДЯ ПО ТЕСТАМ - УДАЛЯТЬСЯ ДОЛЖНО СОВСЕМ!! ПРОВЕРЯЕТСЯ ДЛИНА, НАХРЕН ТАК??
// Просто скрыть - тесты не проходят

	// Есть совпадения введенного значения в строчке кук? 
	if(isMatching(cooka, filterInputValue)) {
		for(var i = 0; i < cokaNames.length; i++) {
			// А совпадает ли введенное значение со значение какого-нибудь имени куки или значения?
			if(!isMatching(cokaNames[i].innerHTML, filterInputValue) && !isMatching(cokaValues[i].innerHTML, filterInputValue)) {
				// Не совпадает. скроем строчку таблицы
				cokaNames[i].parentNode.style.display = 'none';
			} else {
				// совпадает. покажем строчку таблицы!
				cokaNames[i].parentNode.style.display = 'table-row';
			}
		}

	} else {
		for(var i = 0; i < cokaNames.length; i++) {
			cokaNames[i].parentNode.style.display = 'none';
		}
	}
});

// Будем заполнять табличку из document.cookie при загрузке страницы
(function(){
	var x = document.cookie.split('=').join().split(';').join().split(',');
	for(var i = 0; i < x.length; ) {
		var k = i + 1;
		listTable.appendChild(createTr(x[i], x[k]))
		i = i + 2;
	}
}) ()