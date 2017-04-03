require('./index.css');

ymaps.ready(init);
var myMap;
var myObjects = [];
var counter = 0;
var collection; 
var myObjectManager;
var feature;

function init() {     
    myMap = new ymaps.Map('map', {
        center: [55.75, 37.62],
        zoom: 12
    });

    var customCluster = ymaps.templateLayoutFactory.createClass(`
        <div class="clusterBalloon">
            {{properties.thisFeedback[0].place}}
            <div class="thisadressgotoballoon">
                {{properties.myAdressHeader}}
            </div>
            {{properties.thisFeedback[0].text}}
            <div class="clusterDate">
                {{properties.thisFeedback[0].date}}
            </div>
        </div>
    `,{
        build: function() {
            customCluster.superclass.build.call(this);
            $('.thisadressgotoballoon').bind('click', this.onAdressClick);
        },
        clear: function() {
            $('.thisadressgotoballoon').unbind('click', this.onAdressClick);
            customCluster.superclass.clear.call(this);
        },

        onAdressClick: function(e) {
            
            var clickedAdress = e.target.innerHTML.trim();

            var thisClusterCollection = myObjectManager.clusters.balloon.getData();

            var adresses = [];
            var ids = [];
            var idToOpenBalloon;

            for(var i = 0; i < thisClusterCollection.features.length; i++) {
                adresses.push(thisClusterCollection.features[i].properties.myAdressHeader)
                ids.push(thisClusterCollection.features[i].id);
            }

            for( var k = 0; k < adresses.length; k++) {
                if(adresses[k] == clickedAdress) {
                    idToOpenBalloon = ids[k];
                    break;
                };
            }

            myObjectManager.objects.balloon.open(idToOpenBalloon);
     
        }
    });

    myObjectManager = new ymaps.ObjectManager({
        clusterize: true,  // кластеризация ВКЛ
        geoObjectIconLayout: 'default#image', // хрен знает что это
        iconImageHref: 'img/1.png', // Картинка для метки отработала, показывается как надо
        iconImageOffset: [0, 0],
        geoObjectIconImageSize: [28, 40], // Размер картинки тоже отработал как ни странно
        clusterDisableClickZoom: true, // По клику на кластер НЕТ зума
        clusterBalloonContentLayout: 'cluster#balloonCarousel', // кластер у нас типа карусель
        clusterBalloonPagerSize: 5,     // Количество элементов в кластере карусели (на одну страницу)
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
                    var date = year +'.'+month+'.'+day+' '+hour+':'+minutes;
                    // FEATURE
                    var feature = myObjectManager.objects.balloon.getData();
                    var firstFeatureLength = feature.properties.feedbacks.length;
        
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

                        myObjects.push(feature2);

                        collection = {
                            'type': 'FeatureCollection',
                            'features': myObjects
                        }

                        myObjectManager.removeAll().add(collection);
                    }

                    // При изменении фичи тут же ее откроем
                    var overlay = myObjectManager.objects.getById(feature.id);
                    myObjectManager.objects.balloon.open(overlay.id);
                },

                onCloseButtonClick: function() {
// Если у конкретного открытого балуна ничего нет в отзывах, значит он пустой. И мы его удалим. Т.к. он открыт, то он и есть последний. Его и удаляем путем уменьшения длины массива объектов в коллекции
                    if(myObjectManager.objects.balloon.getData().properties.feedbacks[0] == undefined) {
                        myObjects.length = myObjects.length - 1;
                    }

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
            balloonContentLayout: BalloonContentLayout,
            balloonMinHeight: 530
        })

// В шапку пишем Название Адреса
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
            // var feature = createNewFeature(coordinates, thisAdress);
            myObjects.push(feature);

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