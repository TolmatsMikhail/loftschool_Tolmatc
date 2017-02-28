/*
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
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
    if (full == null) {
        full = '';
    }

    var fullS = full.toLowerCase();

    var chunkS = chunk.toLowerCase();
//Совпадений нет? Пусть true. В дальнейшем нужно следить за тем, есть ли совпадение, возможно приравнивать его false
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
	// Значение поля фильтра
	var filter = filterNameInput.value;
	// Все имена в строчках таблицы. 
	var cokasNames = document.querySelectorAll('.cookie_name');

	// Если фильтр задан. Длина значения больше нуля.
	if(filter.length > 0) {

		// Совпадений значений фильтра и значения нет? Удалим значение из таблицы(при попытке добавить строчку таблицы). А куку - запишем!
		if(isMatching(value, filter) == false) {
			for(var prop in cokasNames) {
				if(isMatching(cokasNames[prop].innerHTML, name) && !isMatching(cokasNames[prop].nextElementSibling.innerHTML, value)) {
					var thisTr = cokasNames[prop].parentNode;
					listTable.removeChild(thisTr);
					cokasNames[prop].parentNode.style.backgroundColor = 'red';
					document.cookie = name + '=' + value;

					return;
				}
			}	
		}
	// Есть ли совпадение по Имя/Фильтр или Значение/Фильтр, то заходим сюда
		if(isMatching(name, filter) || isMatching(value,filter)) {
			listTable.appendChild(createTr(name,value));
			document.cookie = name + '=' + value;

			return;
		} 

	// Нет совпадений по Имя/Фильтр? В таблицу не добавляем, а куку запишем. 
		if (!isMatching(name, filter)) {
			document.cookie = name + '=' + value;
			return;
		}
	}
	// Фильтр не задан и в таблице пусто - просто добавляем строку таблицы и пишем куку.
	if(document.querySelectorAll('.cookie_name').length == 0) {
		listTable.appendChild(createTr(name,value));
		document.cookie = name + '=' + value;

		return;
	}
	// В таблице уже что-то есть. Проверяем не совпадает ли то, что хотим добавить с уже имеющимся в таблице именем куки.
	// Потому что если имя уже есть - надо переписать значение при попытке добавить куку, чтобы не было дублей. 
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

// Функция создания строчки таблицы. Возвращает строчку. Значит мы ее можем вставить в другую функцию.. и результатом будет создание строки
function createTr(name, value) {
	// Объявим строку
	var tr = document.createElement('tr');
	// Объявми ячейки. Их будет три. Каждой зададим класс, чтобы дальше можно было к ним обращаться. 
	var td1 = document.createElement('td');
	td1.setAttribute('class', 'cookie_name');
	var td2 = document.createElement('td');
	td2.setAttribute('class', 'cookie_value');
	var td3 = document.createElement('td');
	td3.setAttribute('class', 'deleteCookies');
	// Поместим внутрь созданных ячеек значения (в будущем) имени и значения кук. В соответствующие. 
	td1.innerHTML = name;
	td2.innerHTML = value;
	// А вот этот момент мне не понятен. Почему именно BUTTON? Почему нельзя повесить обработчик не на кнопку, а на класс? 
	// Какая разница на что вешать-то, а ???
	var button = document.createElement('button');
	button.innerHTML = 'удалить';
	button.classList.add('deleteCookies');
	// Поместим в строчку все созданные ячейки.
	td3.appendChild(button);
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);

	// Ну и вернём
	return tr;
}

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
		// if(document.querySelectorAll('.cookie_name').length == 0) {
		// 		addNameInput.value = null;
		// 		addValueInput.value = null;
		// }		
	} 
}

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
// А вот если куки какие-то в браузере есть, то заполним таблицу этими данными
makeTable();


