const canvas = new fabric.Canvas('canvas');

canvas.on('mouse:down', function(options) {
  const x = options.e.clientX;
  const y = options.e.clientY;
  const point = new fabric.Circle({
    left: x,
    top: y,
    radius: 5,
    fill: 'red',
    selectable: false
  });
  canvas.add(point);
});
const clusterBtn = document.getElementById('cluster-btn');

clusterBtn.addEventListener('click', function() {
  const points = canvas.getObjects();
  const data = points.map(function(point) {
    return [point.left, point.top];
  });
  const kmeans = new KMeans();
  const clusters = kmeans.cluster(data, 3);
  clusters.forEach(function(cluster, index) {
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    cluster.forEach(function(pointIndex) {
      points[pointIndex].set('fill', color);
    });
  });
  canvas.renderAll();
});