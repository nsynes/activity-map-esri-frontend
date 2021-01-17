import React from "react";
import Main from './components/Main';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';

function App() {


  return (
    <BrowserRouter>
      <Route path='/' component={Main} />
    </BrowserRouter>
  );
}

export default App;
