// Base Parameters
var renderer = new THREE.WebGLRenderer({ antialias: true }); // Создает экземпляр WebGLRenderer с включенной сглаживанием (antialias)
renderer.setSize(window.innerWidth, window.innerHeight); // Устанавливает размер рендерера в соответствии с размерами окна браузера

if (window.innerWidth > 800) { // Проверяет, если ширина окна больше 800 пикселей
    renderer.shadowMap.enabled = true; // Включает отображение теней
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Устанавливает тип теней на мягкие тени
    renderer.shadowMap.needsUpdate = true; // Указывает, что карта теней нуждается в обновлении
}
document.body.appendChild(renderer.domElement); // Добавляет элемент рендерера в тело документа (DOM)

// Make it responsive
window.addEventListener("resize", onWindowResize, false); // Добавляет обработчик события изменения размера окна
function onWindowResize() { // Функция для обработки изменения размера окна
    camera.aspect = window.innerWidth / window.innerHeight; // Обновляет соотношение сторон камеры
    camera.updateProjectionMatrix(); // Обновляет матрицу проекции камеры
    renderer.setSize(window.innerWidth, window.innerHeight); // Устанавливает новый размер рендерера
}

var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500); // Создает перспективную камеру с заданными параметрами
camera.position.set(0, 2, 14); // Устанавливает позицию камеры в пространстве

var scene = new THREE.Scene(); // Создает новую сцену
var city = new THREE.Object3D(); // Создает новый объект для города
var smoke = new THREE.Object3D(); // Создает новый объект для дыма
var town = new THREE.Object3D(); // Создает новый объект для города (возможно, для дальнейшего использования)
var createCarPos = true; // Переменная для управления созданием позиции автомобиля
var uSpeed = 0.001; // Устанавливает скорость (возможно, для анимации)

// FOG Background
var setcolor = 0x39FF14; // Устанавливает цвет фона (зеленый цвет в шестнадцатеричном формате)
scene.background = new THREE.Color(setcolor); // Устанавливает цвет фона сцены
scene.fog = new THREE.Fog(setcolor, 10, 16); // Устанавливает туман в сцене с заданным цветом и расстоянием

// Random Function
function mathRandom(num = 8) { // Определяет функцию mathRandom с параметром num, по умолчанию равным 8
    var numValue = - Math.random() * num + Math.random() * num; // Генерирует случайное число в диапазоне от -num до +num
    return numValue; // Возвращает сгенерированное случайное число
}

// Change Building Colors
var setTintNum = true; // Переменная для отслеживания состояния изменения цвета (по умолчанию true)
function setTintColor() { // Определяет функцию setTintColor для изменения цвета
    if (setTintNum) { // Проверяет, если setTintNum равно true
        setTintNum = false; // Устанавливает setTintNum в false, чтобы изменить состояние
        var setColor = 0x000000; // Устанавливает цвет (черный) в переменную setColor
    } else { // Если setTintNum равно false
        setTintNum = true; // Устанавливает setTintNum обратно в true
        var setColor = 0x000000; // Устанавливает цвет (черный) в переменную setColor (возможно, здесь подразумевался другой цвет)
    }
    return setColor; // Возвращает установленный цвет
}

// Create City
function init() { // Определяет функцию init для инициализации города
    var segments = 2; // Устанавливает количество сегментов для геометрии куба
    for (var i = 1; i < 100; i++) { // Цикл для создания 99 кубов
        var geometry = new THREE.CubeGeometry(1, 0, 0, segments, segments, segments); // Создает геометрию куба с заданными сегментами
        var material = new THREE.MeshStandardMaterial({ // Создает стандартный материал для куба
            color: setTintColor(), // Устанавливает цвет материала, вызывая функцию setTintColor
            wireframe: false, // Устанавливает режим отображения без каркасной сетки
            shading: THREE.SmoothShading, // Устанавливает сглаживание для материала
            side: THREE.DoubleSide // Устанавливает отображение материала с обеих сторон
        });
        var wmaterial = new THREE.MeshLambertMaterial({ // Создает ламбертовский материал для каркасной сетки
            color: 0xFFFFFF, // Устанавливает цвет материала на белый
            wireframe: true, // Включает каркасный режим отображения
            transparent: true, // Устанавливает прозрачность материала
            opacity: 0.03, // Устанавливает уровень прозрачности
            side: THREE.DoubleSide // Устанавливает отображение материала с обеих сторон
        });

        var cube = new THREE.Mesh(geometry, material); // Создает куб с заданной геометрией и материалом
        var wire = new THREE.Mesh(geometry, material); // Создает каркасный куб (не используется в дальнейшем)
        var floor = new THREE.Mesh(geometry, material); // Создает пол с заданной геометрией и материалом
        var wfloor = new THREE.Mesh(geometry, material); // Создает каркасный пол (не используется в дальнейшем)

        cube.add(wfloor); // Добавляет каркасный пол к кубу
        cube.setShadow = true; // Устанавливает свойство для куба (не используется в THREE.js)
        cube.receiveShadow = true; // Указывает, что куб может принимать тени
        cube.rotationValue = 0.1 + Math.abs(mathRandom(8)); // Устанавливает значение вращения куба
        floor.scale.y = 0.05; // Уменьшает высоту пола
        cube.scale.y = 0.1 + Math.abs(mathRandom(8)); // Устанавливает высоту куба с учетом случайного значения

        var cubeWidth = 0.9; // Устанавливает максимальную ширину куба
        cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth); // Устанавливает ширину и глубину куба с учетом случайного значения
        cube.position.x = Math.round(mathRandom()); // Устанавливает случайное значение для позиции по оси X
        cube.position.z = Math.round(mathRandom()); // Устанавливает случайное значение для позиции по оси Z

        floor.position.set(cube.position.x, 0, cube.position.z); // Устанавливает позицию пола в соответствии с позицией куба

        town.add(floor); // Добавляет пол в объект города
        town.add(cube); // Добавляет куб в объект города
    };

    // Particulars
    var gmaterial = new THREE.MeshToonMaterial({ color: 0xFFFF00, side: THREE.DoubleSide }); // Создает материал с эффектом "мультяшной" заливки (toon) желтого цвета, отображаемый с обеих сторон
    var gparticular = new THREE.CircleGeometry(0.01, 3); // Создает геометрию круга с радиусом 0.01 и 3 сегментами
    var aparticular = 5; // Устанавливает максимальное значение для случайного позиционирования частиц

    for (var h = 1; h < 300; h++) { // Цикл для создания 299 частиц
        var particular = new THREE.Mesh(gparticular, gmaterial); // Создает mesh (объект) для каждой частицы с заданной геометрией и материалом
        particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular)); // Устанавливает случайную позицию частицы в пределах заданного диапазона
        particular.rotation.set(mathRandom(), mathRandom(), mathRandom()); // Устанавливает случайное вращение частицы по всем осям
        smoke.add(particular); // Добавляет частицу в объект "дым" (smoke)
    }

    var pmaterial = new THREE.MeshPhongMaterial({ // Создает материал Phong для плоскости
        color: 0x000000, // Устанавливает цвет материала на черный
        side: THREE.DoubleSide, // Устанавливает отображение материала с обеих сторон
        roughness: 10, // Устанавливает шероховатость материала
        metalness: 0.6, // Устанавливает металлический эффект материала
        opacity: 0.9, // Устанавливает уровень прозрачности материала
        transparent: true // Указывает, что материал прозрачный
    });

    var pgeometry = new THREE.PlaneGeometry(60, 60); // Создает геометрию плоскости размером 60x60
    var pelement = new THREE.Mesh(pgeometry, pmaterial); // Создает mesh (объект) для плоскости с заданной геометрией и материалом
    pelement.rotation.x = -90 * Math.PI / 180; // Поворачивает плоскость на -90 градусов по оси X (в радианах)
    pelement.position.y = -0.001; // Устанавливает позицию плоскости немного ниже нуля по оси Y
    pelement.receiveShadow = true; // Указывает, что плоскость может принимать тени
    city.add(pelement); // Добавляет плоскость в объект города
};

// Mouse functions
var raycaster = new THREE.Raycaster(); // Создает новый экземпляр Raycaster для определения пересечений с объектами в сцене
var mouse = new THREE.Vector2(), INTERSECTED; // Создает вектор для хранения координат мыши и переменную для хранения пересеченного объекта
var intersected; // Переменная для хранения информации о пересеченном объекте (не используется в данном коде)

function onMouseMove(e) { // Функция для обработки движения мыши
    e.preventDefault(); // Отменяет стандартное поведение браузера (например, прокрутку)
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1; // Нормализует координату X мыши в диапазоне от -1 до 1
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1; // Нормализует координату Y мыши в диапазоне от -1 до 1 (инвертирует ось Y)
}

function onDocumentTouchStart(e) { // Функция для обработки начала касания на мобильных устройствах
    if (e.touches.length == 1) { // Проверяет, если одно касание
        e.preventDefault(); // Отменяет стандартное поведение браузера
        mouse.x = e.touches[0].pageX - window.innerWidth / 2; // Устанавливает координату X мыши в зависимости от положения касания
        mouse.y = e.touches[0].pageY - window.innerHeight / 2; // Устанавливает координату Y мыши в зависимости от положения касания
    }
}

function onDocumentTouchMove(e) { // Функция для обработки движения касания на мобильных устройствах
    if (e.touches.length == 1) { // Проверяет, если одно касание
        e.preventDefault(); // Отменяет стандартное поведение браузера
        mouse.x = e.touches[0].pageX - window.innerWidth / 2; // Устанавливает координату X мыши в зависимости от положения касания
        mouse.y = e.touches[0].pageY - window.innerHeight / 2; // Устанавливает координату Y мыши в зависимости от положения касания
    }
}

// Добавляет обработчики событий для мыши и касания
window.addEventListener('mousemove', onMouseMove, false); // Обрабатывает движение мыши
window.addEventListener('touchstart', onDocumentTouchStart, false); // Обрабатывает начало касания
window.addEventListener('touchmove', onDocumentTouchMove, false); // Обрабатывает движение касания

// Create lights
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4); // Создает окружающий свет белого цвета с интенсивностью 4
var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10); // Создает направленный свет (spotlight) белого цвета с интенсивностью 20 и дальностью 10
var lightBack = new THREE.PointLight(0xFFFFFF, 0.5); // Создает точечный свет (point light) белого цвета с интенсивностью 0.5
var spotLightHelper = new THREE.SpotLightHelper(lightFront); // Создает вспомогательный объект для визуализации направления и области действия направленного света

// Настройка параметров направленного света
lightFront.rotation.x = 45 * Math.PI / 180; // Поворачивает направленный свет на 45 градусов по оси X (в радианах)
lightFront.rotation.z = -45 * Math.PI / 180; // Поворачивает направленный свет на -45 градусов по оси Z (в радианах)
lightFront.position.set(5, 5, 5); // Устанавливает позицию направленного света в пространстве
lightFront.castShadow = true; // Указывает, что направленный свет может отбрасывать тени
lightFront.shadow.mapSize.width = 6000; // Устанавливает ширину карты теней для направленного света
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width; // Устанавливает высоту карты теней равной ширине
lightFront.penumbra = 0.1; // Устанавливает значение полутени для направленного света
lightBack.position.set(0, 6, 0); // Устанавливает позицию точечного света в пространстве

smoke.position.y = 2; // Устанавливает позицию объекта "дым" (smoke) на высоту 2 по оси Y

// Добавляет источники света и объекты в сцену
scene.add(ambientLight); // Добавляет окружающий свет в сцену
city.add(lightFront); // Добавляет направленный свет в объект города
scene.add(lightBack); // Добавляет точечный свет в сцену
scene.add(city); // Добавляет объект города в сцену
city.add(smoke); // Добавляет объект "дым" в город
city.add(town); // Добавляет объект "город" (town) в город

// Grid Helper
var gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000); // Создает вспомогательную сетку размером 60 с 120 делениями, красного цвета с черным фоном
city.add(gridHelper); // Добавляет вспомогательную сетку в объект города

// Cars World
var createCars = function (cScale = 2, cPos = 20, cColor = 0xFFFF00) { // Определяет функцию createCars с параметрами: масштаб, позиция и цвет (по умолчанию желтый)
    var cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide }); // Создает материал с эффектом "мультяшной" заливки (toon) с заданным цветом, отображаемый с обеих сторон
    var cGeo = new THREE.CubeGeometry(1, cScale / 40, cScale / 40); // Создает геометрию куба с шириной 1 и высотой/глубиной, зависящими от масштаба
    var cElem = new THREE.Mesh(cGeo, cMat); // Создает mesh (объект) для автомобиля с заданной геометрией и материалом
    var cAmp = 3; // Устанавливает амплитуду для случайного позиционирования

    if (createCarPos) { // Проверяет, если переменная createCarPos равна true
        createCarPos = false; // Устанавливает createCarPos в false, чтобы изменить состояние
        cElem.position.x = -cPos; // Устанавливает позицию автомобиля по оси X на -cPos
        cElem.position.z = (mathRandom(cAmp)); // Устанавливает случайную позицию автомобиля по оси Z в пределах амплитуды

        // Анимирует движение автомобиля по оси X с использованием TweenMax
        TweenMax.to(cElem.position, 3, { x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3) });
    } else { // Если createCarPos равно false
        createCarPos = true; // Устанавливает createCarPos обратно в true
        cElem.position.x = (mathRandom(cAmp)); // Устанавливает случайную позицию автомобиля по оси X в пределах амплитуды
        cElem.position.z = -cPos; // Устанавливает позицию автомобиля по оси Z на -cPos
        cElem.rotation.y = 90 * Math.PI / 180; // Поворачивает автомобиль на 90 градусов по оси Y (в радианах)

        // Анимирует движение автомобиля по оси Z с использованием TweenMax
        TweenMax.to(cElem.position, 5, { z: cPos, repeat: -1, yoyo: true, delay: mathRandom(3), ease: Power1.easeInOut });
    }
    
    cElem.receiveShadow = true; // Указывает, что автомобиль может принимать тени
    cElem.castShadow = true; // Указывает, что автомобиль может отбрасывать тени
    cElem.position.y = Math.abs(mathRandom(5)); // Устанавливает случайную высоту автомобиля по оси Y
    city.add(cElem); // Добавляет автомобиль в объект города
};

var generateLines = function () { // Определяет функцию generateLines для создания линий автомобилей
    for (var i = 0; i < 60; i++) { // Цикл для создания 60 автомобилей
        createCars(0.1, 20); // Вызывает функцию createCars с заданными параметрами (масштаб 0.1 и позиция 20)
    }
};

// Camera Position
var cameraSet = function () { // Определяет функцию cameraSet для установки камеры
    createCars(0.1, 20, 0xFFFFFF); // Создает автомобили с заданными параметрами (масштаб 0.1, позиция 20, цвет белый)
};

// Animate functions
var animate = function () { // Определяет функцию animate для анимации сцены
    var time = Date.now() * 0.00005; // Получает текущее время и масштабирует его для использования в анимации
    requestAnimationFrame(animate); // Запрашивает следующий кадр анимации, создавая бесконечный цикл

    // Обновляет вращение города в зависимости от положения мыши
    city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed; // Вращает город по оси Y в зависимости от положения мыши
    city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed; // Вращает город по оси X в зависимости от положения мыши

    // Ограничивает вращение города по оси X в пределах от -0.05 до 1
    if (city.rotation.x < -0.05) {
        city.rotation.x = -0.05; // Устанавливает максимальное значение вращения по оси X
    } else if (city.rotation.x > 1) {
        city.rotation.x = 1; // Устанавливает минимальное значение вращения по оси X
    }

    var cityRotation = Math.sin(Date.now() / 5000) * 13; // Вычисляет вращение города на основе синусоиды для создания эффекта колебания

    // Цикл для обработки объектов в городе (пока не используется)
    for (let i = 0, l = town.children.length; i < l; i++) {
        var object = town.children[i]; // Получает каждый объект в городе
    }

    // Обновляет вращение объекта "дым"
    smoke.rotation.y += 0.01; // Вращает дым по оси Y
    smoke.rotation.x += 0.01; // Вращает дым по оси X

    camera.lookAt(city.position); // Устанавливает камеру так, чтобы она смотрела на позицию города
    renderer.render(scene, camera); // Рендерит сцену с использованием камеры
}

// Calling Main Functions
generateLines();
init();
animate();