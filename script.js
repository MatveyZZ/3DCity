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
function init() {
    var segments = 2;
    for (var i = 1; i < 100; i++) {
        var geometry = new THREE.CubeGeometry(1, 0, 0, segments, segments, segments);
        var material = new THREE.MeshStandardMaterial({
            color: setTintColor(),
            wireframe: false,
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide
        });
        var wmaterial = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            wireframe: true,
            transparent: true,
            opacity: 0.03,
            side: THREE.DoubleSide
        });

        var cube = new THREE.Mesh(geometry, material);
        var wire = new THREE.Mesh(geometry, material);
        var floor = new THREE.Mesh(geometry, material);
        var wfloor = new THREE.Mesh(geometry, material);

        cube.add(wfloor);
        cube.setShadow = true;
        cube.receiveShadow = true;
        cube.rotationValue = 0.1 + Math.abs(mathRandom(8));
        floor.scale.y = 0.05;
        cube.scale.y = 0.1 + Math.abs(mathRandom(8));

        var cubeWidth = 0.9;
        cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
        cube.position.x = Math.round(mathRandom());
        cube.position.z = Math.round(mathRandom());

        floor.position.set(cube.position.x, 0, cube.position.z);

        town.add(floor);
        town.add(cube);
    };

    // Particulars
    var gmaterial = new THREE.MeshToonMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
    var gparticular = new THREE.CircleGeometry(0.01, 3);
    var aparticular = 5;

    for (var h = 1; h < 300; h++) {
        var particular = new THREE.Mesh(gparticular, gmaterial);
        particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular));
        particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
        smoke.add(particular);
    };

    var pmaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        roughness: 10,
        metalness: 0.6,
        opacity: 0.9,
        transparent: true
    });

    var pgeometry = new THREE.PlaneGeometry(60, 60);
    var pelement = new THREE.Mesh(pgeometry, pmaterial);
    pelement.rotation.x = -90 * Math.PI / 180;
    pelement.position.y = -0.001;
    pelement.receiveShadow = true;
    city.add(pelement);
};

// Mouse functions
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
var intersected;

function onMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
};

function onDocumentTouchStart(e) {
    if (e.touches.length == 1) {
        e.preventDefault();
        mouse.x = e.touches[0].pageX - window.innerWidth / 2;
        mouse.y = e.touches[0].pageY - window.innerHeight / 2;
    };
};
function onDocumentTouchMove(e) {
    if (e.touches.length == 1) {
        e.preventDefault();
        mouse.x = e.touches[0].pageX - window.innerWidth / 2;
        mouse.y = e.touches[0].pageY - window.innerHeight / 2;
    };
};

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchstart', onDocumentTouchStart, false);
window.addEventListener('touchmove', onDocumentTouchMove, false);

// Create lights
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
var lightBack = new THREE.PointLight(0xFFFFFF, 0.5);
var spotLightHelper = new THREE.SpotLightHelper(lightFront);

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
lightFront.penumbra = 0.1;
lightBack.position.set(0, 6, 0);

smoke.position.y = 2;

scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

// Grid Helper
var gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
city.add(gridHelper);

// Cars World
var createCars = function (cScale = 2, cPos = 20, cColor = 0xFFFF00) {
    var cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
    var cGeo = new THREE.CubeGeometry(1, cScale / 40, cScale / 40);
    var cElem = new THREE.Mesh(cGeo, cMat);
    var cAmp = 3;

    if (createCarPos) {
        createCarPos = false;
        cElem.position.x = -cPos;
        cElem.position.z = (mathRandom(cAmp));

        TweenMax.to(cElem.position, 3, { x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3) });
    } else {
        createCarPos = true;
        cElem.position.x = (mathRandom(cAmp));
        cElem.position.z = -cPos;
        cElem.rotation.y = 90 * Math.PI / 180;

        TweenMax.to(cElem.position, 5, { z: cPos, repeat: -1, yoyo: true, delay: mathRandom(3), ease: Power1.easeInOut });
    };
    cElem.receiveShadow = true;
    cElem.castShadow = true;
    cElem.position.y = Math.abs(mathRandom(5));
    city.add(cElem);
};

var generateLines = function () {
    for (var i = 0; i < 60; i++) {
        createCars(0.1, 20);
    };
};

// Camera Position
var cameraSet = function () {
    createCars(0.1, 20, 0xFFFFFF);
};

// Animate functions
var animate = function () {
    var time = Date.now() * 0.00005;
    requestAnimationFrame(animate);

    city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
    city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
    if (city.rotation.x < -0.05) {
        city.rotation.x = -0.05;
    } else if (city.rotation.x > 1) {
        city.rotation.x = 1;
    }
    var cityRotation = Math.sin(Date.now() / 5000) * 13;
    for (let i = 0, l = town.children.length; i < l; i++) {
        var object = town.children[i];
    }

    smoke.rotation.y += 0.01;
    smoke.rotation.x += 0.01;

    camera.lookAt(city.position);
    renderer.render(scene, camera);

}

// Calling Main Functions
generateLines();
init();
animate();