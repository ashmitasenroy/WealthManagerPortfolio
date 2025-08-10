import React from 'react';

const SimpleTest: React.FC = () => {
  console.log('SimpleTest component rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      background: '#242424', 
      color: 'rgba(255, 255, 255, 0.87)',
      minHeight: '100vh' 
    }}>
      <h1 style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: '24px' }}>Simple Test Component</h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>If you can see this, React is working!</p>
      <div style={{ 
        background: '#007bff', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        Status: Component Loaded Successfully
      </div>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
        <p>React version: {React.version}</p>
      </div>
    </div>
  );
};

export default SimpleTest;
