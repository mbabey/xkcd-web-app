import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Comic from './Comic';
import { MaxNumContext } from '../contexts/MaxNumContext'

import style from '../styles/main.module.css'

function App() {

  const [maxNum, setMaxNum] = useState(0);

  useEffect(() => {
    const fetchMaxNum = async () => {
      const res = await fetch(process.env.REACT_APP_API_URL + '/maxnumber');
      const data = await res.json();
      setMaxNum(data.maxNum);
    };

    fetchMaxNum();
  }, [])
  
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