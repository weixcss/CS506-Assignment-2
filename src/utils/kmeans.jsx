export function kMeans(dataPoints, k, initMethod = "random", manualCentroids = []) {
  let centroids = initializeCentroids(dataPoints, k, initMethod, manualCentroids);
  let clusters = assignClusters(dataPoints, centroids);
  let converged = false;

  function initializeCentroids(points, k, method, manualCentroids) {
    if (method === "random") {
      return randomCentroids(points, k);
    } else if (method === "farthest") {
      return farthestFirst(points, k);
    } else if (method === "kmeans++") {
      return kmeansPlusPlus(points, k);
    } else if (method === "manual") {
      return manualCentroids; // Directly use manual centroids selected by the user
    }
  }

  function randomCentroids(points, k) {
    let centroids = [];
    const pointCount = points.length;
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * pointCount);
      centroids.push(points[randomIndex]);
    }
    return centroids;
  }

  function farthestFirst(points, k) {
    let centroids = [points[Math.floor(Math.random() * points.length)]];
    for (let i = 1; i < k; i++) {
      let farthestPoint = points.reduce((farthest, point) => {
        const minDistanceToCentroid = Math.min(...centroids.map(c => distance(c, point)));
        return minDistanceToCentroid > farthest.maxDistance ? { point, maxDistance: minDistanceToCentroid } : farthest;
      }, { point: null, maxDistance: -Infinity }).point;
      centroids.push(farthestPoint);
    }
    return centroids;
  }

  function kmeansPlusPlus(points, k) {
    let centroids = [points[Math.floor(Math.random() * points.length)]];
    for (let i = 1; i < k; i++) {
      let distances = points.map(point => Math.min(...centroids.map(c => distance(c, point))));
      let sumDistances = distances.reduce((sum, d) => sum + d, 0);
      let randomValue = Math.random() * sumDistances;
      for (let j = 0; j < distances.length; j++) {
        randomValue -= distances[j];
        if (randomValue <= 0) {
          centroids.push(points[j]);
          break;
        }
      }
    }
    return centroids;
  }

  function assignClusters(points, centroids) {
    return points.map(point => {
      let closestCentroidIndex = centroids.reduce((closestIndex, centroid, index) => {
        return distance(centroid, point) < distance(centroids[closestIndex], point) ? index : closestIndex;
      }, 0);
      return closestCentroidIndex;
    });
  }

  function updateCentroids(points, clusters, k) {
    let newCentroids = Array(k).fill(null).map(() => ({ x: 0, y: 0, count: 0 }));
    points.forEach((point, i) => {
      let cluster = clusters[i];
      newCentroids[cluster].x += point.x;
      newCentroids[cluster].y += point.y;
      newCentroids[cluster].count += 1;
    });
    return newCentroids.map(centroid => ({
      x: centroid.x / centroid.count,
      y: centroid.y / centroid.count,
    }));
  }

  function iterateClusters() {
    let newCentroids = updateCentroids(dataPoints, clusters, k);
    let centroidsChanged = newCentroids.some((c, i) => distance(c, centroids[i]) > 1e-4); // A small threshold for convergence

    centroids = newCentroids;
    clusters = assignClusters(dataPoints, centroids);

    converged = !centroidsChanged;

    return { centroids, clusters, converged };
  }

  function hasConverged() {
    return converged;
  }

  function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  return { centroids, clusters, iterateClusters, hasConverged };
}
