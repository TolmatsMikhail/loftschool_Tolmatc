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

    var newEvent = new Event('click');

    var customBalloonFooter = ymaps.templateLayoutFactory.createClass('Любая строка');


    var myObjectManager = new ymaps.ObjectManager({
        clusterize: true,
        // Опишем метку
        geoObjectIconLayout: 'default#image',
        iconImageHref: 'img/1.png',
        geoObjectIconImageSize: [36, 50],
        geoObjectCursor: 'wait',

        balloonContent: 'khfhfhfhfhfhfgfhghfghghghfhjfhjfhjfhj',
        clusterDisableClickZoom: true,
        // Тип кластера - карусель
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        // Количество Item'ов в кластере -карусели
        clusterBalloonPagerSize: 6,     
    });


    myMap.geoObjects.add(myObjectManager);

    myMap.events.add('click', function(e) {   

        var coordinates = e.get('coords');

        var footerTemplate = ymaps.templateLayoutFactory.createClass('<p>Какой-то абзац</p>', {
            build: function (event) {
                this.constructor.superclass.build.call(this);
                this.balloonContainer = this.getParentElement().parentNode;
                this.balloon = document.querySelector('.ymaps-2-1-48-balloon__content');
                this.balloon.querySelector('.ymaps-2-1-48-balloon__close-button').addEventListener('click', this.closeBalloon.bind(this) );
            }
        })

        var feature = {
            'id': counter++,
            "type": "Feature",            
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            },
            'properties': {
                // balloonContentFooter: 'footerTemplate', // СЮДА ПОПАДАЕТ ФУНКЦИЯ В ГОЛОМ ВИДЕ, ТОЧНЕЕ ЕЕ КОД, ПОЧЕМУ?
                // balloonContent: 'Содержимеофдвпыщфропв',
                // hintContent: 'Текст всплывающей подсказки',
            },
            // Это будут отзывы в этой feature
            'feedbacks': {
                name: 'Vasya'
            }
        }

        feature.properties.balloonContentFooter;
// В шапку пишем Название Адреса
        ymaps.geocode(coordinates).then(function(res) {
            var a = res.geoObjects.get(0).properties.get('name');
            feature.properties.balloonContentHeader = '<img src="img/3.png" alt="">'+a;
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
        myObjects.push(feature);

        var collection = {
            "type": "FeatureCollection",
            "features": myObjects
        };

        myObjectManager.removeAll().add(collection);

        // console.log(myObjectManager.objects.balloon.events);

    })
}





