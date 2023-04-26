// Получаем элементы DOM
const canvas = document.getElementById('canvas');
const resetButton = document.getElementById('reset-button');
const clusterButton = document.getElementById('cluster-button');

// Задаем размеры холста
canvas.width = 500;
canvas.height = 500;

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

// Функция для отрисовки точек
function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Функция для сброса точек
function resetPoints() {
    points = [];
    drawPoints();
}

// Функция для кластеризации точек
function clusterPoints() {

}

// Обработчики событий
canvas.addEventListener('click', addPoint);
resetButton.addEventListener('click', resetPoints);
clusterButton.addEventListener('click', clusterPoints);