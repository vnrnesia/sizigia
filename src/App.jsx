import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrameScroll from './components/FrameScroll';
import Header from './components/Header';
import About from './components/About';
import ScrollToTop from './components/ScrollToTop'; // <== yeni bileşeni import et
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Bu her rota değişiminde sayfayı en üste çeker */}
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<FrameScroll />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

      <div style={{ 
        minHeight: '100vh', 
        marginTop: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
      </div>
    </Router>
  );
}

export default App;
