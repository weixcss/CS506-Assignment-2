import React from 'react';
import Plot from 'react-plotly.js';

const KMeansVisualization = ({ dataPoints, centroids, clusters, onManualCentroid, isManualMode }) => {
  // Handle click on plot for manual centroid selection
  const handlePlotClick = (event) => {
    if (isManualMode && event.points && event.points.length > 0) {
      const { x, y } = event.points[0];
      onManualCentroid({ x, y }); // Pass the clicked point as a centroid
    }
  };

  return (
    <Plot
      data={[
        {
          x: dataPoints.map(point => point.x),
          y: dataPoints.map(point => point.y),
          mode: 'markers',
          type: 'scatter',
          marker: { color: clusters, size: 8 },
          name: 'Data Points',
        },
        {
          x: centroids.map(centroid => centroid.x),
          y: centroids.map(centroid => centroid.y),
          mode: 'markers',
          marker: { color: 'red', size: 12, symbol: 'x' },
          name: 'Centroids',
        },
      ]}
      layout={{
        title: 'KMeans Clustering Visualization',
        xaxis: { title: 'X Axis' },
        yaxis: { title: 'Y Axis' },
        clickmode: 'event', // Enable click mode to handle manual selection
        showlegend: true,
      }}
      onClick={isManualMode ? handlePlotClick : undefined} // Handle click only in manual mode
    />
  );
};

export default KMeansVisualization;
