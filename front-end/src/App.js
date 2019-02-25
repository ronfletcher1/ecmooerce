import React, { Component } from 'react';
import './App.css';
import Home from './components/home/Home';

class App extends Component {
  render() {
    return (
      <div className="container">

         <h1>Sanity Check!!</h1>
         <Home />

      </div>
    );
  }
}

export default App;
