require('./index.css');

ymaps.ready(init);
var myMap;
var myObjects = [];
var counter = 0;
var collection; 
var myObjectManager;
var feature;


var saveTolocalStorageButton = document.querySelector('#saveTolocalStorage');
var savedPlacemarks;


var cleanLocalStorage = document.querySelector('#cleanLocalStorage');

saveTolocalStorageButton.addEventListener('click', function(e) {

    var data = {
        allFeatures: myObjects
    }

    localStorage.placemarks = JSON.stringify(data);
})

// Очистка локалсторадж
cleanLocalStorage.addEventListener('click', function(e) {
    localStorage.clear();
})


function init() {     
    myMap = new ymaps.Map('map', {
        center: [55.75, 37.62],
        zoom: 12
    });

    // if(localStorage.length > 0) {
    //     console.log('В локал сторадж что-то есть')
    // };

    var customCluster = ymaps.templateLayoutFactory.createClass(
        // Кастомизация балуна кластера типа карусель
        `<div class="clusterBalloon">
            {{properties.thisFeedback[0].place}}
            <div class="thisadressgotoballoon">
                {{properties.myAdressHeader}}
            </div>
            {{properties.thisFeedback[0].text}}
            <div class="clusterDate">
                {{properties.thisFeedback[0].date}}
            </div>
        </div>`,
        {
        build: function() {
            customCluster.superclass.build.call(this);
            // Ищем layout балуна кластера
            var a = findParent( this._parentElement.parentNode, 'ymaps-2-1-48-balloon__layout');
            // ищем кнопку, которая закрывает балун кластера
            var closeClusterButton = a.querySelector('.ymaps-2-1-48-balloon__close-button');
            // и добавляем ей класс, чтобы крестик стилизовать
            closeClusterButton.classList.add('closeButtonForCluster');
            // Выбираем слова (т.е. адрес), которые ведут к конкретному балуну(слушаем клик по ним)
            var clickToGoToBalloon = this._parentElement.querySelector('.thisadressgotoballoon');
            clickToGoToBalloon.addEventListener('click', this.onAdressClick);
        },
        clear: function() {
            var clickToGoToBalloon = this._parentElement.querySelector('.thisadressgotoballoon');
            clickToGoToBalloon.removeEventListener('click', this.onAdressClick);
            customCluster.superclass.clear.call(this);
        },
        onAdressClick: function(e) {
            // Кликнутый адрес
            var clickedAdress = e.target.innerHTML.trim();
            // Смотрим всю коллекцию отзывов
            var thisClusterCollection = myObjectManager.clusters.balloon.getData();
            // Пустой массив(изначально) со всеми адресами
            var adresses = [];
            // id отзывов
            var ids = [];
            // id того балуна, который будем открывать по клику на конкретный адрес
            var idToOpenBalloon;
            // Соберем все адреса и все id
            for(var i = 0; i < thisClusterCollection.features.length; i++) {
                adresses.push(thisClusterCollection.features[i].properties.myAdressHeader)
                ids.push(thisClusterCollection.features[i].id);
            }
            // Если кликнутый адрес совпадает с адресом коллекции(иначе и быть не может), то берем его id
            for( var k = 0; k < adresses.length; k++) {
                if(adresses[k] == clickedAdress) {
                    idToOpenBalloon = ids[k];
                    break;
                };
            }
            // и по взятому id открываем балун
            myObjectManager.objects.balloon.open(idToOpenBalloon);
     
        }
    });
    // Создание и кастомизация объект-менеджера
    myObjectManager = new ymaps.ObjectManager({
        clusterize: true,  // кластеризация ВКЛ
        geoObjectIconLayout: 'default#image', // Не знаю что это, но без него нет иконки
        iconImageHref: 'img/1.png', // Картинка для метки отработала, показывается как надо, хотя без префикса
        iconImageOffset: [0, -52], // смещение иконки. 
        geoObjectIconImageSize: [28, 40], // Размер картинки тоже отработал как ни странно
        clusterDisableClickZoom: true, // По клику на кластер НЕТ зума, есть открытие кластера
        clusterBalloonContentLayout: 'cluster#balloonCarousel', // кластер у нас типа КАРУСЕЛЬ
        clusterBalloonPagerSize: 5,     // Количество элементов в кластере карусели (на одну страницу)
        clusterBalloonItemContentLayout: customCluster // Сам layout кластера
    });
   
    // Для того чтобы отобразить объекты на карте, необходимо добавить менеджер в коллекцию объектов карты.
    myMap.geoObjects.add(myObjectManager);

            // Шаблон балуна
    var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            `<div class="myGoodBalloon">
                <div class="balonblock_top">
                    <img src="img/3.png" alt="">
                    {{properties.myAdressHeader}}
                </div>
                <div class="balonblock_existfeedback">    
                    {% if properties.feedbacks.length == 0 %}
                        <div class="thereIsNoFeedbacks">
                            Отзывов нет
                        </div>
                    {% else %} 
                        {% for a in properties.feedbacks %} 
                            <div class="balonblock_existfeedback_item balonblock_existfeedback_item_name">
                                 {{ a.name }}
                            </div>
                            <div class="balonblock_existfeedback_item balonblock_existfeedback_item_place">
                                {{ a.place }}
                            </div>
                            <div class="balonblock_existfeedback_item balonblock_existfeedback_item_place">
                                {{ a.date }} 
                            </div>
                            
                            <div></div>
                            <div class="balonblock_existfeedback_item balonblock_existfeedback_item_place">
                                {{ a.text }}
                            </div>
                            <div></div>                        
                        {% endfor %}
                    {% endif %}

                </div>
                <div class="balonblock_leavefeed">
                    <p class="balonblock_leavefeed_title">
                        Ваш отзыв
                    </p>

                    <input type="text" placeholder="Ваше имя" class="yourname baloonInput">
                    <input type="text" placeholder="Укажите место" class="yourplace baloonInput">
                    <textarea placeholder="Поделитесь вашими впечатлениями" class="yourminds baloonInput"></textarea>

                    <div class="balonblock_leavefeed_add">
                        <span class="balonblock_leavefeed_add_btn">
                            Добавить
                        </span>
                    </div>
                </div>
            </div>`, {
                build: function () {
                    BalloonContentLayout.superclass.build.call(this);
                    // Выбираем кнопку "Добавить"- оранжевая. Вешаем на нее функцию, что делаем функция - далее
                    var balloonAddFeedButton = this._parentElement.querySelector('.myGoodBalloon .balonblock_leavefeed_add_btn');

                    balloonAddFeedButton.addEventListener('click', this.onButtonAddClick);
                    // Выбираем Кнопку закрытия балуна. Вешаем на нее функцию, что делаем функция - далее
                    var balloonCloseButton = this._parentElement.parentNode.previousElementSibling.querySelector('.ymaps-2-1-48-balloon__close-button');

                    balloonCloseButton.addEventListener('click', this.onCloseButtonClick);
                },

                clear: function () {
                    // Всё как в build, но наоборот. Снимаем слушателей.
                    var balloonAddFeedButton = this._parentElement.querySelector('.myGoodBalloon .balonblock_leavefeed_add_btn');

                    balloonAddFeedButton.addEventListener('click', this.onButtonAddClick);
                    var balloonCloseButton = this._parentElement.parentNode.previousElementSibling.querySelector('.ymaps-2-1-48-balloon__close-button');

                    balloonCloseButton.removeEventListener('click', this.onCloseButtonClick);
                    BalloonContentLayout.superclass.clear.call(this);
                },
                // Клик по рыжей кнопке "Добавить"
                onButtonAddClick: function () {
                    // Открытый балун
                    var myThisBalloon = findParent(this, 'myGoodBalloon');
                    // Значения поля ИМЯ
                    var name = myThisBalloon.querySelector('.yourname').value;
                    // Значение поля МЕСТО
                    var place = myThisBalloon.querySelector('.yourplace').value;
                    // Значение поля ПОДЕЛИТЕСЬ ВАШИМИ ВПЕЧАТЛЕНИЯМИ
                    var text = myThisBalloon.querySelector('.yourminds').value;                   
                    // Дата сегодня?
                    var now = new Date();
                    // Какой год?
                    var year = now.getFullYear();
                    // Какой месяц? нумеерация с нуля, поэтому + 1. Если будет 13, то date сам пеерсчитает
                    var month = now.getMonth() + 1;
                    if ( month < 10) {
                        month = '0' + month;
                    }
                    // День в месяце?
                    var day = now.getDate();

                    if ( day < 10) {
                        day = '0' + day;
                    }
                    // Сколько часов?
                    var hour = now.getHours();
                    if ( hour < 10) {
                        hour = '0' + hour;
                    }
                    // Минут?
                    var minutes = now.getMinutes();
                    if ( minutes < 10) {
                        minutes = '0' + minutes;
                    }
                    // Дата в формате ГГ.ММ.ДД часов:минут
                    var date = year +'.'+month+'.'+day+' '+hour+':'+minutes;
                    // Моя текущая фича
                    var feature = myObjectManager.objects.balloon.getData();
                    // Длина "отзывов/вечатлений". Для проверки а есть ли они там вообще
                    var firstFeatureLength = feature.properties.feedbacks.length;
                    // Если нет отзывов вообще никаких в фиче
                    if (firstFeatureLength < 1 ) {
                        if (name && place && text) {
                            feature.properties.feedbacks.push({
                                name: name,
                                place: place,
                                date: date,
                                text: text
                            });

                            feature.properties.thisFeedback.push({
                                name: name,
                                place: place,
                                date: date,
                                text: text
                            })
                        }

                        myObjectManager.objects.balloon.open(0);
                    // Если в фиче есть отзывы уже, то создадим новую, новый id, координаты те же. 
                    } else {
                        feature.properties.feedbacks.push({
                            name: name,
                            place: place,
                            date: date,
                            text: text
                        });

                        var feature2 = {
                            type: 'Feature',
                            id: counter++,                        
                            geometry: {
                                type: 'Point',
                                coordinates: feature.geometry.coordinates
                            },
                            // Здесь просто какие-то данные, к которым можно обратиться
                            properties: {
                            // Получили адрес
                                myAdressHeader: feature.properties.myAdressHeader,
                                thisFeedback: [{
                                    name: name,
                                    place: place,
                                    date: date,
                                    text: text
                                }]
                            }
                        }
                        // Добавим новую фичу в массив фич
                        myObjects.push(feature2);
                        // Массив фич в коллекцию
                        collection = {
                            'type': 'FeatureCollection',
                            'features': myObjects
                        }
                        // Коллекцию в objectManager
                        myObjectManager.removeAll().add(collection);
                    }

                    // Тут же откроем фичу. Пользователю не видно, но экран польностью обновился.
                    var overlay = myObjectManager.objects.getById(feature.id);
                    myObjectManager.objects.balloon.open(overlay.id);
                },
                onCloseButtonClick: function() {
                    // Если у конкретного открытого балуна ничего нет в отзывах, 
                    // значит он пустой. И мы его удалим. Т.к. он открыт, 
                    // то он и есть последний. Его и удаляем путем уменьшения 
                    // длины массива объектов в коллекции
                    if(myObjectManager.objects.balloon.getData().properties.feedbacks[0] == undefined) {
                        myObjects.length = myObjects.length - 1;
                    }

                    collection = {
                        'type': 'FeatureCollection',
                        'features': myObjects
                    }

                    myObjectManager.removeAll().add(collection);
                }
            });
    
    // Устанавливаем шаблон для балуна. Почему-то,
    // при создании objectManager эти опции не задавались
    // Поэтому задаем их вот так
    myObjectManager.objects.options.set({
        // В customBallon надо отрисовать все 
        balloonContentLayout: BalloonContentLayout,
        balloonMinHeight: 530   // чтобы как в макете. 
                                // не повлияет на высоту балуна кластера типа карусель
    })

    if (localStorage.length > 0) {

        savedPlacemarks = JSON.parse(localStorage.placemarks).allFeatures;

        for (var i = 0; i < savedPlacemarks.length; i++) {
            myObjects.push(savedPlacemarks[i]);
        }

        collection = {
            'type': 'FeatureCollection',
            'features': myObjects
        }

        myObjectManager.removeAll().add(collection);
    }



    // Слушаем клик по карте
    myMap.events.add('click', function(e) {
        // Получаем координаты точки на карте, координаты клика
        var coordinates = e.get('coords');
        // Ассинхронный запрос координат с помещением их в шапку создаваемой фичи.
        ymaps.geocode(coordinates).then(function(res) {
            var thisAdress = res.geoObjects.get(0).properties.get('name');

            feature = {
                type: 'Feature',
                id: counter++,                        
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                // Здесь просто какие-то данные, к которым можно обратиться
                properties: {
                // Получили адрес
                    myAdressHeader: thisAdress,
                    feedbacks: [],
                    thisFeedback: []
                }
            }
            // В массив фич добавляем фичу
            myObjects.push(feature);
            // 
            collection = {
                'type': 'FeatureCollection',
                'features': myObjects
            }

            myObjectManager.removeAll().add(collection);
            // Открываем по клику текущий балун сразу же!
            var overlay = myObjectManager.objects.getById(feature.id);

            myObjectManager.objects.balloon.open(overlay.id);

        })   
    })
}

// Ищем родителя
function findParent(elem, classToFind) {
    if (elem.classList.contains(classToFind)) {

        return elem;
    }

    elem = elem.parentNode;

    return findParent(elem, classToFind);
}