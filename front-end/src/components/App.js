import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Comic from './Comic';

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>xkcd app</h1>
        <Routes>
          <Route path="/" exact element={<Comic />} />
          <Route path="/:number" element={<Comic />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;