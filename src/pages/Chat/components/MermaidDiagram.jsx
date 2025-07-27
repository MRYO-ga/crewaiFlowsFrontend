import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Arial, sans-serif'
});

const MermaidDiagram = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        setSvg(svg);
        setError('');
      } catch (err) {
        console.error('Mermaid rendering error details:', err);
        setError(`Chart rendering failed: ${err.message || 'Unknown syntax error'}`);
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart]);

  if (error) {
    return (
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#fff2f0', 
        border: '1px solid #ffccc7',
        borderRadius: '6px',
        color: '#cf1322'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div 
      style={{ 
        textAlign: 'center', 
        margin: '16px 0',
        padding: '12px',
        backgroundColor: '#fafafa',
        borderRadius: '6px',
        border: '1px solid #e8e8e8'
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;
