import React, { useState } from 'react';
import KMeansControls from './components/KMeansControls.jsx';
import KMeansVisualization from './components/KMeansVisualization.jsx';
import { kMeans } from './utils/kmeans.jsx';
import './App.css';

// Helper function to add a delay between steps
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [dataPoints, setDataPoints] = useState(generateRandomData());
  const [centroids, setCentroids] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [manualCentroids, setManualCentroids] = useState([]);
  const [manualMode, setManualMode] = useState(false);
  const [converged, setConverged] = useState(false);
  const [currentK, setCurrentK] = useState(3); // Default number of clusters
  const [initMethod, setInitMethod] = useState('random'); // Default initialization method
  const [kmeansInstance, setKmeansInstance] = useState(null); // Store KMeans instance

  // Generate a new dataset with fresh random points
  const handleGenerateNewDataset = (k, method) => {
    setDataPoints(generateRandomData());
    setCurrentK(k);
    setInitMethod(method);
    setCentroids([]); // Clear centroids
    setClusters([]); // Clear clusters
    setManualCentroids([]); // Clear manual selections
    setManualMode(method === 'manual'); // Set manual mode if manual method is selected
    setConverged(false); // Reset convergence status
    setKmeansInstance(null); // Reset the KMeans instance
  };

  // Switch to manual mode immediately disables buttons and sets state
  const handleManualMode = () => {
    setManualMode(true); // Enable manual mode immediately
    setManualCentroids([]); // Clear manual selections
    setCentroids([]); // Clear centroids
    setClusters([]); // Clear clusters
  };

  // Reset the current dataset but clear centroids and clusters
  const handleResetAlgorithm = () => {
    setCentroids([]); // Clear centroids
    setClusters([]); // Clear clusters
    setManualCentroids([]); // Clear manual selections
    setManualMode(false); // Exit manual mode
    setConverged(false); // Reset convergence status
    setKmeansInstance(null); // Reset the KMeans instance
  };

  // Handle manual centroid selection: plot centroids on each click
  const handleManualCentroid = (centroid) => {
    if (manualCentroids.length < 3) {
      const updatedCentroids = [...manualCentroids, centroid];
      setManualCentroids(updatedCentroids); // Plot the centroid immediately

      if (updatedCentroids.length === 3) {
        // Once 3 centroids are selected, initialize KMeans
        const { centroids, clusters } = kMeans(dataPoints, currentK, 'manual', updatedCentroids);
        setCentroids(centroids);
        setClusters(clusters);
        setManualMode(false); // Disable manual mode once 3 centroids are selected
        setConverged(false);
        setKmeansInstance(kMeans(dataPoints, currentK, 'manual', updatedCentroids)); // Initialize KMeans instance
      } else {
        // For 1 or 2 centroids, update centroids in plot without initializing KMeans
        setCentroids(updatedCentroids);
      }
    }
  };

  // Handle the "Step Through KMeans" button
  const handleStep = () => {
    if (converged || !kmeansInstance) {
      // Reinitialize KMeans if needed after reset
      if (!kmeansInstance && initMethod !== 'manual') {
        const kmeans = kMeans(dataPoints, currentK, initMethod);
        setKmeansInstance(kmeans);
        const { centroids, clusters, converged: isConverged } = kmeans.iterateClusters();
        setCentroids(centroids);
        setClusters(clusters);
        setConverged(isConverged);
        if (isConverged) alert('KMeans has converged');
        return;
      }
      return; // If already converged or no instance, do nothing
    }

    // Step through KMeans
    const { centroids: newCentroids, clusters: newClusters, converged: isConverged } = kmeansInstance.iterateClusters();
    setCentroids(newCentroids);
    setClusters(newClusters);
    setConverged(isConverged);
    if (isConverged) alert('KMeans has converged');
  };

  // Handle the "Run to Convergence" button with a delay between steps
  const handleRunToEnd = async () => {
    if (converged || !kmeansInstance) {
      // Reinitialize KMeans if needed after reset
      if (!kmeansInstance && initMethod !== 'manual') {
        let kmeans = kMeans(dataPoints, currentK, initMethod);
        setKmeansInstance(kmeans);
        let isConverged = false;

        // Automatically iterate through KMeans steps until convergence with a delay between each step
        while (!isConverged) {
          const { centroids: newCentroids, clusters: newClusters, converged: hasConverged } = kmeans.iterateClusters();
          setCentroids(newCentroids); // Update centroids
          setClusters(newClusters);   // Update clusters
          isConverged = hasConverged; // Check if converged
          setConverged(isConverged);
          await delay(1000); // Wait for 1 second between steps to visualize each step
        }

        alert('KMeans has converged'); // Show convergence alert
        return;
      }
      return; // If already converged or no instance, do nothing
    }

    let isConverged = false;

    // Automatically iterate through KMeans steps until convergence with a delay between each step
    while (!isConverged) {
      const { centroids: newCentroids, clusters: newClusters, converged: hasConverged } = kmeansInstance.iterateClusters();
      setCentroids(newCentroids); // Update centroids
      setClusters(newClusters);   // Update clusters
      isConverged = hasConverged; // Check if converged
      setConverged(isConverged);
      await delay(1000); // Wait for 1 second between steps to visualize each step
    }

    alert('KMeans has converged'); // Show convergence alert
  };

  return (
    <div>
      <KMeansControls
        onGenerate={handleGenerateNewDataset}
        onManualMode={handleManualMode} // Handle manual mode switch
        onStep={handleStep}
        onRunToEnd={handleRunToEnd}
        onReset={handleResetAlgorithm}
        isManualMode={manualMode} // Pass manual mode flag to disable buttons
        selectedCentroids={manualCentroids.length} // Pass number of selected centroids
      />
      <KMeansVisualization
        dataPoints={dataPoints}
        centroids={centroids}
        clusters={clusters}
        onManualCentroid={handleManualCentroid}
        isManualMode={manualMode} // Pass manual mode flag to allow centroid selection
      />
    </div>
  );
}

// Function to generate random dataset
function generateRandomData() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 });
  }
  return data;
}

export default App;
