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

    

    myMap.events.add('click', function(e) {   


        var customBalloonFooter = ymaps.templateLayoutFactory.createClass(`Футер ________`)

        var myObjectManager = new ymaps.ObjectManager({
            clusterize: true,
            // Опишем метку
            geoObjectIconLayout: 'default#image',
            geoObjectIconImageHref: 'img/1.png',
            geoObjectDraggable: true,
            geoObjectIconImageSize: [36, 50],
            geoObjectBalloonContentFooter: customBalloonFooter, // ПОЧЕМУ ШАБЛОН НЕ ПРИМЕНЯЕТСЯ? НЕ ВСТАВЛЯЕТСЯ СЮДА!
            

            // По клику на кластер - не увеличиваем карту
            clusterDisableClickZoom: true,
            // Тип кластера - карусель
            clusterBalloonContentLayout: "cluster#balloonCarousel",
            // Количество Item'ов в кластере -карусели
            clusterBalloonPagerSize: 6,
        });


        myMap.geoObjects.add(myObjectManager);


        var coordinates = e.get('coords');

        // var a = ymaps.geocode([55.75, 37.62]).then(function(res) {
        //     var a = res.geoObjects.get(0).properties.get('name');
        //     return a;
        // })      
    
        var feature = {
            "type": "Feature",
            'id': counter++,
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            },
            'properties': {
                "hintContent": "Текст подсказки",
                "balloonContentHeader": 'ХЕДЕР',
                "balloonContentBody": 'Боди',
                // balloonContentFooter: customBalloonFooter // СЮДА ПОПАДАЕТ ФУНКЦИЯ В ГОЛОМ ВИДЕ, ТОЧНЕЕ ЕЕ КОД, ПОЧЕМУ?
            },
            // Это будут отзывы в этой feature
            // 'feedbacks': {
            //     name: 'Vasya'
            // }
        }


        myObjectManager.objects.events.add('click', function(e) {
            var placemarkID = e.get('objectId');
            var overlay = myObjectManager.objects.overlays.getById(placemarkID);
            // Это лежит в контенте боди
            var toChtoLEzhitVBODI = overlay.getData().properties.balloonContentBody;
            // Свойство отзывов. которых поначалу нет
            var allThisPlaceFeedbacks = overlay.getData().feedbacks;
            
        })

        myObjects.push(feature);

        var collection = {
            "type": "FeatureCollection",
            "features": myObjects
        };

        myObjectManager.removeAll().add(collection);

    })
}





