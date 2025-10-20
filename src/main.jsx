import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import IntegrationFlowchart from './IntegrationFlowchart.jsx'
import './index.css'

function MainApp() {
  const [currentPage, setCurrentPage] = useState('network');

  const handlePageSwitch = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'rgba(255, 255, 255, 0.95)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        paddingLeft: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderBottom: '2px solid #eee'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        }}>Network Management System</h1>
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', marginRight: '20px' }}>
          <button
            onClick={() => handlePageSwitch('network')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              background: currentPage === 'network' ? '#FF6B6B' : '#ddd',
              color: currentPage === 'network' ? 'white' : '#333',
              transition: 'all 0.3s'
            }}
          >
            Network Topology
          </button>
          <button
            onClick={() => handlePageSwitch('integration')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              background: currentPage === 'integration' ? '#9D6BFF' : '#ddd',
              color: currentPage === 'integration' ? 'white' : '#333',
              transition: 'all 0.3s'
            }}
          >
            Supply Chain Integration
          </button>
        </div>
      </div>
      <div style={{ marginTop: '60px' }}>
        {currentPage === 'network' ? <App /> : <IntegrationFlowchart />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
)
