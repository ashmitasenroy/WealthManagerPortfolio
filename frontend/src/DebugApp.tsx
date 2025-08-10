import { useState, useEffect } from 'react';

function DebugApp() {
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDebugInfo('Component mounted');
    
    const loadData = async () => {
      try {
        addDebugInfo('Starting data load...');
        
        // Try to import the data
        const dataModule = await import('./data/portfolioData');
        addDebugInfo(`Data imported: ${Object.keys(dataModule).join(', ')}`);
        
        if (dataModule.holdingsData) {
          addDebugInfo(`Holdings data length: ${dataModule.holdingsData.length}`);
        }
        
        if (dataModule.portfolioSummary) {
          addDebugInfo(`Portfolio summary: ${JSON.stringify(dataModule.portfolioSummary)}`);
        }
        
        addDebugInfo('Data load complete, setting loading to false');
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        addDebugInfo(`Error loading data: ${error}`);
        setLoading(false);
      }
    };

    setTimeout(loadData, 500);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
        padding: '20px',
        color: 'white'
      }}>
        <h1>Loading your portfolio...</h1>
        <div style={{ marginTop: '20px' }}>
          <h3>Debug Info:</h3>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '10px', 
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            {debugInfo.map((info, index) => (
              <div key={index}>{info}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
      padding: '20px',
      color: 'white'
    }}>
      <h1>Portfolio Dashboard</h1>
      <p>Loading completed successfully!</p>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h3>Debug Log:</h3>
        <div style={{ 
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          {debugInfo.map((info, index) => (
            <div key={index}>{info}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DebugApp;
