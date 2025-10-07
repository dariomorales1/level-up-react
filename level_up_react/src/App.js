import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home';
import { Catalogo } from './pages/catalogo';
import './App.css';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/catalogo" element={<Catalogo/>} />
        </Routes>
      </Router>
  );
}

export default App;
