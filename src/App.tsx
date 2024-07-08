import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherPanel from './components/WeatherPanel';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
