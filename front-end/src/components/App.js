import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Comic from './Comic';
import { MaxNumContext } from '../contexts/MaxNumContext'

import style from '../styles/main.module.css'

const URL_PLAIN = `http://localhost:8080`

function App() {

  useEffect(() => {
    const fetchMaxNum = async () => {
      const res = await fetch(URL_PLAIN);
      const data = await res.json();
      setMaxNum(data.num);
    };

    fetchMaxNum();
  })
  const [maxNum, setMaxNum] = useState(0);

  return (
    <BrowserRouter>
      <MaxNumContext.Provider value={{ maxNum, setMaxNum }}>
        <div>
          <h1 className={style.title}>Comics!</h1>
          <Routes>
            <Route path="/" exact element={<Comic />} />
            <Route path="/:number" element={<Comic />} />
          </Routes>
        </div>
      </MaxNumContext.Provider>
    </BrowserRouter>
  );
}

export default App;