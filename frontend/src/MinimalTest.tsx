function MinimalTest() {
  console.log('MinimalTest component is rendering');
  console.log('Current time:', new Date().toLocaleTimeString());
  
  return (
    <div style={{
      backgroundColor: 'red',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>EMERGENCY TEST</h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>
        If you can see this RED background, React is working!
      </p>
      <div style={{ 
        backgroundColor: 'green', 
        padding: '30px', 
        marginTop: '30px', 
        borderRadius: '10px',
        fontSize: '28px'
      }}>
        ✅ SUCCESS: Component rendered at {new Date().toLocaleTimeString()}
      </div>
      <div style={{
        backgroundColor: 'blue',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '10px'
      }}>
        Browser console should show: "MinimalTest component is rendering"
      </div>
    </div>
  );
}

export default MinimalTest;
