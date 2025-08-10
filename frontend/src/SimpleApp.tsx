import { useState, useEffect } from 'react';

function SimpleApp() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App starting...');
    setTimeout(() => {
      console.log('Loading complete');
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        Loading your portfolio...
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
      <p>Dashboard is working!</p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h2>Test Data</h2>
        <p>If you can see this, React is working correctly.</p>
      </div>
    </div>
  );
}

export default SimpleApp;
