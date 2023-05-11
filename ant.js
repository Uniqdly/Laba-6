// Константы для муравьиного алгоритма
const ALPHA = 1; // Влияние феромона
const BETA = 2; // Влияние расстояния
const RHO = 0.5; // Коэффициент испарения феромона
const Q = 100; // Количество феромона, откладываемое муравьем на пути

// Создание матрицы расстояний между вершинами
function createDistanceMatrix(vertices) {
  const matrix = [];
  for (let i = 0; i < vertices.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < vertices.length; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        const dx = vertices[i].x - vertices[j].x;
        const dy = vertices[i].y - vertices[j].y;
        matrix[i][j] = Math.sqrt(dx * dx + dy * dy);
      }
    }
  }
  return matrix;
}

// Создание матрицы феромонов
function createPheromoneMatrix(vertices) {
  const matrix = [];
  for (let i = 0; i < vertices.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < vertices.length; j++) {
      matrix[i][j] = 1;
    }
  }
  return matrix;
}

// Вычисление вероятностей перехода муравья из вершины i в вершину j
function calculateProbabilities(i, j, pheromoneMatrix, distanceMatrix) {
  const numerator = Math.pow(pheromoneMatrix[i][j], ALPHA) * Math.pow(1 / distanceMatrix[i][j], BETA);
  let denominator = 0;
  for (let k = 0; k < pheromoneMatrix.length; k++) {
    if (k !== i) {
      denominator += Math.pow(pheromoneMatrix[i][k], ALPHA) * Math.pow(1 / distanceMatrix[i][k], BETA);
    }
  }
  return numerator / denominator;
}

// Выбор следующей вершины муравьем
function chooseNextVertex(ant, pheromoneMatrix, distanceMatrix) {
  const i = ant.currentVertex;
  const probabilities = [];
  for (let j = 0; j < pheromoneMatrix.length; j++) {
    if (j !== i && !ant.visitedVertices.includes(j)) {
      const probability = calculateProbabilities(i, j, pheromoneMatrix, distanceMatrix);
      probabilities.push({ vertex: j, probability: probability });
    }
  }
  const random = Math.random();
  let sum = 0;
  for (let k = 0; k < probabilities.length; k++) {
    sum += probabilities[k].probability;
    if (random <= sum) {
      return probabilities[k].vertex;
    }
  }
  return probabilities[probabilities.length - 1].vertex;
}

// Обновление матрицы феромонов
function updatePheromoneMatrix(pheromoneMatrix, ants, distanceMatrix) {
  for (let i = 0; i < pheromoneMatrix.length; i++) {
    for (let j = 0; j < pheromoneMatrix.length; j++) {
      if (i !== j) {
        let delta = 0;
        for (let k = 0; k < ants.length; k++) {
          const ant = ants[k];
          const index = ant.visitedVertices.indexOf(i);
          if (ant.visitedVertices.includes(j)) {
            delta += Q / distanceMatrix[i][j];
          } else if (index !== -1 && ant.visitedVertices[index + 1] === j) {
            delta += Q / distanceMatrix[i][j];
          }
        }
        pheromoneMatrix[i][j] = (1 - RHO) * pheromoneMatrix[i][j] + delta;
      }
    }
  }
}

// Создание муравьев
function createAnts(numAnts, startVertex) {
    const ants = [];
    for (let i = 0; i < numAnts; i++) {
    ants.push({ currentVertex: startVertex, visitedVertices: [startVertex] });
    }
    return ants;
    }
    
    // Нахождение кратчайшего пути между вершинами с помощью муравьиного алгоритма
    function findShortestPath(vertices) {
    const distanceMatrix = createDistanceMatrix(vertices);
    const pheromoneMatrix = createPheromoneMatrix(vertices);
    const startVertex = 0;
    const numAnts = 10;
    const maxIterations = 100;
    let shortestPath = null;
    let shortestDistance = Infinity;
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        const ants = createAnts(numAnts, startVertex);
        for (let step = 0; step < vertices.length - 1; step++) {
          for (let k = 0; k < ants.length; k++) {
            const ant = ants[k];
            const nextVertex = chooseNextVertex(ant, pheromoneMatrix, distanceMatrix);
            ant.currentVertex = nextVertex;
            ant.visitedVertices.push(nextVertex);
          }
        }
        for (let k = 0; k < ants.length; k++) {
          const ant = ants[k];
          const distance = calculatePathDistance(ant.visitedVertices, distanceMatrix);
          if (distance < shortestDistance) {
            shortestDistance = distance;
            shortestPath = ant.visitedVertices;
          }
        }
        updatePheromoneMatrix(pheromoneMatrix, ants, distanceMatrix);
      }
      
      return shortestPath;}
      // Вычисление длины пути
function calculatePathDistance(path, distanceMatrix) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
    distance += distanceMatrix[path[i]][path[i + 1]];
    }
    return distance;
    }
    
    // Отображение кратчайшего пути на холсте
    function drawShortestPath(path) {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(vertices[path[0]].x, vertices[path[0]].y);
    for (let i = 1; i < path.length; i++) {
    ctx.lineTo(vertices[path[i]].x, vertices[path[i]].y);
    }
    ctx.stroke();
    }
    
   