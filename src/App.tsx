import React from 'react';
import logo from './logo.svg';
import './App.css';
// import Home from './parkingapp/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LotDetail from './parkingapp/parking_lot_details';
import { Provider } from 'react-redux';
import store from './parkingapp/store/store';
import Home from './signup_page/Home';


function App() {
  return (
    <div className='mainContainer'>
      <Provider store={store} >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/parkinglot/:number' element={<LotDetail />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
