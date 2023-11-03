import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RegisterPage from './register/Register';
import LoginPage from './login/Login';
import './App.css';
import { Socketer } from './utils/socket';

function App() {
  return (
    <Socketer>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </Socketer>
  );
}

export default React.memo(App);
