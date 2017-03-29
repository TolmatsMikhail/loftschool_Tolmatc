require('./index.css');

ymaps.ready(init);
var myMap;
var myObjects = [];
var counter = 0;

function init(){     
    myMap = new ymaps.Map("map", {
        center: [55.75, 37.62],
        zoom: 12
    });

    var myObjectManager = new ymaps.ObjectManager({
        clusterize: true,  // кластеризация ВКЛ
        geoObjectIconLayout: 'default#image', // хрен знает что это
        iconImageHref: 'img/1.png', // Картинка для метки отработала, показывается как надо
        geoObjectIconImageSize: [36, 50], // Размер картинки тоже отработал как ни странно
        clusterDisableClickZoom: true, // По клику на кластер НЕТ зума
        clusterBalloonContentLayout: "cluster#balloonCarousel", // кластер у нас типа карусель
        clusterBalloonPagerSize: 6,     // Количество элементов в кластере карусели (на одну страницу)
    });



// Для того чтобы отобразить объекты на карте, необходимо добавить менеджер в коллекцию объектов карты.
    myMap.geoObjects.add(myObjectManager);

    myMap.events.add('click', function(e) {   
        var coordinates = e.get('coords');
        var customBallon = ymaps.templateLayoutFactory.createClass('<p>$[properties.myAdressHeader]</p>');

        myObjectManager.objects.options.set({
            // В customBallon надо отрисовать все 
            balloonContentLayout: customBallon,
            // Кластер контент лэйоут
            // 
        }) 


// В шапку пишем Название Адреса
        ymaps.geocode(coordinates).then(function(res) {
            var a = res.geoObjects.get(0).properties.get('name');
            // feature.properties.balloonContentHeader = '<img src="img/3.png" alt="">'+a;

            var feature = {
                type: "Feature",
                id: counter++,                        
                geometry: {
                    type: "Point",
                    coordinates: coordinates
                },

                // Здесь просто какие-то данные, к которым можно обратиться
                properties: {
                // Получили адрес
                    myAdressHeader: a,
                }
            }

            myObjects.push(feature);

            var collection = {
                "type": "FeatureCollection",
                "features": myObjects
            }

            myObjectManager.removeAll().add(collection);

        })


/*
        myObjectManager.objects.events.add('click', function(e) {
            // Ловим конкретный объект
            var placemarkID = e.get('objectId');
            // 
            var overlay = myObjectManager.objects.overlays.getById(placemarkID);
            // Это лежит в контенте боди
            var toChtoLEzhitVBODI = overlay.getData().properties.balloonContentBody;
            // Свойство отзывов. которых поначалу нет
            var allThisPlaceFeedbacks = overlay.getData().feedbacks;
            
        })
*/        
    })
}





