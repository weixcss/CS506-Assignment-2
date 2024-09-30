import React, { useState } from 'react';

const KMeansControls = ({ onGenerate, onManualMode, onStep, onRunToEnd, onReset, isManualMode, selectedCentroids }) => {
  const [k, setK] = useState(3); // Default number of clusters
  const [initMethod, setInitMethod] = useState('random'); // Default initialization method

  const handleGenerateClick = () => {
    if (initMethod === 'manual') {
      onManualMode(); // Switch to manual mode immediately
    } else {
      if (k < 1) {
        alert("Number of clusters (k) must be at least 1");
        return;
      }
      onGenerate(k, initMethod); // Triggers the generate new dataset function
    }
  };

  // Disable buttons if in manual mode and centroids are not yet selected
  const disableButtons = isManualMode && selectedCentroids < 3;

  return (
    <div className="controls-container">
      <h1>KMeans Clustering Algorithm</h1>
      
      <label htmlFor="k-input">Number of Clusters (k):</label>
      <input
        type="number"
        id="k-input"
        value={k}
        onChange={(e) => setK(Number(e.target.value))}
        min="1"
      />

      <label htmlFor="init-method">Initialization Method:</label>
      <select
        id="init-method"
        value={initMethod}
        onChange={(e) => setInitMethod(e.target.value)}
      >
        <option value="random">Random</option>
        <option value="farthest">Farthest First</option>
        <option value="kmeans++">KMeans++</option>
        <option value="manual">Manual</option>
      </select>

      <div className="button-container">
        <button onClick={handleGenerateClick}>Generate New Dataset</button>
        <button 
          onClick={onStep} 
          disabled={disableButtons} 
          style={disableButtons ? { backgroundColor: '#ddd', cursor: 'not-allowed' } : {}}
        >
          Step Through KMeans
        </button>
        <button 
          onClick={onRunToEnd} 
          disabled={disableButtons} 
          style={disableButtons ? { backgroundColor: '#ddd', cursor: 'not-allowed' } : {}}
        >
          Run to Convergence
        </button>
        <button onClick={onReset}>Reset Algorithm</button>
      </div>
    </div>
  );
};

export default KMeansControls;