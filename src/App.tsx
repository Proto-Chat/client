import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/Home';
import JoinPage from './pages/Join';
import SocialPage from './pages/Social';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/join' element={<JoinPage />} />
        <Route path='/social' element={<SocialPage />} />
        <Route path='/' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default React.memo(App);
