// Получаем элементы DOM
const canvas = document.getElementById('canvas');
const resetButton = document.getElementById('reset-button');
const clusterButton = document.getElementById('cluster-button');

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

function clusterPoints() {
    const numClusters = 3;
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    const clusters = [];
    
    // Инициализация кластеров
    for (let i = 0; i < numClusters; i++) {
    clusters.push({
    points: [],
    color: colors[i],
    center: {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
    }
    });
    }
    
    // Кластеризация точек
    let changed = true;
    while (changed) {
    // Очистка массивов точек кластеров
    for (let i = 0; i < numClusters; i++) {
    clusters[i].points = [];
    }
    // Добавление точек в соответствующие кластеры
for (let i = 0; i < points.length; i++) {
    let minDist = Infinity;
    let minIndex = -1;
    for (let j = 0; j < numClusters; j++) {
      const dist = Math.sqrt((points[i].x - clusters[j].center.x) ** 2 + (points[i].y - clusters[j].center.y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        minIndex = j;
      }
    }
    clusters[minIndex].points.push(points[i]);
  }
  
  // Пересчет центров кластеров
  changed = false;
  for (let i = 0; i < numClusters; i++) {
    const oldCenter = clusters[i].center;
    const numPoints = clusters[i].points.length;
    if (numPoints > 0) {
      const sumX = clusters[i].points.reduce((acc, cur) => acc + cur.x, 0);
      const sumY = clusters[i].points.reduce((acc, cur) => acc + cur.y, 0);
      clusters[i].center = {
        x: sumX / numPoints,
        y: sumY / numPoints
      };
      if (clusters[i].center.x !== oldCenter.x || clusters[i].center.y !== oldCenter.y) {
        changed = true;
      }
    }
  }
}
// Отрисовка кластеров
for (let i = 0; i < numClusters; i++) {
    ctx.fillStyle = clusters[i].color;
    for (let j = 0; j < clusters[i].points.length; j++) {
    ctx.beginPath();
    ctx.arc(clusters[i].points[j].x, clusters[i].points[j].y, 5, 0, 2 * Math.PI);
    ctx.fill();
    }
    }
    }
// Обработчики событий
canvas.addEventListener('click', addPoint);
resetButton.addEventListener('click', resetPoints);
clusterButton.addEventListener('click', clusterPoints);