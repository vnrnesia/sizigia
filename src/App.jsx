import React from 'react';
import FrameScroll from './components/FrameScroll';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <FrameScroll />
      </div>

      <div style={{ minHeight: '100vh', padding: '4rem 2rem', background: '#f5f5f5', marginTop: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Content</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: 800, lineHeight: 1.6 }}>
          Content
        </p>
      </div>
    </>
  );
}

export default App;
