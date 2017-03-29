require('./index.css');

ymaps.ready(init);
var myMap,
    myPlacemark;

function init(){     
    myMap = new ymaps.Map("map", {
        center: [55.75, 37.62],
        zoom: 12
    });

    // Создаем собственный макет с информацией о выбранном геообъекте.
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );




    // Создал кластер. Срисовал с примера яндекса
    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна. 
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 200,

        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5
    });

    // var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
    //     '<h3>Теоретически, это должен быть лэйаут балуна</p>' 
    // );

    // var balloon = new ymaps.Balloon(myMap, {
    //     autoPan : true,
    //     closeButton: true,
    //     balloonContentLayout: MyBalloonContentLayoutClass
    // });

    // balloon.options.setParent(myMap.options);
    // balloon.setData('dataaaaaaa');

    // Делаю метку. точнее стилизую
    myMap.events.add('click', function(e) {     
        var coords = e.get('coords');
        var geoObject = e.get('target');
        // Открыть балун по клику на карте
        // balloon.open(coords);
        // Автосмещение балуна
        // balloon.autoPan();

        // balloon.getData();

    

 // Создаем новую метку  
        myPlacemark = new ymaps.Placemark(coords, {
            balloonContent: '<div class="balonblock_leavefeed"><p class="balonblock_leavefeed_title">Ваш отзыв</p><input type="text" placeholder="Ваше имя" class="yourname baloonInput"><input type="text" placeholder="Укажите место" class="yourplace baloonInput"><textarea placeholder="Поделитесь вашими впечатлениями" class="yourminds baloonInput"></textarea></div>',
            balloonContentFooter: '<span class="balonblock_leavefeed_add_btn">Добавить</span>',
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: 'img/1.png',
                // Размеры метки.
                iconImageSize: [30, 42],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-5, -38]
            }
        );
// Поведение метки при наведении курсора на нее
        myPlacemark.events
            .add('mouseenter', function(e) {
                e.get('target').options.set('iconImageHref', 'img/1_orange.png')
            })
            .add('mouseleave', function(e) {
                e.get('target').options.set('iconImageHref', 'img/1.png')
            })
// Задаем метке адрес. В Хедер пишем адрес
        ymaps.geocode(coords).then(function(res) {
            var a = res.geoObjects.get(0).properties.get('name');
            myPlacemark.properties.set({
                balloonContentHeader: a
            })
        })

// Добавляем метку в кластер
        clusterer.add(myPlacemark); 

// Добавляем кластер в геообъект
        myMap.geoObjects.add(clusterer);

    })    
}

