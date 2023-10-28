import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import JoinPage from './register/Join';
import './App.css';
import { Socketer } from './utils/socket';

function App() {
  return (
    <Socketer>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<JoinPage />} />
        </Routes>
      </BrowserRouter>
    </Socketer>
  );
}

export default React.memo(App);
