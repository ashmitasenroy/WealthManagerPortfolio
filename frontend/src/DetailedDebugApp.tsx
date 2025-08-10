import { useState, useEffect } from 'react';

function DebugApp() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('Initializing...');

  useEffect(() => {
    const debugLoadData = async () => {
      try {
        console.log('Step 1: Starting debug load');
        setStep('Step 1: Starting debug load');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Step 2: Importing data modules');
        setStep('Step 2: Importing data modules');
        
        const { holdingsData, portfolioSummary } = await import('./data/portfolioData');
        
        console.log('Step 3: Data imported successfully');
        setStep('Step 3: Data imported successfully');
        console.log('Holdings count:', holdingsData.length);
        console.log('Portfolio summary:', portfolioSummary);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Step 4: Processing holdings data');
        setStep('Step 4: Processing holdings data');
        
        const processedHoldings = holdingsData.map(h => ({
          symbol: h.symbol,
          name: h.companyName,
          value: h.value
        }));
        
        console.log('Step 5: Data processing complete');
        setStep('Step 5: Data processing complete');
        console.log('Processed holdings:', processedHoldings.slice(0, 3));
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Step 6: Loading complete');
        setStep('Step 6: Loading complete - Success!');
        setLoading(false);
        
      } catch (error) {
        console.error('Error in debug load:', error);
        setStep(`Error: ${error}`);
        setLoading(false);
      }
    };

    debugLoadData();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      background: '#242424', 
      color: 'rgba(255, 255, 255, 0.87)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: '24px', marginBottom: '20px' }}>
        Debug Dashboard
      </h1>
      
      {loading ? (
        <div style={{ 
          background: '#1e293b', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading Status: IN PROGRESS</div>
          <div style={{ fontSize: '16px', color: '#60a5fa' }}>{step}</div>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: '#374151', 
            borderRadius: '2px',
            marginTop: '10px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '50%', 
              height: '100%', 
              background: '#60a5fa',
              animation: 'pulse 2s infinite'
            }}></div>
          </div>
        </div>
      ) : (
        <div style={{ 
          background: '#059669', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading Status: COMPLETE</div>
          <div style={{ fontSize: '16px' }}>{step}</div>
        </div>
      )}
      
      <div style={{ 
        background: '#1e293b', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Debug Information:</h3>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
        <p>Loading state: {loading ? 'true' : 'false'}</p>
        <p>Current step: {step}</p>
      </div>
      
      {!loading && (
        <div style={{ 
          background: '#1e293b', 
          padding: '20px', 
          borderRadius: '8px'
        }}>
          <h3 style={{ marginBottom: '10px' }}>Next Steps:</h3>
          <p>✅ Data import working</p>
          <p>✅ Component rendering working</p>
          <p>✅ State management working</p>
          <p>→ Ready to test full dashboard</p>
        </div>
      )}
    </div>
  );
}

export default DebugApp;
