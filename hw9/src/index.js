require('./index.css');

ymaps.ready(init);
var myMap;
var myObjects = [];
var counter = 0;

function init() {     
    myMap = new ymaps.Map('map', {
        center: [55.75, 37.62],
        zoom: 12
    });

    var customCluster = ymaps.templateLayoutFactory.createClass(`
        {{properties.myAdressHeader}}
    `);

    var myObjectManager = new ymaps.ObjectManager({
        clusterize: true,  // кластеризация ВКЛ
        geoObjectIconLayout: 'default#image', // хрен знает что это
        iconImageHref: 'img/1.png', // Картинка для метки отработала, показывается как надо
        geoObjectIconImageSize: [36, 50], // Размер картинки тоже отработал как ни странно
        clusterDisableClickZoom: true, // По клику на кластер НЕТ зума
        clusterBalloonContentLayout: 'cluster#balloonCarousel', // кластер у нас типа карусель
        clusterBalloonPagerSize: 6,     // Количество элементов в кластере карусели (на одну страницу)
        clusterBalloonItemContentLayout: customCluster
    });

// Для того чтобы отобразить объекты на карте, необходимо добавить менеджер в коллекцию объектов карты.
    myMap.geoObjects.add(myObjectManager);
    myMap.events.add('click', function(e) {
        var coordinates = e.get('coords');

        function returnFeedbacks() {
            return `<div class="balonblock_top">
                    <img src="img/3.png" alt="">
                    {{properties.myAdressHeader}}
                </div>
                <div class="balonblock_existfeedback">    
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
                </div>`
        }
// Шаблон балуна
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            returnFeedbacks(), {
                build: function () {
                    BalloonContentLayout.superclass.build.call(this);
                    $('.balonblock_leavefeed_add_btn').bind('click', this.onButtonAddClick);
                    $('.ymaps-2-1-48-balloon__close-button').bind('click', this.onCloseButtonClick);
                },
                clear: function () {
                    $('.balonblock_leavefeed_add_btn').unbind('click', this.onButtonAddClick);
                    $('.ymaps-2-1-48-balloon__close-button').unbind('click', this.onCloseButtonClick);
                    BalloonContentLayout.superclass.clear.call(this);
                },
                onButtonAddClick: function () {
                    var name = $('.yourname').val();
                    var place = $('.yourplace').val();
                    var text = $('.yourminds').val();
                    var now = new Date();
                    var year = now.getFullYear();
                    var month = now.getMonth() + 1;
                    var day = now.getDate();
                    var hour = now.getHours();
                    var minutes = now.getMinutes();
                    var date = year +'.'+month+'.'+day+' '+hour+':'+minutes
                    // Это вот доступ к feedbacks
                    // var thisFeatureFeedbacks = myObjectManager.objects.balloon.getData().properties.feedbacks;
                    // Существующие отзывы
                    // var existedFeedbacks = this.parentNode.parentNode.previousElementSibling;
// FEATURE
                    var feature = myObjectManager.objects.balloon.getData();       

                    console.log(myObjectManager.objects.balloon);

                    if (name && place && text) {                        
                        feature.properties.feedbacks.push({
                            name: name,
                            place: place,
                            text: text,
                            date: date
                        });
                    } else {
                        alert('Необходимо ввести значения во все поля');
                    }


                    
    // При изменении фичи тут же ее откроем
                    var overlay = myObjectManager.objects.getById(feature.id);

                    myObjectManager.objects.balloon.open(overlay.id);


                },
                onCloseButtonClick: function() {
                    for (var i = 0; i < myObjects.length; i++) {
                        if (myObjects[i].properties.feedbacks.length < 1) {
                            myObjects.splice(i, 1);
                        }
                    }
    // Если кликаем по кнопке "закрыть", то обновляем нашу коллекцию и отрисовываем ранее добавленные штуки
                    var collection = {
                        'type': 'FeatureCollection',
                        'features': myObjects
                    }

                    myObjectManager.removeAll().add(collection);
                }
            });

// Устанавливаем шаблон для балуна
        myObjectManager.objects.options.set({
            // В customBallon надо отрисовать все 
            balloonContentLayout: BalloonContentLayout
        })

// В шапку пишем Название Адреса
        ymaps.geocode(coordinates).then(function(res) {
            var thisAdress = res.geoObjects.get(0).properties.get('name');
            var feature = {
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
                    feedbacks: []
                }
            }

            myObjects.push(feature);

            var collection = {
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