// Получаем элементы DOM
const canvas = document.getElementById('canvas');
const resetButton = document.getElementById('reset-button');
const clusterButton = document.getElementById('start-button');

// Задаем размеры холста
canvas.width = 1000;
canvas.height = 1000;

// Получаем контекст рисования
const ctx = canvas.getContext('2d');

// Создаем массив для хранения точек
let points = [];

// Функция для добавления точки
function addPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({x, y});
    drawPoints();
}

// Добавляем обработчик клика по холсту
canvas.addEventListener('click', function(event) {
    addPoint(event);
    drawPoints();
});
// Функция для отрисовки точек
function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}
// Добавляем обработчик клика по кнопке "Очистить"
resetButton.addEventListener('click', function() {
resetPoints();
});

// Функция для очистки поля
function resetPoints() {
points = [];
drawPoints();
}

